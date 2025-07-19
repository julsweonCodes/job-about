import "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { getUserPersonalityProfile } from "@/app/services/quiz-services";
import { successResponse, errorResponse } from "@/app/lib/server/commonResponse";

/**
 * GET: 현재 로그인한 사용자의 성향 프로필을 가져오는 API
 * @description 사용자 대시보드에서 본인의 성향 프로필 확인
 * @usage 클라이언트에서 fetch('/api/quiz/my-profile')로 호출
 */
export async function GET() {
  try {
    console.log("사용자 성향 프로필 조회 API 호출");
    
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);
    
    // 인증된 사용자 정보 가져오기 (보안 권장사항에 따라 getUser 사용)
    const { data, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("사용자 인증 오류:", userError);
      return errorResponse("Failed to authenticate user.", 500);
    }

    if (!data.user) {
      console.error("인증되지 않은 요청");
      return errorResponse("Unauthorized.", 401);
    }

    const authUserId = data.user.id;
    console.log(`사용자 ${authUserId}의 성향 프로필 조회 시작`);
    
    const profile = await getUserPersonalityProfile(authUserId);

    if (!profile) {
      console.log(`사용자의 성향 프로필이 설정되지 않음: userId=${authUserId}`);
      return successResponse(null, 200, "User has no personality profile set.");
    }

    console.log(`사용자 성향 프로필 조회 성공: ${profile.name_ko}`);
    
    return successResponse(profile, 200, "User personality profile fetched successfully.");
  } catch (error) {
    console.error("API Error GET /api/quiz/my-profile:", error);
    return errorResponse("An internal server error occurred.", 500);
  }
}