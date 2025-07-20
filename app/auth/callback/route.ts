import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Auth callback error:", error);
      return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error`);
    }

    if (data.user) {
      // API를 통해 사용자 정보 확인
      const response = await fetch(`${requestUrl.origin}/api/user/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log("result", result);

        // 200 OK - 기존 사용자 - 홈페이지로
        return NextResponse.redirect(`${requestUrl.origin}/`);
      } else if (response.status === 404) {
        // 404 Not Found - 신규 사용자 생성 후 온보딩으로
        try {
          const createUserResponse = await fetch(`${requestUrl.origin}/api/users`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              uid: data.user.id,
              email: data.user.email,
              displayName:
                data.user.user_metadata?.full_name || data.user.email?.split("@")[0] || "User",
            }),
          });

          if (createUserResponse.ok) {
            console.log("User created successfully");
            return NextResponse.redirect(`${requestUrl.origin}/onboarding`);
          } else {
            console.error("Failed to create user");
            return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error`);
          }
        } catch (error) {
          console.error("User creation error:", error);
          return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error`);
        }
      } else {
        // API 에러 시 홈페이지로
        return NextResponse.redirect(`${requestUrl.origin}/`);
      }
    }
  }

  // 에러 시 홈페이지로
  return NextResponse.redirect(`${requestUrl.origin}/`);
}
