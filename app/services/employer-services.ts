// 📁 services/employer-service.ts
import { supabaseClient } from '@/utils/supabase/client'
import { EmployerProfilePayload } from '@/types/employer'
import { prisma } from "@/app/lib/prisma/prisma-singleton";
import {formatDateYYYYMMDD} from "@/lib/utils";

// uploading images to supabase storage
export async function uploadEmployerImages(photos: File[], userId: number): Promise<string[]> {
  for (const photo in photos) {
  }
  const urls: string[] = [];

  for (const photo of photos) {
    const fileExt = photo.name.split('.').pop()
    const filePath = `${Date.now()}-${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { error: uploadError } = await supabaseClient
      .storage
      .from('job-about')
      .upload("biz-loc-photo/".concat(filePath), photo);

    if (uploadError) throw uploadError;

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

// POST - Create business loc
export async function saveEmployerProfile(payload: EmployerProfilePayload) {
  const safePayload = {
    ...payload,
    description: payload.description ?? "",
    user_id : Number(payload.user_id?? 1),
  };
  console.log(safePayload);
  const { data, error } = await supabaseClient
    .from('business_loc')
    .insert([safePayload])
  ;

  if (error) throw error;
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

// GET - Select cnt values for employer dashboard
export async function getActiveJobPosts(userId: number): Promise<number> {
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

export async function getStatusUpdateCnt(userId: number): Promise<number> {
  const currDate = new Date();
  const tomorrow = new Date(currDate);
  tomorrow.setDate(currDate.getDate()+1);
  const tomorrowDate = formatDateYYYYMMDD(tomorrow);
  console.log(currDate, tomorrow);

  const urgentJobPosts = await prisma.job_posts.findMany({
    where: {
      created_at: {
        lte:  currDate,
      },
      deadline: tomorrowDate,
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

export async function getAllApplicationsCnt(userId: number): Promise<number> {
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