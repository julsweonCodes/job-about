import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { API_URLS, PAGE_URLS } from "@/constants/api";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // 개발 중에는 미들웨어 비활성화
  if (process.env.DISABLE_MIDDLEWARE === "true") {
    console.log("Middleware disabled for development");
    return res;
  }

  // Supabase 클라이언트 생성
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  try {
    // 세션 확인
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // 공개 페이지들 (인증 불필요)
    const publicPages = [PAGE_URLS.HOME, API_URLS.AUTH.CALLBACK, API_URLS.AUTH.ERROR];
    const isPublicPage = publicPages.some((page) => req.nextUrl.pathname === page);

    // 온보딩 관련 페이지들
    const onboardingPages = [PAGE_URLS.ONBOARDING, "/onboarding/seeker", "/onboarding/employer"];
    const isOnboardingPage = onboardingPages.some((page) => req.nextUrl.pathname.startsWith(page));

    // API 라우트, 정적 파일, 인증 관련 라우트는 건너뛰기
    if (
      req.nextUrl.pathname.startsWith("/api/") ||
      req.nextUrl.pathname.startsWith("/images/") ||
      req.nextUrl.pathname.startsWith("/_next/") ||
      req.nextUrl.pathname.startsWith("/auth/") ||
      req.nextUrl.pathname.includes(".")
    ) {
      return res;
    }

    // 로그인하지 않은 사용자
    if (!session) {
      // 공개 페이지가 아니면 홈으로 리다이렉트
      if (!isPublicPage) {
        console.log("No session, redirecting to home");
        return NextResponse.redirect(new URL(PAGE_URLS.HOME, req.url));
      }
      return res;
    }

    // 로그인한 사용자 - 온보딩 상태 확인
    if (session.user) {
      // 홈페이지는 사용자 정보와 관계없이 접근 가능
      if (req.nextUrl.pathname === PAGE_URLS.HOME) {
        return res;
      }

      // 사용자 정보 확인
      const { data: user, error } = await supabase
        .from("users")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching user:", error);
        // 사용자가 데이터베이스에 없으면 홈으로 리다이렉트
        if (error.code === "PGRST116") {
          console.log("User not found in database, redirecting to home");
          return NextResponse.redirect(new URL(PAGE_URLS.HOME, req.url));
        }
        return res;
      }

      // 온보딩 페이지 접근 시 role 체크
      if (isOnboardingPage) {
        // 이미 역할이 있으면 홈페이지로 리다이렉트
        if (user?.role) {
          console.log("User already has role, redirecting to home");
          return NextResponse.redirect(new URL(PAGE_URLS.HOME, req.url));
        }
        // 역할이 없으면 온보딩 페이지 허용
        return res;
      }

      // role이 null이면 온보딩으로 리다이렉트
      if (!user?.role) {
        console.log("User needs onboarding, redirecting to /onboarding");
        return NextResponse.redirect(new URL(PAGE_URLS.ONBOARDING, req.url));
      }
    }

    return res;
  } catch (error) {
    console.error("Middleware error:", error);
    return res;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
