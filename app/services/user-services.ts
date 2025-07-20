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

export async function checkUserExists(userId: number) {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: {
      id: true,
      user_id: true,
      email: true,
      name: true,
      role: true,
      created_at: true,
    },
  });

  return {
    exists: !!user,
    user: user
      ? {
          ...user,
          id: user.id.toString(),
        }
      : null,
  };
}
