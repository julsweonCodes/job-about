import { successResponse, errorResponse } from "@/app/lib/server/commonResponse";
import { getUserWithProfileStatus } from "@/app/services/user-services";
import { getUserUuidFromSession } from "@/utils/auth";

export async function GET() {
  try {
    let uid: string;
    try {
      uid = await getUserUuidFromSession();
    } catch (error) {
      console.error("User check error:", error);
      return errorResponse("Unauthorized.", 401);
    }

    if (!uid) {
      return errorResponse("No user ID in session", 401);
    }

    try {
      // services를 통해 사용자 정보와 프로필 상태 확인
      const userData = await getUserWithProfileStatus(uid);

      return successResponse(
        {
          user: userData.user,
          profileStatus: userData.profileStatus,
          message: "User found",
        },
        200,
        "User found"
      );
    } catch (error) {
      if (error instanceof Error && error.message === "User not found") {
        return errorResponse("User not found in database", 404);
      }
      throw error;
    }
  } catch (error) {
    console.error("User check error:", error);
    return errorResponse("Internal server error", 500);
  }
}
