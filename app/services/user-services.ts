import { SupabaseUser, UpdateUser } from "@/types/user";
import { HttpError } from "../lib/server/commonResponse";
import { prisma } from "@/app/lib/prisma/prisma-singleton";
import { supabaseClient } from "@/utils/supabase/client";
import { Role } from "@prisma/client";

export async function createUser(supabaseUser: SupabaseUser) {
  const { uid, email, displayName } = supabaseUser;

  const user = await prisma.users.findFirst({
    where: {
      user_id: uid,
    },
  });
  if (user) {
    throw new HttpError("User already exists", 409);
  } else {
    const created = await prisma.users.create({
      data: {
        user_id: uid,
        email,
        name: displayName,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    // BigInt를 문자열로 변환하여 반환
    return {
      ...created,
      id: created.id.toString(),
    };
  }
}

// uploading images to supabase storage
export async function uploadUserImage(photo: File, userId: number): Promise<string> {
  const fileExt = photo.name.split(".").pop();
  const filePath = `${Date.now()}-${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  const { error: uploadError } = await supabaseClient.storage
    .from("job-about")
    .upload("user-photo/".concat(filePath), photo);

  if (uploadError) {
    console.error("user image upload error: " + uploadError.message);
    throw uploadError;
  }

  return filePath;
}

export async function updateUser(updateUser: UpdateUser, userId: number) {
  const { name, phone_number, description, img_url } = updateUser;
  const user = await prisma.users.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new HttpError("User not found", 404);
  }

  const updated = await prisma.users.update({
    where: { id: userId },
    data: {
      name,
      phone_number,
      description,
      img_url,
      updated_at: new Date(),
    },
  });

  return updated;
}

export async function updateUserRole(role: Role, userId: number) {
  const user = await prisma.users.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new HttpError("User not found", 404);
  }

  const updated = await prisma.users.update({
    where: { id: userId },
    data: {
      role,
      updated_at: new Date(),
    },
  });

  return updated;
}

export async function getUserWithProfileStatus(userId: string) {
  try {
    // 사용자 정보 확인
    const user = await prisma.users.findFirst({
      where: { user_id: userId, deleted_at: null },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // seeker의 경우 추가 정보
    let isProfileCompleted = false;
    let hasPersonalityProfile = false;
    let hasApplicantProfile = false;

    if (user.role === "APPLICANT") {
      hasPersonalityProfile = !!user.personality_profile_id;
      const applicantProfile = await prisma.applicant_profiles.findFirst({
        where: { user_id: user.id },
        select: { id: true },
      });
      hasApplicantProfile = !!applicantProfile;
      isProfileCompleted = hasPersonalityProfile && hasApplicantProfile;
    } else if (user.role === "EMPLOYER") {
      const businessLoc = await prisma.business_loc.findFirst({
        where: { user_id: user.id },
        select: { id: true },
      });
      isProfileCompleted = !!businessLoc;
    }

    // BigInt를 문자열로 변환
    const serializedUser = {
      ...user,
      id: user.id.toString(),
    };

    return {
      user: serializedUser,
      profileStatus: {
        hasRole: !!user.role,
        isProfileCompleted,
        hasPersonalityProfile,
        hasApplicantProfile,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("Error getting user with profile status:", error);
    throw error;
  }
}
