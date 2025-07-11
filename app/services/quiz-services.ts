import { supabase } from "@/lib/client/supabase";

/**
 * 퀴즈를 시작할 때 모든 질문과 선택지 가져오기
 * @returns {Promise<Array<object> | null>} 질문과 선택지가 포함된 배열 또는 에러 시 null
 */
export async function getQuizQuestions() {
  try {
    // quiz_questions와 quiz_choices를 조인해서 가져오기
    const { data: questions, error } = await supabase
      .from("quiz_questions")
      .select(
        `
        *,
        choices:quiz_choices (
          *,
          label
        )
      `
      )
      .order("question_code", { ascending: true });

    if (error) throw error;

    const sortedQuestions = questions?.map((q: any) => ({
      ...q,
      choices: q.choices?.sort((a: any, b: any) => a.label.localeCompare(b.label)),
    }));

    return sortedQuestions ?? [];
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    return null;
  }
}

/**
 * 퀴즈 완료 후, 사용자의 성향 프로필 ID를 업데이트
 * @param {bigint} userId - 업데이트할 사용자의 ID
 * @param {number} profileId - 새로 부여할 personality_profiles 테이블의 ID
 * @returns {Promise<object | null>} 업데이트된 사용자 정보 또는 에러 시 null
 */
export async function updateUserPersonality(userId: bigint, profileId: number) {
  try {
    const { data, error } = await supabase
      .from("users")
      .update({ personality_profile_id: profileId })
      .eq("id", Number(userId))
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating personality for user ${userId}:`, error);
    return null;
  }
}
