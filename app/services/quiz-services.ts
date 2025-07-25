import { prisma } from "@/app/lib/prisma/prisma-singleton";
import type { QuizProfile } from "@/types/quiz";

/**
 * 퀴즈를 시작할 때 모든 질문과 선택지 가져오기
 * @returns {Promise<Array<object> | null>} 질문과 선택지가 포함된 배열 또는 에러 시 null
 */
export async function getQuizQuestions() {
  try {
    console.log("퀴즈 질문 목록 조회 시작");

    // Prisma를 사용하여 quiz_questions 테이블에서 A 세션 데이터만 조회
    const questions = await prisma.quiz_questions.findMany({
      where: {
        quiz_set_id: "A", // A 세션만 조회
      },
      include: {
        choices: {
          orderBy: {
            label: "asc", // 선택지 정렬
          },
        },
        dimension: true, // dimension 정보도 포함
      },
      orderBy: {
        question_code: "asc", // 질문은 코드 순서로 정렬
      },
    });

    // BigInt를 string으로 변환하고 프론트엔드 구조에 맞게 변환
    const serializedQuestions = questions.map((question) => ({
      id: Number(question.id),
      question_code: question.question_code,
      dimension: question.dimension?.name || "Unknown",
      is_core: true, // 모든 질문을 core로 설정 (필요시 DB에 컬럼 추가)
      status: "active",
      content: {
        ko: question.content_ko,
        en: question.content_en,
      },
      img_url: (question as any).img_url || null, // 이미지 URL 추가 (타입 안전성을 위해 any 사용)
      choices: question.choices.map((choice) => ({
        label: choice.label as "A" | "B",
        title: {
          ko: `선택 ${choice.label}`, // 기본 제목 (필요시 DB에 컬럼 추가)
          en: `Choice ${choice.label}`,
        },
        content: {
          ko: choice.content_ko,
          en: choice.content_en,
        },
        emoji: (choice as any).emoji || "❓", // 기본값 설정 (타입 안전성을 위해 any 사용)
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
    console.log(`데이터베이스에서 사용자 조회 시작: authUserId=${authUserId}`);
    const user = await prisma.users.findFirst({
      where: {
        user_id: authUserId, // Supabase Auth의 string ID로 조회
      },
    });

    if (!user) {
      console.log(`사용자를 찾을 수 없어 새로 생성합니다: userId=${authUserId}`);

      // 사용자가 존재하지 않으면 새로 생성 (기본 정보만)
      const newUser = await prisma.users.create({
        data: {
          user_id: authUserId,
          name: "Unknown User", // 기본값 (추후 프로필 설정에서 변경 가능)
          email: `${authUserId}@temp.com`, // 임시 이메일 (추후 업데이트 필요)
          role: "APPLICANT", // 기본 역할
          personality_profile_id: profileId, // 바로 설정
          updated_at: new Date(), // 명시적으로 설정
        },
      });

      console.log(`새 사용자 생성 완료: dbId=${newUser.id}`);
      return newUser;
    }

    console.log(`사용자 조회 성공: dbId=${user.id}, name=${user.name}`);

    // 프로필 ID 유효성 확인
    console.log(`업데이트할 profileId=${profileId} 유효성 확인`);
    const profileExists = await prisma.personality_profiles.findUnique({
      where: { id: profileId },
    });

    if (!profileExists) {
      console.error(`존재하지 않는 프로필 ID: ${profileId}`);
      return null;
    }

    console.log(`프로필 ID ${profileId} 유효성 확인 완료`);

    // 찾은 사용자의 ID로 업데이트
    console.log(`사용자 성향 업데이트 실행: dbId=${user.id}, profileId=${profileId}`);
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
