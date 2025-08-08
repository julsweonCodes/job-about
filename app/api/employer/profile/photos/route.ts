import { NextRequest } from "next/server";
import { updateEmployerProfile } from "@/app/services/employer-services";
import { getUserIdFromSession } from "@/utils/auth";
import { errorResponse, successResponse } from "@/app/lib/server/commonResponse";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { photoUrls } = body; // 업로드된 파일명 리스트
    const userId = await getUserIdFromSession();

    if (!photoUrls || !Array.isArray(photoUrls)) {
      return errorResponse("Photo URLs array is required", 400);
    }

    // 최대 5개까지만 허용
    const finalPhotoUrls = photoUrls.slice(0, 5);

    // 프로필 업데이트 (이미지 URL들만)
    const updateData = {
      user_id: userId,
      img_url1: finalPhotoUrls[0] || null,
      img_url2: finalPhotoUrls[1] || null,
      img_url3: finalPhotoUrls[2] || null,
      img_url4: finalPhotoUrls[3] || null,
      img_url5: finalPhotoUrls[4] || null,
      updated_at: new Date().toISOString(),
    } as any;

    console.log("Photo update data:", updateData);

    const result = await updateEmployerProfile(updateData);
    return successResponse(result, 200, "Workplace photos updated successfully");
  } catch (err) {
    console.error(err);
    return errorResponse("Failed to update workplace photos", 500);
  }
}
