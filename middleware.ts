import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { API_URLS, PAGE_URLS } from "@/constants/api";

// seeker 온보딩 분기 함수
function getSeekerOnboardingRedirect(
  profileStatus: {
    hasPersonalityProfile: boolean;
    hasApplicantProfile: boolean;
  },
  req: NextRequest
) {
  console.log("profileStatus", profileStatus);
  if (!profileStatus.hasPersonalityProfile) {
    // 퀴즈를 안 했으면 퀴즈 페이지로
    return NextResponse.redirect(new URL(API_URLS.ONBOARDING.SEEKER_QUIZ, req.url));
  }
  if (!profileStatus.hasApplicantProfile) {
    // 퀴즈는 했지만 프로필이 없으면 프로필 페이지로
    return NextResponse.redirect(new URL(API_URLS.ONBOARDING.SEEKER_PROFILE, req.url));
  }
  // 둘 다 있으면(완료) null 반환
  return null;
}

// 온보딩 전체 분기 함수
function getOnboardingRedirect(
  profileStatus: {
    hasRole: boolean;
    isProfileCompleted: boolean;
    role: string | null;
    hasPersonalityProfile: boolean;
    hasApplicantProfile: boolean;
  },
  req: NextRequest
) {
  if (!profileStatus.hasRole) {
    return NextResponse.redirect(new URL(PAGE_URLS.ONBOARDING, req.url));
  }
  if (profileStatus.role === "APPLICANT") {
    const seekerRedirect = getSeekerOnboardingRedirect(profileStatus, req);
    if (seekerRedirect) return seekerRedirect;
  }
  if (profileStatus.role === "EMPLOYER" && !profileStatus.isProfileCompleted) {
    return NextResponse.redirect(new URL(API_URLS.ONBOARDING.EMPLOYER_PROFILE, req.url));
  }
  return null;
}

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

      // API를 통해 사용자 정보 확인
      try {
        const response = await fetch(`${req.nextUrl.origin}/api/user/me`, {
          headers: {
            cookie: req.headers.get("cookie") || "",
          },
        });

        if (!response.ok) {
          // 사용자가 데이터베이스에 없으면 홈으로 리다이렉트
          console.log("User not found in database, redirecting to home");
          return NextResponse.redirect(new URL(PAGE_URLS.HOME, req.url));
        }

        const userData = await response.json();
        const profileStatus = userData.data.profileStatus;

        // 온보딩 페이지 접근 시
        if (isOnboardingPage) {
          // 온보딩이 끝났으면 메인으로 리다이렉트
          if (profileStatus.hasRole && profileStatus.isProfileCompleted) {
            if (profileStatus.role === "APPLICANT") {
              return NextResponse.redirect(new URL(PAGE_URLS.SEEKER.ROOT, req.url));
            } else if (profileStatus.role === "EMPLOYER") {
              return NextResponse.redirect(new URL(PAGE_URLS.EMPLOYER.ROOT, req.url));
            }
          }
          // 온보딩이 필요한 경우는 온보딩 페이지 허용
          return res;
        }

        // 그 외 페이지 접근 시
        const onboardingRedirect = getOnboardingRedirect(profileStatus, req);
        if (onboardingRedirect) return onboardingRedirect;
      } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.redirect(new URL(PAGE_URLS.HOME, req.url));
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
