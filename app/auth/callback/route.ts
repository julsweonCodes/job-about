import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { createUser } from "@/app/services/user-services";
import { API_URLS, PAGE_URLS } from "@/constants/api";

export async function GET(request: NextRequest) {
  console.log("=== CALLBACK ROUTE CALLED ===");
  console.log("Request URL:", request.url);

  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  console.log("code", code);

  if (code) {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    console.log("Exchange code result:", { data, error });

    if (error) {
      console.error("Auth callback error:", error);
      return NextResponse.redirect(`${requestUrl.origin}${API_URLS.AUTH.ERROR}`);
    }

    if (data.user) {
      console.log("User data from exchange:", {
        id: data.user.id,
        email: data.user.email,
        metadata: data.user.user_metadata,
      });
      console.log("User data from Supabase:", data.user);

      // 직접 데이터베이스에서 사용자 확인
      const { prisma } = await import("@/app/lib/prisma/prisma-singleton");

      const existingUser = await prisma.users.findFirst({
        where: { user_id: data.user.id },
      });

      console.log("Existing user check:", existingUser ? "Found" : "Not found");

      if (existingUser) {
        console.log("Existing user found, redirecting to home...");
        // 기존 사용자 - 홈페이지로
        return NextResponse.redirect(`${requestUrl.origin}${PAGE_URLS.HOME}`);
      } else {
        console.log("New user detected, creating user...");
        // 신규 사용자 생성 후 온보딩으로
        try {
          const userData = {
            uid: data.user.id,
            email: data.user.email || "",
            displayName:
              data.user.user_metadata?.full_name || data.user.email?.split("@")[0] || "User",
            user_metadata: data.user.user_metadata || {},
            description: "",
          };

          console.log("Creating user with data:", userData);

          // 직접 서비스 함수 호출
          const createdUser = await createUser(userData);
          console.log("User created successfully:", createdUser);
          return NextResponse.redirect(`${requestUrl.origin}${PAGE_URLS.ONBOARDING.ROOT}`);
        } catch (error) {
          console.error("User creation error:", error);
          console.error("Error details:", {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            name: error instanceof Error ? error.name : "Unknown",
          });
          return NextResponse.redirect(`${requestUrl.origin}${API_URLS.AUTH.ERROR}`);
        }
      }
    }
  }

  // 에러 시 홈페이지로
  return NextResponse.redirect(`${requestUrl.origin}${PAGE_URLS.HOME}`);
}
