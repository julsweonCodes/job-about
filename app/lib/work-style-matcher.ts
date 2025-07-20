import { prisma } from "@/app/lib/prisma/prisma-singleton";

/**
 * 구직자의 성향과 채용공고의 선호 work style 간 매칭 점수를 계산
 * @param seekerPersonalityId 구직자의 성향 ID
 * @param jobPostWorkStyleIds 채용공고에서 선택한 work style ID 배열
 * @returns 매칭 점수 (높을수록 잘 맞음)
 */
export async function calculateWorkStyleMatchScore(
  seekerPersonalityId: number,
  jobPostWorkStyleIds: number[]
): Promise<number> {
  try {
    console.log(
      `매칭 점수 계산 시작: personality=${seekerPersonalityId}, workStyles=${jobPostWorkStyleIds}`
    );

    if (jobPostWorkStyleIds.length === 0) {
      console.log("job post에 work style이 선택되지 않음 - 기본 점수 0 반환");
      return 0;
    }

    // 구직자 성향에 대한 work style 가중치 조회
    const weights = await prisma.personality_work_style_weights.findMany({
      where: {
        personality_id: seekerPersonalityId,
        work_style_id: {
          in: jobPostWorkStyleIds,
        },
      },
      include: {
        work_style: true,
      },
    });

    if (weights.length === 0) {
      console.log("매칭되는 가중치 데이터가 없음 - 기본 점수 0 반환");
      return 0;
    }

    // 가중치 합산하여 매칭 점수 계산
    const totalScore = weights.reduce((sum: number, weight: any) => {
      console.log(`${weight.work_style.name_ko}: ${weight.weight}점`);
      return sum + weight.weight;
    }, 0);

    const averageScore = totalScore / jobPostWorkStyleIds.length;

    console.log(`총 점수: ${totalScore}, 평균 점수: ${averageScore}`);
    return Math.round(averageScore * 10) / 10; // 소수점 1자리까지
  } catch (error) {
    console.error("매칭 점수 계산 중 에러:", error);
    throw error;
  }
}

/**
 * 여러 구직자들과 특정 채용공고 간의 매칭 점수를 일괄 계산
 * @param jobPostId 채용공고 ID
 * @param seekerIds 구직자 ID 배열 (users.id)
 * @returns 구직자별 매칭 점수 배열
 */
export async function calculateBulkMatchScores(
  jobPostId: number,
  seekerIds: number[]
): Promise<Array<{ seekerId: number; personalityId: number | null; matchScore: number }>> {
  try {
    console.log(`일괄 매칭 점수 계산: jobPost=${jobPostId}, seekers=${seekerIds.length}명`);

    // 1. 채용공고의 선호 work style 조회
    const jobWorkStyles = await prisma.job_post_work_styles.findMany({
      where: { job_post_id: jobPostId },
      select: { work_style_id: true },
    });

    const workStyleIds = jobWorkStyles.map((jws: any) => Number(jws.work_style_id));

    if (workStyleIds.length === 0) {
      console.log("채용공고에 work style이 설정되지 않음");
      return seekerIds.map((id) => ({ seekerId: id, personalityId: null, matchScore: 0 }));
    }

    // 2. 구직자들의 성향 정보 조회
    const seekers = await prisma.users.findMany({
      where: {
        id: { in: seekerIds.map((id) => BigInt(id)) },
      },
      select: {
        id: true,
        personality_profile_id: true,
      },
    });

    // 3. 각 구직자별 매칭 점수 계산
    const results = [];

    for (const seeker of seekers) {
      const seekerId = Number(seeker.id);
      const personalityId = seeker.personality_profile_id
        ? Number(seeker.personality_profile_id)
        : null;

      if (!personalityId) {
        console.log(`구직자 ${seekerId}: 성향 미설정 - 점수 0`);
        results.push({ seekerId, personalityId: null, matchScore: 0 });
        continue;
      }

      const matchScore = await calculateWorkStyleMatchScore(personalityId, workStyleIds);
      results.push({ seekerId, personalityId, matchScore });
    }

    console.log(`일괄 매칭 완료: ${results.length}명 처리`);
    return results;
  } catch (error) {
    console.error("일괄 매칭 점수 계산 중 에러:", error);
    throw error;
  }
}

/**
 * 구직자에게 추천할 채용공고들의 매칭 점수를 계산
 * @param seekerPersonalityId 구직자의 성향 ID
 * @param jobPostIds 채용공고 ID 배열
 * @returns 채용공고별 매칭 점수 배열
 */
export async function calculateJobRecommendationScores(
  seekerPersonalityId: number,
  jobPostIds: number[]
): Promise<Array<{ jobPostId: number; matchScore: number; matchedWorkStyles: string[] }>> {
  try {
    console.log(
      `채용공고 추천 점수 계산: personality=${seekerPersonalityId}, jobs=${jobPostIds.length}개`
    );

    const results = [];

    for (const jobPostId of jobPostIds) {
      // 채용공고의 work style 조회
      const jobWorkStyles = await prisma.job_post_work_styles.findMany({
        where: { job_post_id: jobPostId },
        include: { work_style: true },
      });

      const workStyleIds = jobWorkStyles.map((jws: any) => Number(jws.work_style_id));

      if (workStyleIds.length === 0) {
        results.push({
          jobPostId,
          matchScore: 0,
          matchedWorkStyles: [],
        });
        continue;
      }

      const matchScore = await calculateWorkStyleMatchScore(seekerPersonalityId, workStyleIds);
      const matchedWorkStyles = jobWorkStyles.map((jws: any) => jws.work_style.name_ko);

      results.push({
        jobPostId,
        matchScore,
        matchedWorkStyles,
      });
    }

    // 매칭 점수 높은 순으로 정렬
    results.sort((a, b) => b.matchScore - a.matchScore);

    console.log(`채용공고 추천 완료: 최고 점수 ${results[0]?.matchScore || 0}`);
    return results;
  } catch (error) {
    console.error("채용공고 추천 점수 계산 중 에러:", error);
    throw error;
  }
}

/**
 * 매칭 점수를 사용자 친화적인 호환성 레벨로 변환
 * @param score 매칭 점수 (-2.0 ~ +2.0)
 * @returns 호환성 정보 객체
 */
export function getCompatibilityLevel(score: number): {
  level: string;
  percentage: number;
  description: string;
  color: string;
} {
  if (score >= 1.5) {
    return {
      level: "매우 높음",
      percentage: 90 + Math.round((score - 1.5) * 20), // 90-100%
      description: "이 직무와 매우 잘 맞는 성향입니다",
      color: "green",
    };
  } else if (score >= 0.5) {
    return {
      level: "높음",
      percentage: 70 + Math.round((score - 0.5) * 20), // 70-89%
      description: "이 직무와 잘 맞는 성향입니다",
      color: "blue",
    };
  } else if (score >= -0.5) {
    return {
      level: "보통",
      percentage: 50 + Math.round(score * 20), // 40-69%
      description: "이 직무와 어느 정도 맞는 성향입니다",
      color: "yellow",
    };
  } else if (score >= -1.5) {
    return {
      level: "낮음",
      percentage: 20 + Math.round((score + 1.5) * 20), // 20-39%
      description: "이 직무와 다소 맞지 않는 성향입니다",
      color: "orange",
    };
  } else {
    return {
      level: "매우 낮음",
      percentage: Math.max(0, 20 + Math.round((score + 2) * 20)), // 0-19%
      description: "이 직무와 잘 맞지 않는 성향입니다",
      color: "red",
    };
  }
}
