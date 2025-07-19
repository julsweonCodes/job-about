import { NextRequest } from "next/server";
import { cookies } from "next/headers";

// server.ts에서 만든 서버용 클라이언트 생성 함수 import
// API 라우트는 서버 환경에서 실행, 반드시 서버용 클라이언트
import { createClient } from "@/utils/supabase/server";

import { getQuizQuestions, updateUserPersonality } from "@/app/services/quiz-services";
import { determineProfileId, validateQuizResponses } from "@/lib/quiz-analyzer";
import { successResponse, errorResponse } from "@/app/lib/server/commonResponse";

/**
 * GET: 퀴즈 질문 목록을 가져오는 API
 * @description 퀴즈 페이지가 로드될 때 호출되어 6개의 질문과 선택지 반환
 * @usage 클라이언트에서 fetch('/api/quiz')로 호출
 */
export async function GET() {
  try {
    console.log("퀴즈 질문 목록 조회 API 호출");

    const questions = await getQuizQuestions();

    // 받은 데이터 없는 경우 404
    if (!questions) {
      console.error("퀴즈 질문을 찾을 수 없음");
      return errorResponse("Quiz questions not found.", 404);
    }

    console.log(`퀴즈 질문 ${questions.length}개 조회 성공`);
    // 성공
    return successResponse(questions, 200, "Quiz questions fetched successfully.");
  } catch (error) {
    // 서버 내부 에러 500
    console.error("API Error GET /api/quiz:", error);
    return errorResponse("An internal server error occurred.", 500);
  }
}

/**
 * POST: 퀴즈 답변을 제출하고 결과를 처리하는 API
 * @description 사용자가 퀴즈를 모두 풀고 제출하면, 답변을 분석하여 성향 업데이트
 * @usage 클라이언트에서 fetch('/api/quiz', { method: 'POST', body: JSON.stringify({ responses: [...] }) })로 호출
 */
export async function POST(req: NextRequest) {
  try {
    console.log("퀴즈 제출 API 호출");

    // 쿠키를 이용해 서버용 Supabase 클라이언트 생성
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);

    // 인증된 사용자 정보 가져오기 (보안 권장사항에 따라 getUser 사용)
    const { data, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("사용자 인증 오류:", userError);
      return errorResponse("Failed to authenticate user.", 500);
    }

    // 인증되지 않은 경우 401 Unauthorized
    if (!data.user) {
      console.error("인증되지 않은 요청");
      return errorResponse("Unauthorized.", 401);
    }

    const authUserId = data.user.id; // Supabase Auth의 UUID(string)

    console.log(`사용자 ${authUserId}의 퀴즈 제출 처리 시작`);

    const body = await req.json();
    const { responses } = body;

    // 요청 본문에 필수 데이터가 없는 경우, 400 Bad Request
    if (!responses || !Array.isArray(responses)) {
      console.error("응답 데이터 형식 오류:", responses);
      return errorResponse("Bad Request: responses are required.", 400);
    }

    // 프론트엔드 형식 { questionId, answer }을 백엔드 형식 { question_code, choice_label }로 변환
    const convertedResponses = responses.map((resp: any) => {
      // answer 1은 A, answer 2는 B로 변환
      const choice_label = resp.answer === 1 ? 'A' : 'B';
      
      // questionId로부터 question_code 생성 (101 -> A01, 102 -> A02, ...)
      const questionNum = (resp.questionId - 100).toString().padStart(2, '0');
      const question_code = `A${questionNum}`;
      
      return {
        question_code,
        choice_label
      };
    });

    console.log("변환된 응답 데이터:", convertedResponses);

    // 응답 데이터 유효성 검사
    if (!validateQuizResponses(convertedResponses)) {
      console.error("퀴즈 응답 유효성 검사 실패");
      return errorResponse("Invalid quiz responses format.", 400);
    }

    // 타입 결정
    const profileId = determineProfileId(convertedResponses);
    console.log(`결정된 프로필 ID: ${profileId}`);

    // 사용자 성향 프로필 업데이트
    const updatedUser = await updateUserPersonality(authUserId, profileId);

    if (!updatedUser) {
      console.error("사용자 성향 업데이트 실패");
      throw new Error("Failed to update user personality.");
    }

    console.log(`퀴즈 제출 처리 완료: userId=${updatedUser.id}, profileId=${profileId}`);

    // 성공
    return successResponse({
      userId: updatedUser.id.toString(),
      profileId: updatedUser.personality_profile_id?.toString() || profileId.toString(),
    }, 200, "Quiz submitted and profile updated successfully.");
  } catch (error) {
    // 서버 에러 500
    console.error("API Error POST /api/quiz:", error);
    return errorResponse("An internal server error occurred.", 500);
  }
}
