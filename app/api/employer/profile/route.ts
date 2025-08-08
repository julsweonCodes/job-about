import { NextRequest, NextResponse } from 'next/server';
import {
  getEmployerProfile,
  saveEmployerProfile,
  uploadEmployerImages,
} from "@/app/services/employer-services";
import {getUserIdFromSession} from "@/utils/auth";
import { errorResponse, successResponse } from "@/app/lib/server/commonResponse";

export async function GET() {
  const userId = await getUserIdFromSession();

  const res = await getEmployerProfile(userId);
  if (!res) {
    return errorResponse("Failed to retrieve business location data", 500);
  }
  console.log(res);
  return successResponse(res, 200, "Business location data retrieved");
}

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string, isUpdate?: boolean } }
) {
  const formData = await request.formData();

  const profileRaw = formData.get('profile') as string;
  const files = formData.getAll('photos') as File[];
  const logoImg = formData.getAll('logoImg') as File[];

  if (!profileRaw) {
    return errorResponse("Profile data missing", 400);
  }

  try {
    const profile = JSON.parse(profileRaw);
    const userId = await getUserIdFromSession();

    let imageUrls: string[] = [];
    let logoImgUrl : string[] = [];

    if (logoImg && logoImg.length === 1) {
      logoImgUrl = await uploadEmployerImages(logoImg, userId);
    }

    if (files && files.length > 0) {
      imageUrls = await uploadEmployerImages(files, userId);
    }

    const payload = {
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

    const updated = await saveEmployerProfile(payload);

    return successResponse(updated, 200, "Employer business location created successfully");
  } catch (err) {
    console.error(err);
    return errorResponse("Failed to update profile", 500);
  }
}
