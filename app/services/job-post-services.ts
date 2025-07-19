import { supabaseClient } from '@/utils/supabase/client';
import { prisma } from "@/app/lib/prisma/prisma-singleton";
import { Database } from "@/types/database.types";
import {formatDateYYYYMMDD} from "@/lib/utils";
import {getUserIdFromSession} from "@/utils/auth";
import { Prisma } from "@prisma/client";
import { JobPostPayload } from "@/types/employer";

// Create Job Post
 export async function createJobPost(payload: JobPostPayload) {
  const userId = await getUserIdFromSession();
  const bizLocId = await getBusinessLocId(userId);
  console.log(userId, bizLocId);

  const createdPost = await prisma.job_posts.create({
    data: {
      deadline: payload.deadline,
      description: payload.jobDescription ?? "no description.",
      job_type: "CHEF",
      status: "DRAFT",
      title: payload.jobTitle,
      wage: payload.wage,
      work_schedule: payload.workSchedule,
      business_loc_id: bizLocId,
      skill_id1: 1,
      user_id: userId,
    },
    select: {
      id: true
    },
  });
  console.log(createdPost);
  return createdPost.id.toString();
 }

// Edit Job Post
export async function getBusinessLocId(userId: number) {
   const bizLocId = await prisma.business_loc.findFirst({
    where: { user_id: userId},
    select: { id: true, name: true},
   });

   if (!bizLocId) {
    throw new Error("BizLocId search fail");
   }
  // console.log(Number(bizLocId.id), bizLocId.name);

   return Number(bizLocId.id);
}
// Gemini API


// Get
