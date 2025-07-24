import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma/prisma-singleton";
import { successResponse, errorResponse } from "@/app/lib/server/commonResponse";
import { getUserIdFromSession } from "@/utils/auth";
import { getJobPostPracSkills } from "@/app/services/job-post-services";
import { parseBigInt } from "@/lib/utils";

/**
 * GET: 특정 채용공고의 선택된 실무능력 목록 조회
 * @description 채용공고에 설정된 실무능력들을 가져옴
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobPostId = parseInt(params.id);
    
    if (isNaN(jobPostId)) {
      console.error(`잘못된 job post ID: ${params.id}`);
      return errorResponse("Invalid job post ID.", 400);
    }

    console.log(`채용공고 실무능력 조회: jobPostId=${jobPostId}`);

    const jobPracticalSkills = await getJobPostPracSkills(jobPostId);

    const practicalSkills = jobPracticalSkills.map(jps => ({
      id: Number(jps.practical_skill.id),
      category_ko: jps.practical_skill.category_ko,
      category_en: jps.practical_skill.category_en,
      name_ko: jps.practical_skill.name_ko,
      name_en: jps.practical_skill.name_en
    }));

    console.log(`채용공고 실무능력 ${practicalSkills.length}개 조회 성공`);
    
    return successResponse(practicalSkills, 200, "Job post practical skills fetched successfully.");
  } catch (error) {
    console.error(`API Error GET /api/job-posts/${params.id}/practical-skills:`, error);
    return errorResponse("An internal server error occurred.", 500);
  }
}

/**
 * POST: 채용공고에 실무능력 설정
 * @description 사장님이 채용공고에 원하는 실무능력들을 선택
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobPostId = parseInt(params.id);
    
    if (isNaN(jobPostId)) {
      console.error(`잘못된 job post ID: ${params.id}`);
      return errorResponse("Invalid job post ID.", 400);
    }

    // 인증된 사용자 ID 가져오기
    let userId: number;
    try {
      userId = await getUserIdFromSession();
    } catch (error) {
      console.error("사용자 인증 실패:", error);
      return errorResponse("Unauthorized.", 401);
    }

    const body = await req.json();
    const { practicalSkillIds } = body;

    // 요청 데이터 검증
    if (!Array.isArray(practicalSkillIds)) {
      console.error("practical skill IDs 형식 오류:", practicalSkillIds);
      return errorResponse("Invalid practical skill IDs format.", 400);
    }

    console.log(`채용공고 실무능력 설정: jobPostId=${jobPostId}, userId=${userId}, practicalSkills=${practicalSkillIds}`);

    // 채용공고 소유자 검증
    const jobPost = await prisma.job_posts.findFirst({
      where: {
        id: jobPostId,
        user_id: userId
      }
    });

    if (!jobPost) {
      console.error(`채용공고를 찾을 수 없거나 권한 없음: jobPostId=${jobPostId}, userId=${userId}`);
      return errorResponse("Job post not found or access denied.", 404);
    }

    // 트랜잭션으로 기존 실무능력 삭제 후 새로 추가
    await prisma.$transaction(async (tx) => {
      // 기존 실무능력 관계 삭제
      await tx.job_post_practical_skills.deleteMany({
        where: { job_post_id: jobPostId }
      });

      // 새로운 실무능력 관계 추가
      if (practicalSkillIds.length > 0) {
        const practicalSkillData = practicalSkillIds.map((skillId: number) => ({
          job_post_id: jobPostId,
          practical_skill_id: skillId
        }));

        await tx.job_post_practical_skills.createMany({
          data: practicalSkillData
        });
      }
    });

    console.log(`채용공고 실무능력 설정 완료: ${practicalSkillIds.length}개 항목`);
    
    return successResponse(parseBigInt({
      jobPostId,
      practicalSkillIds,
      message: "Practical skills updated successfully"
    }), 200, "Job post practical skills updated successfully.");
  } catch (error) {
    console.error(`API Error POST /api/job-posts/${params.id}/practical-skills:`, error);
    return errorResponse("An internal server error occurred.", 500);
  }
}

/**
 * DELETE: 채용공고의 모든 실무능력 삭제
 * @description 채용공고에서 설정된 실무능력을 모두 제거
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobPostId = parseInt(params.id);
    
    if (isNaN(jobPostId)) {
      console.error(`잘못된 job post ID: ${params.id}`);
      return errorResponse("Invalid job post ID.", 400);
    }

    // 인증된 사용자 ID 가져오기
    let userId: number;
    try {
      userId = await getUserIdFromSession();
    } catch (error) {
      console.error("사용자 인증 실패:", error);
      return errorResponse("Unauthorized.", 401);
    }

    console.log(`채용공고 실무능력 삭제: jobPostId=${jobPostId}, userId=${userId}`);

    // 채용공고 소유자 검증
    const jobPost = await prisma.job_posts.findFirst({
      where: {
        id: jobPostId,
        user_id: userId
      }
    });

    if (!jobPost) {
      console.error(`채용공고를 찾을 수 없거나 권한 없음: jobPostId=${jobPostId}, userId=${userId}`);
      return errorResponse("Job post not found or access denied.", 404);
    }

    // 실무능력 관계 삭제
    const deleteResult = await prisma.job_post_practical_skills.deleteMany({
      where: { job_post_id: jobPostId }
    });

    console.log(`채용공고 실무능력 삭제 완료: ${deleteResult.count}개 항목 삭제`);
    
    return successResponse({
      jobPostId,
      deletedCount: deleteResult.count,
      message: "All practical skills removed successfully"
    }, 200, "Job post practical skills deleted successfully.");
  } catch (error) {
    console.error(`API Error DELETE /api/job-posts/${params.id}/practical-skills:`, error);
    return errorResponse("An internal server error occurred.", 500);
  }
}