import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { prisma } from "@/app/lib/prisma/prisma-singleton";
import { successResponse, errorResponse } from "@/app/lib/server/commonResponse";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return errorResponse("No user found", 401);
    }

    const uid = data.user.id;

    if (!uid) {
      return errorResponse("No user ID in session", 401);
    }

    // 우리 서비스 DB에서 사용자 확인
    const user = await prisma.users.findFirst({
      where: { user_id: uid },
      select: {
        id: true,
        user_id: true,
        email: true,
        name: true,
        role: true,
        created_at: true,
      },
    });

    if (!user) {
      return errorResponse("User not found in database", 404);
    }

    // BigInt를 문자열로 변환
    const serializedUser = {
      ...user,
      id: user.id.toString(),
    };

    return successResponse(
      {
        user: serializedUser,
        message: "User found",
      },
      200,
      "User found"
    );
  } catch (error) {
    console.error("User check error:", error);
    return errorResponse("Internal server error", 500);
  }
}
