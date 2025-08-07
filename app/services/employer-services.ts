// 📁 services/employer-service.ts
import { supabaseClient } from "@/utils/supabase/client";
import { EmployerProfilePayload, JobPost, JobPostPayload } from "@/types/employer";
import { prisma } from "@/app/lib/prisma/prisma-singleton";
import { formatDateYYYYMMDD, formatYYYYMMDDtoMonthDayYear, parseBigInt } from "@/lib/utils";
import { STORAGE_URLS } from "@/constants/storage";
import {
  fromPrismaAppStatus,
  fromPrismaWorkPeriod,
  fromPrismaWorkType,
  toPrismaJobStatus,
  toPrismaJobType,
  toPrismaLanguageLevel,
  toPrismaLocationStrict,
  toPrismaWorkType,
} from "@/types/enumMapper";
import { Applicant } from "@/types/job";
import { Prisma } from "@prisma/client";
import { toISOString } from "@/utils/shared/dateUtils";
import {
  deleteAndInsertPracticalSkills,
  deleteAndInsertWorkStyles,
  getBusinessLocId,
} from "@/app/services/job-post-services";

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

export async function updateJobPost(postId: string, payload: JobPostPayload, userId: number) {
  const bizLocId = await getBusinessLocId(userId);
  const res = await prisma.job_posts.update({
    where: {
      id: Number(postId),
      business_loc_id: bizLocId,
      user_id: userId,
    },
    data: {
      deadline: payload.deadline,
      description: payload.jobDescription,
      job_type: toPrismaJobType(payload.selectedJobType),
      language_level: payload.languageLevel
        ? toPrismaLanguageLevel(payload.languageLevel)
        : "NOT_REQUIRED",
      status: "PUBLISHED",
      title: payload.jobTitle,
      updated_at: new Date(),
      wage: payload.wage,
      work_schedule: payload.workSchedule,
      work_type: payload.selectedWorkType ? toPrismaWorkType(payload.selectedWorkType) : "ON_SITE",
      business_loc_id: bizLocId,
      user_id: userId,
    },
    select: {
      id: true,
      business_loc_id: true,
      status: true,
    },
  });

  const resPracSkills = await deleteAndInsertPracticalSkills(
    Number(postId),
    payload.requiredSkills
  );
  const recWorkStyles = await deleteAndInsertWorkStyles(
    Number(postId),
    payload.requiredWorkStyles
  );

  let skillCntFlag: boolean = resPracSkills === payload.requiredSkills.length;
  let workstyleCntFlag: boolean = recWorkStyles === payload.requiredWorkStyles.length;

  return parseBigInt({...res, skillCntFlag, workstyleCntFlag});
}
