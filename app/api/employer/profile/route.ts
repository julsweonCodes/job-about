import { NextRequest, NextResponse } from "next/server";
import {
  getEmployerProfile,
  saveEmployerProfile,
  updateEmployerProfile,
  uploadEmployerImages,
} from "@/app/services/employer-services";
import { getUserIdFromSession } from "@/utils/auth";
import { errorResponse, successResponse } from "@/app/lib/server/commonResponse";
import { EmployerProfilePayload } from "@/types/server/employer";

export async function GET() {
  const userId = await getUserIdFromSession();

  const res = await getEmployerProfile(userId);
  if (!res) {
    return errorResponse("Failed to retrieve business location data", 500);
  }
  console.log(res);
  return successResponse(res, 200, "Business location data retrieved");
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("PATCH request body:", body);

    let userId: number;
    try {
      userId = await getUserIdFromSession();
      console.log("User ID:", userId);
    } catch (authError) {
      console.error("Authentication error:", authError);
      return errorResponse("Authentication failed. Please log in.", 401);
    }

    // 기존 프로필 데이터를 먼저 가져오기
    const existingProfile = await getEmployerProfile(userId);
    console.log("Existing profile:", existingProfile);

    if (!existingProfile) {
      return errorResponse("Profile not found", 404);
    }

    // 필드 매핑 정의
    const fieldMappings = {
      name: "name",
      bizDescription: "description",
      address: "address",
      location: "location",
      startTime: "operating_start",
      endTime: "operating_end",
      phone: "phone_number",
    };

    // 변경된 필드만 포함하는 업데이트 데이터 생성
    const updateData = {
      user_id: userId,
      updated_at: new Date().toISOString(),
      ...Object.entries(body)
        .filter(([key]) => key in fieldMappings)
        .reduce(
          (acc, [key, value]) => ({
            ...acc,
            [fieldMappings[key as keyof typeof fieldMappings]]: value,
          }),
          {}
        ),
    };

    console.log("Update data (partial):", updateData);

    const result = await updateEmployerProfile(updateData);
    console.log("Update result:", result);

    return successResponse(result, 200, "Profile text data updated successfully");
  } catch (err) {
    console.error("PATCH error details:", err);
    return errorResponse("Failed to update profile text data", 500);
  }
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
