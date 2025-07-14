import { prisma } from "@/app/lib/prisma/prisma-singleton";
import { QuizResponse, QuizProfile } from "@/types/quiz";

/**
 * 퀴즈를 시작할 때 모든 질문과 선택지 가져오기
 * @returns {Promise<Array<object> | null>} 질문과 선택지가 포함된 배열 또는 에러 시 null
 */
export async function getQuizQuestions() {
  try {
    console.log("퀴즈 질문 목록 조회 시작");

    // Prisma를 사용하여 quiz_questions 테이블에서 모든 데이터를 조회
    const questions = await prisma.quiz_questions.findMany({
      include: {
        choices: {
          orderBy: {
            label: "asc", // 선택지 정렬
          },
        },
      },
      orderBy: {
        question_code: "asc", // 질문은 코드 순서로 정렬
      },
    });

    // BigInt를 string으로 변환
    const serializedQuestions = questions.map((question) => ({
      ...question,
      id: question.id.toString(),
      dimension_id: question.dimension_id ? question.dimension_id.toString() : null,
      choices: question.choices.map((choice) => ({
        ...choice,
        id: choice.id.toString(),
        question_id: choice.question_id.toString(),
      })),
    }));

    console.log(`퀴즈 질문 ${serializedQuestions.length}개 조회 완료`);
    return serializedQuestions;
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    // 에러 발생 시, null 반환
    return null;
  }
}

/**
 * 퀴즈 완료 후, 사용자의 성향 프로필 ID를 업데이트
 * @param {string} authUserId - Supabase Auth에서 받은 사용자의 고유 UUID(string)
 * @param {number} profileId - 새로 부여할 personality_profiles 테이블의 ID
 * @returns {Promise<object | null>} 업데이트된 사용자 정보 또는 에러 시 null
 */
export async function updateUserPersonality(authUserId: string, profileId: number) {
  try {
    console.log(`사용자 성향 업데이트 시작: userId=${authUserId}, profileId=${profileId}`);

    // 사용자 찾기
    const user = await prisma.users.findFirst({
      where: {
        user_id: authUserId, // Supabase Auth의 string ID로 조회
      },
    });

    if (!user) {
      console.error(`사용자를 찾을 수 없음: userId=${authUserId}`);
      return null;
    }

    // 찾은 사용자의 ID로 업데이트
    const updatedUser = await prisma.users.update({
      where: {
        id: user.id, // BigInt인 primary key로 업데이트
      },
      data: {
        personality_profile_id: profileId,
      },
    });

    console.log(`사용자 성향 업데이트 완료: userId=${updatedUser.id}`);
    return updatedUser;
  } catch (error) {
    console.error(`Error updating personality for user ${authUserId}:`, error);
    return null;
  }
}

/**
 * 모든 성향 프로필 목록을 가져오기
 * @returns {Promise<QuizProfile[] | null>} 성향 프로필 배열 또는 에러 시 null
 */
export async function getAllPersonalityProfiles() {
  try {
    console.log("성향 프로필 목록 조회 시작");

    const profiles = await prisma.personality_profiles.findMany({
      orderBy: {
        id: "asc",
      },
    });

    // BigInt를 string으로 변환
    const serializedProfiles = profiles.map((profile) => ({
      ...profile,
      id: profile.id.toString(),
    }));

    console.log(`성향 프로필 ${serializedProfiles.length}개 조회 완료`);
    return serializedProfiles;
  } catch (error) {
    console.error("Error fetching personality profiles:", error);
    return null;
  }
}

/**
 * 특정 성향 프로필 정보 가져오기
 * @param {number} profileId - 성향 프로필 ID
 * @returns {Promise<QuizProfile | null>} 성향 프로필 정보 또는 에러 시 null
 */
export async function getPersonalityProfile(profileId: number) {
  try {
    console.log(`성향 프로필 조회 시작: profileId=${profileId}`);

    const profile = await prisma.personality_profiles.findUnique({
      where: {
        id: profileId,
      },
    });

    if (profile) {
      console.log(`성향 프로필 조회 완료: ${profile.name_ko}`);
      // BigInt를 string으로 변환
      return {
        ...profile,
        id: profile.id.toString(),
      };
    } else {
      console.log(`성향 프로필을 찾을 수 없음: profileId=${profileId}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching personality profile ${profileId}:`, error);
    return null;
  }
}

/**
 * 사용자의 현재 성향 프로필 정보 가져오기
 * @param {string} authUserId - Supabase Auth 사용자 ID
 * @returns {Promise<QuizProfile | null>} 사용자의 성향 프로필 정보 또는 에러 시 null
 */
export async function getUserPersonalityProfile(authUserId: string) {
  try {
    console.log(`사용자 성향 프로필 조회 시작: userId=${authUserId}`);

    const user = await prisma.users.findFirst({
      where: {
        user_id: authUserId,
      },
      include: {
        personality_profile: true,
      },
    });

    if (user?.personality_profile) {
      console.log(`사용자 성향 프로필 조회 완료: ${user.personality_profile.name_ko}`);
      // BigInt를 string으로 변환
      return {
        ...user.personality_profile,
        id: user.personality_profile.id.toString(),
      };
    } else {
      console.log(`사용자 성향 프로필이 설정되지 않음: userId=${authUserId}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching user personality profile ${authUserId}:`, error);
    return null;
  }
}
