import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma/prisma-singleton";
import { successResponse, errorResponse } from "@/app/lib/server/commonResponse";
import { getUserIdFromSession } from "@/utils/auth";
import { calculateBulkMatchScores, getCompatibilityLevel } from "@/app/lib/work-style-matcher";

/**
 * GET: 채용공고에 매칭되는 구직자들을 추천하는 API
 * @description work style 기반으로 채용공고와 잘 맞는 구직자들을 매칭 점수와 함께 제공
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobPostId = parseInt(params.id);
    
    if (isNaN(jobPostId)) {
      console.error(`잘못된 job post ID: ${params.id}`);
      return errorResponse("Invalid job post ID.", 400);
    }

    // 인증된 사용자 ID 가져오기 (채용공고 소유자 검증용)
    let userId: number;
    try {
      userId = await getUserIdFromSession();
    } catch (error) {
      console.error("사용자 인증 실패:", error);
      return errorResponse("Unauthorized.", 401);
    }

    console.log(`구직자 매칭 추천: jobPostId=${jobPostId}, userId=${userId}`);

    // 채용공고 소유자 검증
    const jobPost = await prisma.job_posts.findFirst({
      where: {
        id: jobPostId,
        user_id: userId
      },
      include: {
        job_work_styles: {
          include: {
            work_style: true
          }
        }
      }
    });

    if (!jobPost) {
      console.error(`채용공고를 찾을 수 없거나 권한 없음: jobPostId=${jobPostId}, userId=${userId}`);
      return errorResponse("Job post not found or access denied.", 404);
    }

    // URL 쿼리 파라미터 처리
    const url = new URL(req.url);
    const limitParam = url.searchParams.get('limit');
    const minScoreParam = url.searchParams.get('minScore');
    
    const limit = limitParam ? parseInt(limitParam) : 20; // 기본 20명
    const minScore = minScoreParam ? parseFloat(minScoreParam) : -2; // 기본 최소 점수

    // 구직자 목록 조회 (성향이 설정된 구직자만)
    const seekers = await prisma.users.findMany({
      where: {
        role: 'APPLICANT',
        personality_profile_id: { not: null }
      },
      select: {
        id: true,
        name: true,
        email: true,
        personality_profile_id: true,
        personality_profile: {
          select: {
            id: true,
            name_ko: true,
            name_en: true
          }
        }
      },
      take: limit * 2 // 필터링을 고려해 더 많이 가져옴
    });

    console.log(`전체 구직자 ${seekers.length}명 조회`);

    if (seekers.length === 0) {
      return successResponse({
        jobPost: {
          id: jobPost.id,
          title: jobPost.title,
          selectedWorkStyles: jobPost.job_work_styles.map(jws => jws.work_style.name_ko)
        },
        candidates: [],
        totalCount: 0
      }, 200, "No candidates found.");
    }

    // 매칭 점수 계산
    const seekerIds = seekers.map(s => Number(s.id));
    const matchResults = await calculateBulkMatchScores(jobPostId, seekerIds);

    // 매칭 결과와 구직자 정보 결합
    const candidatesWithScores = seekers.map(seeker => {
      const matchResult = matchResults.find(mr => mr.seekerId === Number(seeker.id));
      const matchScore = matchResult?.matchScore || 0;
      const compatibility = getCompatibilityLevel(matchScore);
      
      return {
        id: Number(seeker.id),
        name: seeker.name,
        email: seeker.email,
        personality: seeker.personality_profile ? {
          id: Number(seeker.personality_profile.id),
          name_ko: seeker.personality_profile.name_ko,
          name_en: seeker.personality_profile.name_en
        } : null,
        matchScore,
        compatibility: {
          level: compatibility.level,
          percentage: compatibility.percentage,
          description: compatibility.description,
          color: compatibility.color
        }
      };
    });

    // 점수 필터링 및 정렬
    const filteredCandidates = candidatesWithScores
      .filter(candidate => candidate.matchScore >= minScore)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);

    console.log(`매칭 완료: ${filteredCandidates.length}명 추천 (최고 점수: ${filteredCandidates[0]?.matchScore || 0})`);

    return successResponse({
      jobPost: {
        id: jobPost.id,
        title: jobPost.title,
        selectedWorkStyles: jobPost.job_work_styles.map(jws => jws.work_style.name_ko)
      },
      candidates: filteredCandidates,
      totalCount: filteredCandidates.length,
      searchParams: {
        limit,
        minScore,
        appliedFilters: jobPost.job_work_styles.length
      }
    }, 200, "Candidates matched successfully.");
  } catch (error) {
    console.error(`API Error GET /api/job-posts/${params.id}/match-candidates:`, error);
    return errorResponse("An internal server error occurred.", 500);
  }
}