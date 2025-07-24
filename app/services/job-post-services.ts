import { supabaseClient } from '@/utils/supabase/client';
import { prisma } from "@/app/lib/prisma/prisma-singleton";
import { Database } from "@/types/database.types";
import { capitalize, formatDateYYYYMMDD } from "@/lib/utils";
import {getUserIdFromSession} from "@/utils/auth";
import { Prisma } from "@prisma/client";
import { JobPostPayload } from "@/types/employer";
import { Skill, WorkStyle } from "@/types/profile";
import { toPrismaJobType, toPrismaWorkType, toPrismaLanguageLevel} from "@/types/enumMapper";

// Create Job Post
 export async function createJobPost(payload: JobPostPayload) {
  const userId = await getUserIdFromSession();
  const bizLocId = await getBusinessLocId(userId);
  console.log(userId, bizLocId);
   console.log(payload);
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
      work_type: toPrismaWorkType(payload.selectedWorkType),
      language_level: toPrismaLanguageLevel(payload.language_level),
    },
    select: {
      id: true,
      description: true,
    },
  });
  const resPracSkills = await deleteAndInsertPracticalSkills(Number(createdPost.id), payload.requiredSkills);
  const recWorkStyles = await deleteAndInsertWorkStyles(Number(createdPost.id), payload.requiredWorkStyles);
  console.log(createdPost, resPracSkills, recWorkStyles);
  return createdPost;
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

// Delete Skills from Practical skills
export async function deleteAndInsertPracticalSkills(jobPostId: number, skills: Skill[]) {
   return prisma.$transaction( async (tx) => {
    await tx.job_post_practical_skills.deleteMany({
      where: { job_post_id: jobPostId }
    });

    if (skills.length > 0) {
      const practicalSkillData = skills.map( (skill) => ({
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
  return prisma.$transaction( async (tx) => {
    await tx.job_post_work_styles.deleteMany({
      where: { job_post_id: jobPostId }
    });

    if (workStyles.length > 0) {
      const workStyleData = workStyles.map( (ws) => ({
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