// 📁 services/employer-service.ts
import { supabaseClient } from '@/utils/supabase/client'
import { EmployerProfilePayload, JobPost } from "@/types/employer";
import { prisma } from "@/app/lib/prisma/prisma-singleton";
import { formatDateYYYYMMDD, formatYYYYMMDDtoMMDDYYYY, formatYYYYMMDDtoMonthDayYear } from "@/lib/utils";

/** 1. Onboarding
 * Upload, Delete Images from supabase
 * Create, Update business location info
 */
// uploading images to supabase storage
export async function uploadEmployerImages(photos: File[], userId: number): Promise<string[]> {
  const urls: string[] = [];

  for (const photo of photos) {
    const fileExt = photo.name.split('.').pop()
    const filePath = `${userId}-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { error: uploadError } = await supabaseClient
      .storage
      .from('job-about')
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
  const parts = url.split('/job-about/');
  const path = parts[1] ? `job-about/${parts[1]}` : '' ;
  if (!path) return;

  const { error } = await supabaseClient.storage
    .from('job-about')
    .remove([path])
  ;

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
    where: { id: bizLocId}
  });
  return res;
}
// POST - Create business loc
export async function saveEmployerProfile(payload: EmployerProfilePayload) {
  const safePayload = {
    ...payload,
    description: payload.description ?? "",
    user_id : Number(payload.user_id),
  };
  console.log(safePayload);
  const { data, error } = await supabaseClient
    .from('business_loc')
    .insert([safePayload])
  ;

  if (error) {
    console.log("error inserting");
    throw error;
  }
  return data;
}

// PUT - Update business loc
export async function updateEmployerProfile(id: number, payload: EmployerProfilePayload) {
  const { data, error } = await supabaseClient
    .from('business_loc')
    .update(payload)
    .eq('id', id);

  if (error) throw error;
  return data;
}

/** 2. Dashboard */
// GET - Select cnt values for employer dashboard
export async function getActiveJobPostsCnt(userId: number, bizLocId: number): Promise<number> {
  const currDate = new Date();
  const currDateStr = formatDateYYYYMMDD(currDate)
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
  tomorrow.setDate(currDate.getDate()+1);
  const tomorrowDate = formatDateYYYYMMDD(tomorrow);
  const urgentJobPosts = await prisma.job_posts.findMany({
    where: {
      created_at: {
        lte:  currDate,
      },

      deadline: tomorrowDate,
      business_loc_id: bizLocId,
      user_id: userId,
      status: "PUBLISHED",
    },
    select: {
      id: true,
    },
  });

  const validJobPostIds = urgentJobPosts.map((post => post.id));

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
        lte:  currDate,
      },
      deadline: currDateStr,
      user_id: userId,
      status: "PUBLISHED",
    },
    select: {
      id: true,
    },
  });

  const validJobPostIds = allJobPosts.map((post => post.id));

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
  if (!bizLocInfo) return [];
  const currDate = new Date();
  const tomorrow = new Date(currDate);
  tomorrow.setDate(currDate.getDate()+1);
  const tomorrowDate = formatDateYYYYMMDD(tomorrow);
  const activeJobPosts = await prisma.job_posts.findMany({
    where: {
      business_loc_id: bizLocInfo.id,
      user_id: userId,
      status: "PUBLISHED",
    },
    include: {
      _count: {
        select: {
          applications: true,
        },
      },
    },
  });
  console.log("everybody looooook at this!!!", bizLocInfo);
  const img_base_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/job-about/biz-loc-photo/`;
  const activeJobPostList: JobPost[] = activeJobPosts.map((post) => ({
    id: post.id.toString(),
    title: post.title,
    applicants: post._count.applications,
    businessName: bizLocInfo.name,
    coverImage: img_base_url.concat(bizLocInfo.logo_url ?? ""),
    deadline_date: formatYYYYMMDDtoMonthDayYear(post.deadline),
    description: post.description,
    location: bizLocInfo.address,
    needsUpdate: post.deadline === tomorrowDate,
    strt_date: formatYYYYMMDDtoMonthDayYear(formatDateYYYYMMDD(post.created_at)),
    type: post.work_type,
    views: 0,
    wage: post.wage

  }));
  console.log("activeJobPostList: ", activeJobPostList);
  return activeJobPostList;

}