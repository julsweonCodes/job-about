import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// server.ts에서 만든 서버용 클라이언트 생성 함수 import
// API 라우트는 서버 환경에서 실행, 반드시 서버용 클라이언트
import { createClient } from "@/utils/supabase/server";

import { getQuizQuestions, updateUserPersonality } from "@/app/services/quiz-services";
import { determineProfileId, validateQuizResponses } from "@/lib/quiz-analyzer";

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
      return NextResponse.json(
        {
          status: "error",
          code: 404,
          message: "Quiz questions not found.",
          data: null,
        },
        { status: 404 }
      );
    }

    console.log(`퀴즈 질문 ${questions.length}개 조회 성공`);
    // 성공
    return NextResponse.json({
      status: "success",
      code: 200,
      message: "Quiz questions fetched successfully.",
      data: questions,
    });
  } catch (error) {
    // 서버 내부 에러 500
    console.error("API Error GET /api/quiz:", error);
    return NextResponse.json(
      {
        status: "error",
        code: 500,
        message: "An internal server error occurred.",
        data: null,
      },
      { status: 500 }
    );
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

    // 만든 클라이언트로 로그인한 사용자 세션 가져오기
    const { data, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("세션 조회 오류:", sessionError);
      return NextResponse.json(
        { status: "error", code: 500, message: "Failed to retrieve session." },
        { status: 500 }
      );
    }

    // 세션이 없는 경우(로그인 안 함) 401 Unauthorized
    if (!data.session) {
      console.error("인증되지 않은 요청");
      return NextResponse.json(
        { status: "error", code: 401, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const session = data.session;
    const authUserId = session.user.id; // Supabase Auth의 UUID(string)

    console.log(`사용자 ${authUserId}의 퀴즈 제출 처리 시작`);

    const body = await req.json();
    const { responses } = body;

    // 요청 본문에 필수 데이터가 없는 경우, 400 Bad Request
    if (!responses || !Array.isArray(responses)) {
      console.error("응답 데이터 형식 오류:", responses);
      return NextResponse.json(
        {
          status: "error",
          code: 400,
          message: "Bad Request: responses are required.",
        },
        { status: 400 }
      );
    }

    // 응답 데이터 유효성 검사
    if (!validateQuizResponses(responses)) {
      console.error("퀴즈 응답 유효성 검사 실패");
      return NextResponse.json(
        {
          status: "error",
          code: 400,
          message: "Invalid quiz responses format.",
        },
        { status: 400 }
      );
    }

    // 타입 결정
    const profileId = determineProfileId(responses);
    console.log(`결정된 프로필 ID: ${profileId}`);

    // 사용자 성향 프로필 업데이트
    const updatedUser = await updateUserPersonality(authUserId, profileId);

    if (!updatedUser) {
      console.error("사용자 성향 업데이트 실패");
      throw new Error("Failed to update user personality.");
    }

    console.log(`퀴즈 제출 처리 완료: userId=${updatedUser.id}, profileId=${profileId}`);

    // 성공
    return NextResponse.json({
      status: "success",
      code: 200,
      message: "Quiz submitted and profile updated successfully.",
      data: {
        userId: updatedUser.id.toString(),
        profileId: updatedUser.personality_profile_id?.toString() || profileId.toString(),
      },
    });
  } catch (error) {
    // 서버 에러 500
    console.error("API Error POST /api/quiz:", error);
    return NextResponse.json(
      {
        status: "error",
        code: 500,
        message: "An internal server error occurred.",
        data: null,
      },
      { status: 500 }
    );
  }
}
