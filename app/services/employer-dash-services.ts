import { formatDateYYYYMMDD, formatYYYYMMDDtoMonthDayYear } from "@/lib/utils";
import { prisma } from "@/app/lib/prisma/prisma-singleton";
import { JobPost } from "@/types/employer";
import { STORAGE_URLS } from "@/constants/storage";
import { Applicant } from "@/types/job";
import { Prisma } from "@prisma/client";
import { fromPrismaAppStatus, fromPrismaWorkPeriod, fromPrismaWorkType, toPrismaJobStatus } from "@/types/enumMapper";
import { getEmployerBizLoc } from "@/app/services/employer-services";
import { JobStatus } from "@/constants/enums";

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
 * Dashboard - applicants
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
        return {
          application_id: Number(applicant.application_id),
          profile_id: Number(applicant.profile_id),
          user_id: Number(applicant.user_id),
          job_post_id: Number(applicant.job_post_id),
          status: fromPrismaAppStatus(applicant.status),
          created_at: applicant.created_at ? formatDateYYYYMMDD(applicant.created_at) : "",
          profile_image_url: applicant.img_url,
          description: applicant.description,
          applied_date: applicant.applied_at ? formatDateYYYYMMDD(applicant.applied_at) : "",
          work_experiences: workExperience.map((w) => ({
            id: Number(w.id),
            profile_id: Number(w.profile_id),
            company_name: w.company_name,
            job_type: w.job_type,
            start_year: Number(w.start_year),
            work_period: fromPrismaWorkPeriod(w.work_period),
            work_type: fromPrismaWorkType(w.work_type),
            description: w.description,
          })),
        };
      })
    );
    console.log(res2);
    return res2;
  } else {
    return [];
  }
}

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