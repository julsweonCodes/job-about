// 📁 services/employer-service.ts
import { supabaseClient } from "@/utils/supabase/client";
import { EmployerProfilePayload, JobPost } from "@/types/employer";
import { prisma } from "@/app/lib/prisma/prisma-singleton";
import { formatDateYYYYMMDD, formatYYYYMMDDtoMonthDayYear } from "@/lib/utils";
import { STORAGE_URLS } from "@/constants/storage";
import {
  fromPrismaAppStatus,
  fromPrismaWorkPeriod, fromPrismaWorkType,
  toPrismaJobStatus,
  toPrismaLocationStrict,
} from "@/types/enumMapper";
import { Applicant } from "@/types/job";
import { Prisma } from "@prisma/client";
import { toISOString } from "@/utils/shared/dateUtils";

/** 1. Onboarding
 * Upload, Delete Images from supabase
 * Create, Update business location info
 */
// uploading images to supabase storage
export async function uploadEmployerImages(photos: File[], userId: number): Promise<string[]> {
  const urls: string[] = [];

  for (const photo of photos) {
    const fileExt = photo.name.split(".").pop();
    const filePath = `${userId}-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { error: uploadError } = await supabaseClient.storage
      .from("job-about")
      .upload("biz-loc-photo/".concat(filePath), photo);

    if (uploadError) {
      console.error("uploadError");
      throw uploadError;
    }

    urls.push(filePath);
  }

  return urls;
}

// deleting images from supabase storage
export async function deleteSingleEmployerImage(url: string) {
  const parts = url.split("/job-about/");
  const path = parts[1] ? `job-about/${parts[1]}` : "";
  if (!path) return;

  const { error } = await supabaseClient.storage.from("job-about").remove([path]);
  if (error) throw error;
}

// GET business location
export async function getEmployerBizLoc(userId: number) {
  const res = await prisma.business_loc.findFirst({
    where: { user_id: userId },
  });
  return res;
}

// GET current job post
export async function getCurrJobPost(bizLocId: number, userId: number) {
  const res = await prisma.job_posts.findFirst({
    where: { id: bizLocId },
  });
  return res;
}
// POST - Create business loc
export async function saveEmployerProfile(payload: EmployerProfilePayload) {
  const safePayload = {
    ...payload,
    description: payload.description ?? "",
    user_id: Number(payload.user_id),
    location: toPrismaLocationStrict(payload.location),
  };
  console.log(safePayload);
  const { data, error } = await supabaseClient.from("business_loc").insert([safePayload]);
  if (error) {
    console.log("error inserting");
    throw error;
  }
  return data;
}

// PUT - Update business loc
/*
export async function updateEmployerProfile(id: number, payload: EmployerProfilePayload) {
  const { data, error } = await supabaseClient.from("business_loc").update(payload).eq("id", id);

  if (error) throw error;
  return data;
}
 */

/**
 * 2. Dashboard
 * */

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
        gte: currDateStr
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
      deadline: "asc"
    }
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
          }
        });
        return {
          application_id: Number(applicant.application_id),
          profile_id: Number(applicant.profile_id),
          user_id: Number(applicant.user_id),
          job_post_id: Number(applicant.job_post_id),
          status: fromPrismaAppStatus(applicant.status),
          created_at: applicant.created_at ? formatDateYYYYMMDD(applicant.created_at): "",
          profile_image_url: applicant.img_url,
          description: applicant.description,
          applied_date: applicant.applied_at ? formatDateYYYYMMDD(applicant.applied_at): "",
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