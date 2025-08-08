import { formatDateYYYYMMDD, formatYYYYMMDDtoMonthDayYear } from "@/lib/utils";
import { prisma } from "@/app/lib/prisma/prisma-singleton";
import { JobPost } from "@/types/employer";
import { STORAGE_URLS } from "@/constants/storage";
import { Applicant } from "@/types/job";
import { ApplicantDetail, WorkExperience } from "@/types/profile";
import { Prisma } from "@prisma/client";
import {
  fromPrismaAppStatus,
  fromPrismaJobType,
  fromPrismaWorkPeriod,
  fromPrismaWorkType,
  toPrismaJobStatus,
} from "@/types/enumMapper";
import { getEmployerBizLoc } from "@/app/services/employer-services";
import { JobStatus } from "@/constants/enums";
import { Skill } from "@/types/profile";
import { estimateExperienceMonths, formatExperience } from "@/utils/shared/experienceUtils";

// GET - Select cnt values for employer dashboard
export async function getActiveJobPostsCnt(userId: number, bizLocId: number): Promise<number> {
  const currDate = new Date();
  const currDateStr = formatDateYYYYMMDD(currDate);
  const count = await prisma.job_posts.count({
    where: {
      created_at: {
        lte: currDate,
      },
      deadline: {
        gte: currDateStr,
      },
      user_id: userId,
      status: "PUBLISHED",
    },
  });

  return count;
}

export async function getStatusUpdateCnt(userId: number, bizLocId: number): Promise<number> {
  const currDate = new Date();
  const tomorrow = new Date(currDate);
  tomorrow.setDate(currDate.getDate() + 1);
  const currDateStr = formatDateYYYYMMDD(currDate);
  const tomorrowDateStr = formatDateYYYYMMDD(tomorrow);
  const urgentJobPosts = await prisma.job_posts.findMany({
    where: {
      created_at: {
        lte: currDate,
      },
      business_loc_id: bizLocId,
      user_id: userId,
      status: "PUBLISHED",
      OR: [{ deadline: currDateStr }, { deadline: tomorrowDateStr }],
    },
    select: {
      id: true,
    },
  });

  const validJobPostIds = urgentJobPosts.map((post) => post.id);

  // 2. count applications
  const applicationCnt = await prisma.applications.count({
    where: {
      job_post_id: {
        in: validJobPostIds,
      },
    },
  });

  return applicationCnt;
}

export async function getAllApplicationsCnt(userId: number, bizLocId: number): Promise<number> {
  const currDate = new Date();
  const currDateStr = formatDateYYYYMMDD(currDate);

  const allJobPosts = await prisma.job_posts.findMany({
    where: {
      created_at: {
        lte: currDate,
      },
      deadline: {
        gte: currDateStr,
      },
      user_id: userId,
      status: "PUBLISHED",
    },
    select: {
      id: true,
    },
  });

  const validJobPostIds = allJobPosts.map((post) => post.id);

  // 2. count applications
  const applicationCnt = await prisma.applications.count({
    where: {
      job_post_id: {
        in: validJobPostIds,
      },
    },
  });

  return applicationCnt;
}

export async function getActiveJobPostsList(userId: number): Promise<JobPost[]> {
  const bizLocInfo = await getEmployerBizLoc(userId);
  if (!bizLocInfo) {
    console.log("No business location found for user:", userId);
    return [];
  }

  const currDate = new Date();
  const tomorrow = new Date(currDate);
  tomorrow.setDate(currDate.getDate() + 1);
  const tomorrowDateStr = formatDateYYYYMMDD(tomorrow);
  const currDateStr = formatDateYYYYMMDD(currDate);

  const activeJobPosts = await prisma.job_posts.findMany({
    where: {
      business_loc_id: bizLocInfo.id,
      user_id: userId,
      status: {
        in: ["PUBLISHED", "DRAFT"],
      },
      deadline: {
        gte: currDateStr,
      },
    },
    include: {
      _count: {
        select: {
          applications: true,
        },
      },
    },
    orderBy: {
      deadline: "asc",
    },
  });

  // console.log("bizLocInfo: ", bizLocInfo);
  const img_base_url = `${STORAGE_URLS.BIZ_LOC.PHOTO}`;
  const activeJobPostList: JobPost[] = activeJobPosts.map((post) => ({
    id: post.id.toString(),
    title: post.title,
    applicants: post._count.applications,
    businessName: bizLocInfo.name,
    coverImage: img_base_url.concat(bizLocInfo.logo_url ?? ""),
    deadline_date: formatYYYYMMDDtoMonthDayYear(post.deadline),
    description: post.description,
    location: bizLocInfo.address,
    needsUpdate: post.deadline === tomorrowDateStr || post.deadline === currDateStr,
    strt_date: formatYYYYMMDDtoMonthDayYear(formatDateYYYYMMDD(post.created_at)),
    type: post.work_type,
    views: 0,
    wage: post.wage,
    status: post.status,
  }));
  // console.log("activeJobPostList: ", activeJobPostList);
  return activeJobPostList;
}

/**
 * GET Applicants List for Job post
 * @param postId
 */
export async function getApplicantsList(postId: string): Promise<Applicant[]> {
  console.log("start - service");
  const res1 = await prisma.$queryRaw<
    Array<{
      application_id: bigint;
      profile_id: bigint;
      user_id: bigint;
      job_post_id: bigint;
      status: string;
      created_at: Date;
      name: string;
      img_url: string;
      description: string;
      applied_at: Date;
    }>
  >(Prisma.sql`
    SELECT
      b.id "application_id",
      a.id "profile_id",
      a.user_id,
      b.job_post_id,
      b.status,
      a.created_at,
      d.name,
      d.img_url,
      a.description,
      b.created_at "applied_at"
    FROM
      applicant_profiles a,
      applications b,
      job_posts c,
      users d
    WHERE
      a.user_id = d.id
      AND a.id = b.profile_id
      AND b.job_post_id = c.id
      AND c.id = ${Number(postId)};
  `);

  if (res1) {
    const res2 = await Promise.all(
      res1.map(async (applicant) => {
        const workExperience = await prisma.work_experiences.findMany({
          where: {
            profile_id: applicant.profile_id,
          },
        });
        const mappedWorkExps = workExperience.map((w) => ({
          company_name: w.company_name,
          job_type: fromPrismaJobType(w.job_type),
          start_year: w.start_year,
          work_period: fromPrismaWorkPeriod(w.work_period),
          work_type: fromPrismaWorkType(w.work_type),
          description: w.description,
        }));
        const totalMonths = estimateExperienceMonths(mappedWorkExps);
        const experienceLabel = formatExperience(totalMonths);

        return {
          application_id: Number(applicant.application_id),
          profile_id: Number(applicant.profile_id),
          user_id: Number(applicant.user_id),
          job_post_id: Number(applicant.job_post_id),
          status: fromPrismaAppStatus(applicant.status),
          created_at: applicant.created_at ? formatDateYYYYMMDD(applicant.created_at) : "",
          name: applicant.name,
          profile_image_url: applicant.img_url,
          description: applicant.description,
          applied_date: applicant.applied_at ? formatDateYYYYMMDD(applicant.applied_at) : "",
          experience: experienceLabel,
          work_experiences: mappedWorkExps,
        };
      })
    );
    console.log(res2);
    return res2;
  } else {
    return [];
  }
}

/**
 * GET Applicant Profile for the Job Post Application
 * @param postId
 * @param profileId
 * @param userId
 */
export async function getJobPostApplicantProfile(postId: string, appId: string, userId: number) {
  // validate if userId is the owner of the post
  const bigIntAppId = BigInt(appId);
  const valid = await prisma.job_posts.findFirst({
    where: {
      id: Number(postId),
      user_id: userId,
    },
    select: {
      id: true,
    },
  });
  if (!valid) {
    console.error("No job post found for job post id:", postId);
    return [];
  }

  // get profile id
  const profileId = await getProfileUserId(Number(appId));
  if (!profileId) {
    console.error("No profile found for the application:", appId);
    return [];
  }

  const workExperiences = await getProfileWorkExperiences(profileId);
  const profileSkills = await getProfilePracSkills(profileId);

  const result = await prisma.$queryRaw<
    Array<{
      application_id: number;
      profile_id: number;
      user_id: number;
      job_post_id: number;
      application_status: string;
      applicant_name: string;
      profile_img_url: string;
      profile_description: string;
      applied_date: string; // formatted as YYYYMMDD
      personality_profile_id: number | null;
      quiz_type_name_ko: string;
      quiz_type_name_en: string;
      quiz_type_desc_ko: string;
      quiz_type_desc_en: string;
    }>
  >(Prisma.sql`
    SELECT
      a.id AS application_id,
      b.id AS profile_id,
      c.id AS user_id,
      a.job_post_id,
      a.status AS application_status,
      c.name AS applicant_name,
      c.img_url AS profile_img_url,
      b.description AS profile_description,
      TO_CHAR(a.created_at, 'YYYYMMDD') AS applied_date,
      c.personality_profile_id,
      d.name_ko "quiz_type_name_ko",
      d.name_en "quiz_type_name_en",
      d.description_ko "quiz_type_desc_ko",
      d.description_en "quiz_type_desc_en"
    FROM applications a
    JOIN applicant_profiles b ON a.profile_id = b.id AND b.deleted_at IS NULL
    JOIN users c ON b.user_id = c.id AND c.deleted_at IS NULL AND c.role = 'APPLICANT'
    JOIN personality_profiles d ON c.personality_profile_id = d.id
    WHERE a.id = ${bigIntAppId}
    LIMIT 1;
  `);
  const formatted: ApplicantDetail | null =
    result.length > 0
      ? {
          application_id: Number(result[0].application_id),
          profile_id: Number(result[0].profile_id),
          user_id: Number(result[0].user_id),
          job_post_id: Number(result[0].job_post_id),
          application_status: fromPrismaAppStatus(result[0].application_status),
          applicant_name: result[0].applicant_name || undefined,
          profile_description: result[0].profile_description || undefined,
          applied_date: result[0].applied_date || undefined,
          profile_image_url: result[0].profile_img_url, // You can add this if it's part of users table or another join
          personality_profile_id: Number(result[0].personality_profile_id),
          work_experiences: workExperiences,
          profile_skills: profileSkills, // add workStyles if you fetch them elsewhere
          quiz_type_name_ko: result[0].quiz_type_name_ko,
          quiz_type_name_en: result[0].quiz_type_name_en,
          quiz_type_desc_ko: result[0].quiz_type_desc_ko,
          quiz_type_desc_en: result[0].quiz_type_desc_en,
        }
      : null;
  return formatted;
}

/**
 * POST update job post status
 * @param postId
 * @param status
 * @param userId
 */
export async function updateJobPostStatus(postId: string, status: JobStatus, userId: number) {
  const res = await prisma.job_posts.update({
    where: {
      id: Number(postId),
      user_id: userId,
    },
    data: {
      status: toPrismaJobStatus(status),
    },
  });
  return res.id.toString();
}

export async function getProfileUserId(appId: number) {
  const res = await prisma.applications.findFirst({
    where: {
      id: appId,
      deleted_at: null,
    },
    select: {
      profile_id: true,
    },
  });
  if (res) {
    return Number(res.profile_id);
  } else {
    return null;
  }
}

export async function getProfileWorkExperiences(profileId: number) {
  const workExperience = await prisma.work_experiences.findMany({
    where: {
      profile_id: profileId,
      deleted_at: null,
    },
    select: {
      company_name: true,
      job_type: true,
      start_year: true,
      work_period: true,
      work_type: true,
      description: true,
    },
    orderBy: {
      start_year: "asc",
    },
  });

  const res: WorkExperience[] = workExperience.map((w) => ({
    company_name: w.company_name,
    job_type: fromPrismaJobType(w.job_type),
    start_year: w.start_year,
    work_period: fromPrismaWorkPeriod(w.work_period), // enum 매핑 함수 필요
    work_type: fromPrismaWorkType(w.work_type), // enum 매핑 함수 필요
    description: w.description,
  }));
  return res;
}

export async function getProfilePracSkills(profileId: number) {
  const skills = await prisma.profile_practical_skills.findMany({
    where: {
      profile_id: BigInt(profileId),
    },
    select: {
      practical_skill: {
        select: {
          id: true,
          category_ko: true,
          category_en: true,
          name_ko: true,
          name_en: true,
        },
      },
    },
  });
  const practicalSkills: Skill[] = skills.map((s) => ({
    id: Number(s.practical_skill.id),
    category_ko: s.practical_skill.category_ko,
    category_en: s.practical_skill.category_en,
    name_ko: s.practical_skill.name_ko,
    name_en: s.practical_skill.name_en,
  }));
  return practicalSkills;
}
