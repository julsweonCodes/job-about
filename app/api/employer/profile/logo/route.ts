import { NextRequest, NextResponse } from "next/server";
import { updateEmployerProfile, uploadEmployerImages } from "@/app/services/employer-services";
import { getUserIdFromSession } from "@/utils/auth";
import { errorResponse, successResponse } from "@/app/lib/server/commonResponse";

export async function PATCH(request: NextRequest) {
  try {
    const formData = await request.formData();
    const logoFile = formData.get("logo") as File;
    const userId = await getUserIdFromSession();

    if (!logoFile) {
      return errorResponse("Logo file is required", 400);
    }

    // 로고 이미지 업로드
    const logoUrls = await uploadEmployerImages([logoFile], userId);

    if (!logoUrls || logoUrls.length === 0) {
      return errorResponse("Failed to upload logo image", 500);
    }

    // 프로필 업데이트 (로고 URL만)
    const updateData = {
      user_id: userId,
      logo_url: logoUrls[0],
      updated_at: new Date().toISOString(),
    };

    const result = await updateEmployerProfile(updateData);
    return successResponse(result, 200, "Logo updated successfully");
  } catch (err) {
    console.error(err);
    return errorResponse("Failed to update logo", 500);
  }
}
