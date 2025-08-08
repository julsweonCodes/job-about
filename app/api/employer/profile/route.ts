import { NextRequest, NextResponse } from "next/server";
import {
  getEmployerProfile,
  saveEmployerProfile,
  updateEmployerProfile,
  uploadEmployerImages,
} from "@/app/services/employer-services";
import { getUserIdFromSession } from "@/utils/auth";
import { errorResponse, successResponse } from "@/app/lib/server/commonResponse";
import { EmployerProfilePayload } from "@/types/employer";

export async function GET() {
  const userId = await getUserIdFromSession();

  const res = await getEmployerProfile(userId);
  if (!res) {
    return errorResponse("Failed to retrieve business location data", 500);
  }
  console.log(res);
  return successResponse(res, 200, "Business location data retrieved");
}

export async function POST(request: NextRequest, { params }: { params: { isUpdate?: boolean } }) {
  const formData = await request.formData();

  const profileRaw = formData.get("profile") as string;
  const files = formData.getAll("photos") as File[];
  const logoImg = formData.getAll("logoImg") as File[];

  if (!profileRaw) {
    return errorResponse("Profile data missing", 400);
  }
  const isUpdate = request.nextUrl.searchParams.get("isUpdate") === "true";

  try {
    const profile = JSON.parse(profileRaw);
    const userId = await getUserIdFromSession();

    let imageUrls: string[] = [];
    let logoImgUrl: string[] = [];

    if (logoImg && logoImg.length === 1) {
      logoImgUrl = await uploadEmployerImages(logoImg, userId);
    }

    if (files && files.length > 0) {
      imageUrls = await uploadEmployerImages(files, userId);
    }

    const payload: EmployerProfilePayload = {
      ...profile,
      user_id: userId,
      logo_url: logoImgUrl[0],
      ...(imageUrls.length > 0 && {
        img_url1: imageUrls[0] || null,
        img_url2: imageUrls[1] || null,
        img_url3: imageUrls[2] || null,
        img_url4: imageUrls[3] || null,
        img_url5: imageUrls[4] || null,
      }),
      updated_at: new Date().toISOString(),
    };

    const result = isUpdate
      ? await updateEmployerProfile(payload)
      : await saveEmployerProfile(payload);

    return successResponse(
      result,
      200,
      isUpdate
        ? "Employer business location updated successfully"
        : "Employer business location created successfully"
    );
  } catch (err) {
    console.error(err);
    return errorResponse("Failed to update profile", 500);
  }
}
