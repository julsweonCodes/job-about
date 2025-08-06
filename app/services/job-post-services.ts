import { prisma } from "@/app/lib/prisma/prisma-singleton";
import { formatDateYYYYMMDD, formatYYYYMMDDtoMonthDayYear } from "@/lib/utils";
import { getUserIdFromSession } from "@/utils/auth";
import { Role, WorkType } from "@prisma/client";
import { JobPostPayload } from "@/types/employer";
import { Skill, WorkStyle } from "@/types/profile";
import {
  toPrismaJobType,
  toPrismaWorkType,
  toPrismaLanguageLevel,
  toPrismaJobStatus,
  toLocation,
  fromPrismaLocation,
} from "@/types/enumMapper";
import { BizLocInfo, JobPostData } from "@/types/jobPost";
import { JobStatus, LanguageLevel } from "@/constants/enums";
import { JobType } from "@/constants/jobTypes";
import { Location } from "@/constants/location";
import { STORAGE_URLS } from "@/constants/storage";
import { HttpError } from "../lib/server/commonResponse";

// Create Job Post
export async function createJobPost(payload: JobPostPayload) {
  const userId = await getUserIdFromSession();
  const bizLocId = await getBusinessLocId(userId);

  const createdPost = await prisma.job_posts.create({
    data: {
      deadline: formatDateYYYYMMDD(payload.deadline),
      description: payload.jobDescription ?? "no description.",
      job_type: toPrismaJobType(payload.selectedJobType),
      status: "DRAFT",
      title: payload.jobTitle,
      wage: payload.wage,
      work_schedule: payload.workSchedule,
      business_loc_id: bizLocId,
      user_id: userId,
      work_type: toPrismaWorkType(payload.selectedWorkType!),
      language_level: toPrismaLanguageLevel(payload.languageLevel!),
    },
    select: {
      id: true,
      description: true,
    },
  });
  const resPracSkills = await deleteAndInsertPracticalSkills(
    Number(createdPost.id),
    payload.requiredSkills
  );
  const recWorkStyles = await deleteAndInsertWorkStyles(
    Number(createdPost.id),
    payload.requiredWorkStyles
  );
  console.log(createdPost, resPracSkills, recWorkStyles);
  return createdPost;
}

export async function updateJobDesc(userId: number, postId: string, jobDesc: string) {
  const bizLocId = await getBusinessLocId(userId);
  console.log(Number(postId), bizLocId, userId);
  console.log(jobDesc);
  const res = await prisma.job_posts.update({
    where: {
      id: Number(postId),
      business_loc_id: bizLocId,
      user_id: userId,
    },
    data: {
      description: JSON.stringify(jobDesc),
      status: "PUBLISHED",
    },
  });
  console.log(res);
  return res.id.toString();
}

// Edit Job Post
export async function getBusinessLocId(userId: number) {
  const bizLocId = await prisma.business_loc.findFirst({
    where: { user_id: userId },
    select: { id: true, name: true },
  });

  if (!bizLocId) {
    throw new Error("BizLocId search fail");
  }
  // console.log(Number(bizLocId.id), bizLocId.name);

  return Number(bizLocId.id);
}

// Get Job Post skills
export async function getJobPostPracSkills(jobPostId: number) {
  const res = await prisma.job_post_practical_skills.findMany({
    where: { job_post_id: jobPostId },
    include: {
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

  const skills: Skill[] = res
    .map((item) => {
      const skill = item.practical_skill;
      if (!skill) return null;

      return {
        id: Number(skill.id),
        category_ko: skill.category_ko,
        category_en: skill.category_en,
        name_ko: skill.name_ko,
        name_en: skill.name_en,
      };
    })
    .filter((s): s is Skill => s !== null);

  return skills;
}
// Get Job Post Work Styles
export async function getJobPostWorkStyles(jobPostId: number) {
  const res = await prisma.job_post_work_styles.findMany({
    where: { job_post_id: jobPostId },
    include: {
      work_style: {
        select: {
          id: true,
          name_ko: true,
          name_en: true,
        },
      },
    },
  });

  const workStyles: WorkStyle[] = res
    .map((item) => {
      const style = item.work_style;
      if (!style) return null;

      return {
        id: Number(style.id),
        name_ko: style.name_ko,
        name_en: style.name_en,
      };
    })
    .filter((s): s is WorkStyle => s !== null);

  return workStyles;
}

// Delete Skills from Practical skills
export async function deleteAndInsertPracticalSkills(jobPostId: number, skills: Skill[]) {
  return prisma.$transaction(async (tx) => {
    await tx.job_post_practical_skills.deleteMany({
      where: { job_post_id: jobPostId },
    });

    if (skills.length > 0) {
      const practicalSkillData = skills.map((skill) => ({
        job_post_id: jobPostId,
        practical_skill_id: skill.id,
      }));

      const result = await tx.job_post_practical_skills.createMany({
        data: practicalSkillData,
      });

      return result.count;
    }

    return 0;
  });
}

export async function deleteAndInsertWorkStyles(jobPostId: number, workStyles: WorkStyle[]) {
  return prisma.$transaction(async (tx) => {
    await tx.job_post_work_styles.deleteMany({
      where: { job_post_id: jobPostId },
    });

    if (workStyles.length > 0) {
      const workStyleData = workStyles.map((ws) => ({
        job_post_id: jobPostId,
        work_style_id: ws.id,
      }));

      const result = await tx.job_post_work_styles.createMany({
        data: workStyleData,
      });

      return result.count;
    }

    return 0;
  });
}

// Get Job Post Preview/view
export async function getJobPostView(jobPostId: string, jobPostStatus: JobStatus, userId?: number) {
  console.log("getJobPostView called with:", { jobPostId, jobPostStatus, userId });

  // 입력값 검증
  if (!jobPostId || isNaN(Number(jobPostId))) {
    console.error("Invalid jobPostId:", jobPostId);
    return null;
  }

  const bizLocId = await prisma.job_posts.findFirst({
    where: {
      id: Number(jobPostId),
      status: toPrismaJobStatus(jobPostStatus),
    },
    select: {
      business_loc_id: true,
    },
  });

  console.log("First query result:", bizLocId);

  if (!bizLocId) {
    console.error(
      "Business Location Id not found for jobPostId:",
      jobPostId,
      "status:",
      jobPostStatus
    );
    return null;
  }

  const bizLocRes = await prisma.business_loc.findFirst({
    where: {
      id: Number(bizLocId.business_loc_id),
    },
  });

  if (!bizLocRes) {
    console.error("Business Location Info not found ");
    return null;
  }

  const jobPostRes = await prisma.job_posts.findFirst({
    where: {
      id: Number(jobPostId),
      status: toPrismaJobStatus(jobPostStatus),
    },
    include: {
      bookmarked_jobs: {
        where: userId ? { user_id: userId } : { id: -1 },
        select: { id: true },
      },
    },
  });

  //북마크 여부 확인을 위한 역할 체크
  let user;
  if (userId) {
    user = await prisma.users.findUnique({
      where: {
        id: userId,
        deleted_at: null,
      },
      select: {
        role: true,
      },
    });
  }

  if (!jobPostRes) {
    console.log("Job Post not found");
    return null;
  }

  const img_base_url = `${STORAGE_URLS.BIZ_LOC.PHOTO}`;
  const extraImgs = [
    bizLocRes.img_url1 ? img_base_url.concat(bizLocRes.img_url1) : "",
    bizLocRes.img_url2 ? img_base_url.concat(bizLocRes.img_url2) : "",
    bizLocRes.img_url3 ? img_base_url.concat(bizLocRes.img_url3) : "",
    bizLocRes.img_url4 ? img_base_url.concat(bizLocRes.img_url4) : "",
    bizLocRes.img_url5 ? img_base_url.concat(bizLocRes.img_url5) : "",
  ];

  const locationValue: Location = toLocation(fromPrismaLocation(bizLocRes.location))!;

  const bizLocInfo: BizLocInfo = {
    bizDescription: bizLocRes.description,
    bizLocId: bizLocRes.id.toString(),
    address: bizLocRes.address,
    location: locationValue,
    name: bizLocRes.name,
    logoImg: img_base_url.concat(bizLocRes.logo_url ?? ""),
    extraPhotos: extraImgs,
    workingHours: bizLocRes.operating_start.concat(" - ", bizLocRes.operating_end),
  };
  const requiredSkills = await getJobPostPracSkills(Number(jobPostId));
  const requiredWorkStyles = await getJobPostWorkStyles(Number(jobPostId));

  const isBookmarked = user?.role === Role.APPLICANT && jobPostRes.bookmarked_jobs.length > 0;

  // 안전한 JSON 파싱을 위한 헬퍼 함수
  const safeJsonParse = (str: string) => {
    try {
      return JSON.parse(str);
    } catch (error) {
      console.warn("Failed to parse description as JSON, using as string:", str);
      return str; // 문자열 그대로 반환
    }
  };

  const jobPostData: JobPostData = {
    businessLocInfo: bizLocInfo,
    deadline: formatYYYYMMDDtoMonthDayYear(jobPostRes.deadline),
    jobDescription: safeJsonParse(jobPostRes.description),
    hourlyWage: jobPostRes.wage,
    id: jobPostRes.id.toString(),
    jobType: JobType[jobPostRes.job_type],
    languageLevel: jobPostRes.language_level ? LanguageLevel[jobPostRes.language_level] : undefined,
    requiredWorkStyles: requiredWorkStyles,
    requiredSkills: requiredSkills,
    workSchedule: jobPostRes.work_schedule,
    status: JobStatus[jobPostRes.status],
    title: jobPostRes.title,
    isBookmarked,
  };
  console.log(jobPostData);
  return jobPostData;
}

type GetJobPostsParams = {
  workType?: WorkType;
  location?: Location;
  page: number;
  limit: number;
};

// Get Job Post
export async function getJobPosts(params: GetJobPostsParams) {
  const { workType, location, page, limit } = params;

  const skip = (page - 1) * limit;

  const jobPosts = await prisma.job_posts.findMany({
    where: {
      deleted_at: null,
      status: toPrismaJobStatus(JobStatus.PUBLISHED),
      ...(workType && { work_type: workType }),
      ...(location && { location: location }),
    },
    orderBy: {
      created_at: "desc",
    },
    skip,
    take: limit,
    include: {
      business_loc: {
        select: {
          logo_url: true,
        },
      },
      job_practical_skills: {
        include: {
          practical_skill: {
            select: {
              id: true,
              name_ko: true,
              name_en: true,
              category_ko: true,
              category_en: true,
            },
          },
        },
      },
      _count: {
        select: { applications: true },
      },
    },
  });

  const jobPostsWithExtras = jobPosts.map(({ _count, job_practical_skills, ...rest }) => {
    const createdAt = new Date(rest.created_at);
    const now = new Date();
    const diffInDays = Math.floor((+now - +createdAt) / (1000 * 60 * 60 * 24));

    return {
      ...rest,
      daysAgo: diffInDays,
      applicantCount: _count.applications,
      requiredSkills: job_practical_skills.map((jps) => ({
        id: Number(jps.practical_skill.id),
        name_ko: jps.practical_skill.name_ko,
        name_en: jps.practical_skill.name_en,
        category_ko: jps.practical_skill.category_ko,
        category_en: jps.practical_skill.category_en,
      })),
    };
  });

  return jobPostsWithExtras;
}

export async function getJobPostById(jobPostId: number) {
  const jobPost = await prisma.job_posts.findUnique({
    where: {
      id: jobPostId,
      deleted_at: null,
    },
    include: {
      business_loc: true,
    },
  });

  return jobPost;
}

export async function getbookmarkedJobPosts(userId: number, page: number, limit: number) {
  const user = await prisma.users.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new HttpError("User not found", 404);
  }

  const skip = (page - 1) * limit;

  const jobPosts = await prisma.bookmarked_jobs.findMany({
    where: {
      user_id: userId,
    },
    skip,
    take: limit,
    include: {
      job_post: {
        include: {
          business_loc: true,
          _count: {
            select: { applications: true },
          },
        },
      },
    },
  });

  return jobPosts;
}

export async function getAppliedJobPosts(
  userId: number,
  profileId: number,
  page: number,
  limit: number
) {
  const user = await prisma.users.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new HttpError("User not found", 404);
  }

  const skip = (page - 1) * limit;

  const applications = await prisma.applications.findMany({
    where: {
      profile_id: profileId,
    },
    skip,
    take: limit,
    include: {
      job_post: {
        include: {
          business_loc: true,
          _count: {
            select: { applications: true },
          },
          job_practical_skills: {
            include: {
              practical_skill: true,
            },
          },
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  // 지원 상태 정보를 포함하여 반환
  return applications.map((application) => {
    const jobPost = application.job_post;
    const now = new Date();
    const createdAt = new Date(jobPost.created_at);
    const diffInDays = Math.floor((+now - +createdAt) / (1000 * 60 * 60 * 24));

    return {
      id: jobPost.id.toString(),
      business_loc_id: jobPost.business_loc_id.toString(),
      user_id: jobPost.user_id.toString(),
      title: jobPost.title,
      job_type: jobPost.job_type,
      deadline: jobPost.deadline,
      work_schedule: jobPost.work_schedule,
      wage: jobPost.wage,
      location: jobPost.business_loc.location,
      description: jobPost.description,
      status: jobPost.status,
      work_type: jobPost.work_type,
      language_level: jobPost.language_level,
      created_at: jobPost.created_at,
      updated_at: jobPost.updated_at,
      daysAgo: diffInDays,
      applicantCount: jobPost._count.applications,
      business_loc: jobPost.business_loc,
      applicationStatus: application.status, // 지원 상태 추가
      requiredSkills: jobPost.job_practical_skills.map((jps: any) => ({
        id: Number(jps.practical_skill.id),
        name_ko: jps.practical_skill.name_ko,
        name_en: jps.practical_skill.name_en,
        category_ko: jps.practical_skill.category_ko,
        category_en: jps.practical_skill.category_en,
      })),
    };
  });
}
