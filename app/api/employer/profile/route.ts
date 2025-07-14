import { NextRequest, NextResponse } from 'next/server';
import {
  saveEmployerProfile,
  updateEmployerProfile,
  uploadEmployerImages,
} from "@/app/services/employer-services";

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const formData = await request.formData();

  const profileRaw = formData.get('profile') as string;
  const files = formData.getAll('photos') as File[];
  const logoImg = formData.getAll('logoImg') as File[];

  if (!profileRaw) {
    return NextResponse.json({ error: 'Profile data missing' }, { status: 400 });
  }

  try {
    const profile = JSON.parse(profileRaw);
    const userId = 1;
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

    //const updated = await updateEmployerProfile(Number(params.userId), payload);
    const updated = await saveEmployerProfile(payload);

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
