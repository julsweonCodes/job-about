import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma/prisma-singleton";
import { successResponse, errorResponse } from "@/app/lib/server/commonResponse";
import { getUserIdFromSession } from "@/utils/auth";
import {
  calculateJobRecommendationScores,
  getCompatibilityLevel,
} from "@/app/lib/work-style-matcher";
import { parseBigInt } from "@/lib/utils";

/**
 * GET: 구직자에게 추천 채용공고를 제공하는 API
 * @description 구직자의 성향과 work style 기반으로 잘 맞는 채용공고들을 추천
 */
export async function GET(req: NextRequest) {
  try {
    console.log("구직자 채용공고 추천 API 호출");

    // 인증된 사용자 ID 가져오기
    let userId: number;
    try {
      userId = await getUserIdFromSession();
    } catch (error) {
      console.error("사용자 인증 실패:", error);
      return errorResponse("Unauthorized.", 401);
    }

    // 사용자 정보 및 성향 조회
    const user = await prisma.users.findFirst({
      where: { id: userId },
      include: {
        personality_profile: {
          select: {
            id: true,
            name_ko: true,
            name_en: true,
          },
        },
      },
    });

    if (!user) {
      console.error(`사용자를 찾을 수 없음: userId=${userId}`);
      return errorResponse("User not found.", 404);
    }

    if (!user.personality_profile_id) {
      console.log(`사용자의 성향이 설정되지 않음: userId=${userId}`);
      return successResponse(
        {
          user: {
            id: userId,
            name: user.name,
            personalityProfile: null,
          },
          recommendations: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalCount: 0,
            itemsPerPage: limit,
            hasNextPage: false,
            hasPrevPage: false,
            nextPage: null,
            prevPage: null,
          },
          searchParams: {
            limit,
            page,
            minScore,
            location: locationParam,
            jobType: jobTypeParam,
            workType: workTypeParam,
          },
          message: "성향 테스트를 먼저 완료해주세요.",
        },
        200,
        "No personality profile found. Please complete the quiz first."
      );
    }

    const personalityId = Number(user.personality_profile_id);
    console.log(`구직자 추천: userId=${userId}, personalityId=${personalityId}`);

    // URL 쿼리 파라미터 처리
    const url = new URL(req.url);
    const limitParam = url.searchParams.get("limit");
    const pageParam = url.searchParams.get("page");
    const minScoreParam = url.searchParams.get("minScore");
    const locationParam = url.searchParams.get("location");
    const jobTypeParam = url.searchParams.get("jobType");
    const workTypeParam = url.searchParams.get("workType");

    const limit = limitParam ? parseInt(limitParam) : 10; // 기본 10개
    const page = pageParam ? parseInt(pageParam) : 1; // 기본 1페이지
    const minScore = minScoreParam ? parseFloat(minScoreParam) : 0; // 기본 최소 점수 0
    const offset = (page - 1) * limit;

    // 채용공고 조회 (work style이 설정된 공고만)
    const whereConditions: any = {
      status: "PUBLISHED",
      job_work_styles: {
        some: {}, // work style이 하나 이상 설정된 공고만
      },
    };

    // 필터 조건 추가
    if (locationParam) {
      whereConditions.business_loc = {
        // location 필드가 있다면 추가
      };
    }

    if (jobTypeParam) {
      whereConditions.job_type = jobTypeParam;
    }

    if (workTypeParam) {
      console.log(`workType 필터 적용: ${workTypeParam}`);
      whereConditions.work_type = workTypeParam;
    }

    // 전체 개수 조회 (페이지네이션용)
    const totalCount = await prisma.job_posts.count({
      where: whereConditions,
    });

    const jobPosts = await prisma.job_posts.findMany({
      where: whereConditions,
      include: {
        business_loc: {
          select: {
            name: true,
            address: true,
            logo_url: true,
          },
        },
        job_work_styles: {
          include: {
            work_style: {
              select: {
                id: true,
                name_ko: true,
                name_en: true,
              },
            },
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
        user: {
          select: {
            name: true,
          },
        },
        _count: {
          select: { applications: true },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    console.log(`전체 채용공고 ${jobPosts.length}개 조회`);

    if (jobPosts.length === 0) {
      return successResponse(
        {
          user: {
            id: userId,
            name: user.name,
            personalityProfile: user.personality_profile,
          },
          recommendations: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalCount: 0,
            itemsPerPage: limit,
            hasNextPage: false,
            hasPrevPage: false,
            nextPage: null,
            prevPage: null,
          },
          searchParams: {
            limit,
            page,
            minScore,
            location: locationParam,
            jobType: jobTypeParam,
            workType: workTypeParam,
          },
        },
        200,
        "No job posts found."
      );
    }

    // 매칭 점수 계산
    const jobPostIds = jobPosts.map((jp: any) => Number(jp.id));
    const recommendationScores = await calculateJobRecommendationScores(personalityId, jobPostIds);

    // 매칭 결과와 채용공고 정보 결합
    const jobRecommendations = jobPosts.map((jobPost: any) => {
      const scoreResult = recommendationScores.find((rs) => rs.jobPostId === Number(jobPost.id));
      const matchScore = scoreResult?.matchScore || 0;
      const compatibility = getCompatibilityLevel(matchScore);

      return {
        id: Number(jobPost.id),
        title: jobPost.title,
        jobType: jobPost.job_type,
        workType: jobPost.work_type,
        wage: jobPost.wage,
        workSchedule: jobPost.work_schedule,
        description: jobPost.description,
        deadline: jobPost.deadline,
        company: {
          name: jobPost.business_loc.name,
          address: jobPost.business_loc.address,
          logoUrl: jobPost.business_loc.logo_url,
        },
        employer: {
          name: jobPost.user.name,
        },
        workStyles: jobPost.job_work_styles.map((jws: any) => ({
          id: Number(jws.work_style.id),
          name_ko: jws.work_style.name_ko,
          name_en: jws.work_style.name_en,
        })),
        requiredSkills: jobPost.job_practical_skills.map((jps: any) => ({
          id: Number(jps.practical_skill.id),
          name_ko: jps.practical_skill.name_ko,
          name_en: jps.practical_skill.name_en,
          category_ko: jps.practical_skill.category_ko,
          category_en: jps.practical_skill.category_en,
        })),
        applicantCount: jobPost._count.applications,
        matchScore,
        compatibility: {
          level: compatibility.level,
          percentage: compatibility.percentage,
          description: compatibility.description,
          color: compatibility.color,
        },
        createdAt: jobPost.created_at,
      };
    });

    // 점수 필터링 및 정렬
    const sortedRecommendations = jobRecommendations
      .filter((job: any) => job.matchScore >= minScore)
      .sort((a: any, b: any) => b.matchScore - a.matchScore);

    // 페이지네이션 적용
    const filteredRecommendations = sortedRecommendations.slice(offset, offset + limit);
    const filteredTotalCount = sortedRecommendations.length;

    console.log(
      `추천 완료: 페이지 ${page}/${Math.ceil(filteredTotalCount / limit)} - ${filteredRecommendations.length}개 공고 추천 (전체 ${filteredTotalCount}개, 최고 점수: ${filteredRecommendations[0]?.matchScore || 0})`
    );

    // Required skills 정보 로그 출력
    filteredRecommendations.forEach((job: any, index: number) => {
      console.log(`Job ${index + 1} (${job.title}): ${job.requiredSkills.length}개 필요 기술 - ${job.requiredSkills.map((s: any) => s.name_ko).join(', ')}`);
    });

    // 페이지네이션 메타데이터 계산
    const totalPages = Math.ceil(filteredTotalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return successResponse(
      parseBigInt({
        user: {
          id: userId,
          name: user.name,
          personalityProfile: user.personality_profile,
        },
        recommendations: filteredRecommendations,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount: filteredTotalCount,
          itemsPerPage: limit,
          hasNextPage,
          hasPrevPage,
          nextPage: hasNextPage ? page + 1 : null,
          prevPage: hasPrevPage ? page - 1 : null,
        },
        searchParams: {
          limit,
          page,
          minScore,
          location: locationParam,
          jobType: jobTypeParam,
          workType: workTypeParam,
        },
      }),
      200,
      "Job recommendations generated successfully."
    );
  } catch (error) {
    console.error("API Error GET /api/recommendations/jobs:", error);
    return errorResponse("An internal server error occurred.", 500);
  }
}
