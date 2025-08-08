import { NextRequest } from "next/server";
import { uploadEmployerImages } from "@/app/services/employer-services";
import { getUserIdFromSession } from "@/utils/auth";
import { errorResponse, successResponse } from "@/app/lib/server/commonResponse";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const photoFiles = formData.getAll("photos") as File[];
    const userId = await getUserIdFromSession();

    if (!photoFiles || photoFiles.length === 0) {
      return errorResponse("Photo files are required", 400);
    }

    // 워크플레이스 사진 업로드 (최대 5개)
    const maxPhotos = 5;
    const filesToUpload = photoFiles.slice(0, maxPhotos);
    const photoUrls = await uploadEmployerImages(filesToUpload, userId);

    if (!photoUrls || photoUrls.length === 0) {
      return errorResponse("Failed to upload photos", 500);
    }

    return successResponse({ photoUrls }, 200, "Photos uploaded successfully");
  } catch (err) {
    console.error(err);
    return errorResponse("Failed to upload photos", 500);
  }
}
