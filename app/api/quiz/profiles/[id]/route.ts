import { NextRequest } from "next/server";
import { getPersonalityProfile } from "@/app/services/quiz-services";
import { successResponse, errorResponse } from "@/app/lib/server/commonResponse";

/**
 * GET: 특정 성향 프로필 정보를 가져오는 API
 * @description 성향 프로필 상세 페이지에서 사용
 * @usage 클라이언트에서 fetch('/api/quiz/profiles/[id]')로 호출
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const profileId = parseInt(params.id);
    
    if (isNaN(profileId)) {
      console.error(`잘못된 프로필 ID: ${params.id}`);
      return errorResponse("Invalid profile ID.", 400);
    }

    console.log(`성향 프로필 상세 조회 API 호출: profileId=${profileId}`);
    
    const profile = await getPersonalityProfile(profileId);

    if (!profile) {
      console.error(`성향 프로필을 찾을 수 없음: profileId=${profileId}`);
      return errorResponse("Personality profile not found.", 404);
    }

    console.log(`성향 프로필 조회 성공: ${profile.name_ko}`);
    
    return successResponse(profile, 200, "Personality profile fetched successfully.");
  } catch (error) {
    console.error(`API Error GET /api/quiz/profiles/${params.id}:`, error);
    return errorResponse("An internal server error occurred.", 500);
  }
}