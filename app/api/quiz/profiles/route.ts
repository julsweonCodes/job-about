import "next/server";
import { getAllPersonalityProfiles, getPersonalityProfile } from "@/app/services/quiz-services";
import { successResponse, errorResponse } from "@/app/lib/server/commonResponse";

/**
 * GET: 모든 성향 프로필 목록을 가져오는 API
 * @description 성향 프로필 목록 페이지에서 사용
 * @usage 클라이언트에서 fetch('/api/quiz/profiles')로 호출
 */
export async function GET() {
  try {
    console.log("성향 프로필 목록 조회 API 호출");
    
    const profiles = await getAllPersonalityProfiles();

    if (!profiles) {
      console.error("성향 프로필을 찾을 수 없음");
      return errorResponse("Personality profiles not found.", 404);
    }

    console.log(`성향 프로필 ${profiles.length}개 조회 성공`);
    
    return successResponse(profiles, 200, "Personality profiles fetched successfully.");
  } catch (error) {
    console.error("API Error GET /api/quiz/profiles:", error);
    return errorResponse("An internal server error occurred.", 500);
  }
}