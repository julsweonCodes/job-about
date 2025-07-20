import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { prisma } from "@/app/lib/prisma/prisma-singleton";
import { successResponse, errorResponse } from "@/app/lib/server/commonResponse";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
      return errorResponse("No session found", 401);
    }

    const uid = data.session.user?.id;

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

    return successResponse(
      {
        user: user,
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
