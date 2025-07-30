import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { API_URLS, PAGE_URLS } from "@/constants/api";
import { parseBigInt } from "@/lib/utils";

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
    console.log("redirecting to seeker quiz");
    // 퀴즈를 안 했으면 퀴즈 페이지로
    return NextResponse.redirect(new URL(PAGE_URLS.ONBOARDING.SEEKER.QUIZ, req.url));
  }
  if (!profileStatus.hasApplicantProfile) {
    console.log("redirecting to seeker profile");
    // 퀴즈는 했지만 프로필이 없으면 프로필 페이지로
    return NextResponse.redirect(new URL(PAGE_URLS.ONBOARDING.SEEKER.PROFILE, req.url));
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
  console.log("getOnboardingRedirect called", profileStatus);
  if (!profileStatus.hasRole) {
    console.log("redirecting to onboarding");
    return NextResponse.redirect(new URL(PAGE_URLS.ONBOARDING.ROOT, req.url));
  }
  if (profileStatus.role === "APPLICANT") {
    const seekerRedirect = getSeekerOnboardingRedirect(profileStatus, req);
    if (seekerRedirect) return seekerRedirect;
  }
  if (profileStatus.role === "EMPLOYER" && !profileStatus.isProfileCompleted) {
    console.log("redirecting to employer profile");
    return NextResponse.redirect(new URL(PAGE_URLS.ONBOARDING.EMPLOYER.PROFILE, req.url));
  }
  return null;
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // 개발 중에는 미들웨어 라우팅 비활성화
  if (process.env.DISABLE_MIDDLEWARE === "true") {
    console.log("Middleware routing disabled for development");
    return res;
  }

  // API, 정적 파일, 인증 등은 미들웨어에서 건너뜀
  if (
    req.nextUrl.pathname.startsWith("/api/") ||
    req.nextUrl.pathname.startsWith("/images/") ||
    req.nextUrl.pathname.startsWith("/_next/") ||
    req.nextUrl.pathname.startsWith("/auth/") ||
    req.nextUrl.pathname.includes(".")
  ) {
    return res;
  }

  // 실제 존재하는 경로만 인증/온보딩 체크 (정확한 경로 매칭)
  const staticRoutes = [
    PAGE_URLS.HOME,
    PAGE_URLS.ONBOARDING.ROOT,
    PAGE_URLS.ONBOARDING.SEEKER.ROOT,
    PAGE_URLS.ONBOARDING.SEEKER.PROFILE,
    PAGE_URLS.ONBOARDING.SEEKER.QUIZ,
    PAGE_URLS.ONBOARDING.EMPLOYER.ROOT,
    PAGE_URLS.ONBOARDING.EMPLOYER.PROFILE,
    PAGE_URLS.SEEKER.ROOT,
    PAGE_URLS.SEEKER.MYPAGE.ROOT,
    PAGE_URLS.SEEKER.MYPAGE.PROFILE,
    PAGE_URLS.SEEKER.MYPAGE.APPLIES,
    PAGE_URLS.SEEKER.MYPAGE.BOOKMARKS,
    PAGE_URLS.EMPLOYER.ROOT,
    PAGE_URLS.EMPLOYER.MYPAGE,
    PAGE_URLS.EMPLOYER.POST.CREATE,
    PAGE_URLS.EMPLOYER.POST.DASHBOARD,
    PAGE_URLS.AUTH.CALLBACK,
    PAGE_URLS.AUTH.ERROR,
  ] as const;

  const isExistingRoute = (pathname: string) => {
    // Static routes 체크
    if (staticRoutes.includes(pathname as any)) {
      return true;
    }

    // Dynamic routes 패턴 매칭
    const dynamicRoutePatterns = [
      /^\/seeker\/post\/[\w-]+$/, // /seeker/post/[id]
      /^\/employer\/post\/[\w-]+\/edit$/, // /employer/post/[id]/edit
      /^\/employer\/post\/[\w-]+\/applicants$/, // /employer/post/[id]/applicants
      /^\/employer\/post\/[\w-]+\/applicants\/[\w-]+$/, // /employer/post/[id]/applicants/[applicationId]
    ];

    return dynamicRoutePatterns.some((pattern) => pattern.test(pathname));
  };

  if (!isExistingRoute(req.nextUrl.pathname)) {
    // 존재하지 않는 경로는 그냥 통과 (Next.js가 404 처리)
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
    // 세션 확인 (미들웨어에서는 getSession 사용)
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // 공개 페이지들 (인증 불필요)
    const publicPages = [PAGE_URLS.HOME, PAGE_URLS.AUTH.CALLBACK, PAGE_URLS.AUTH.ERROR];
    const isPublicPage = publicPages.some((page) => req.nextUrl.pathname === page);

    // 온보딩 관련 페이지들
    const onboardingPages = [
      PAGE_URLS.ONBOARDING.ROOT,
      PAGE_URLS.ONBOARDING.SEEKER.ROOT,
      PAGE_URLS.ONBOARDING.EMPLOYER.ROOT,
    ];
    const isOnboardingPage = onboardingPages.some((page) => req.nextUrl.pathname.startsWith(page));

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
    if (session?.user) {
      // 홈페이지는 사용자 정보와 관계없이 접근 가능
      if (req.nextUrl.pathname === PAGE_URLS.HOME) {
        return res;
      }

      // API를 통해 사용자 정보 확인
      try {
        const origin = req.nextUrl.origin || "http://localhost:3000";
        const apiUrl = `${origin}/${API_URLS.USER.ME}`;
        console.log(`[middleware] fetching user data from ${apiUrl}`);

        if (!origin || origin === "") {
          console.error("[middleware] origin is empty, using localhost");
          throw new Error("Invalid origin");
        }

        const response = await fetch(apiUrl, {
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
          console.log("[middleware] isOnboardingPage, path:", req.nextUrl.pathname);
          console.log("[middleware] profileStatus:", JSON.stringify(parseBigInt(profileStatus)));

          // 온보딩이 끝났으면 메인으로 리다이렉트
          if (profileStatus.hasRole && profileStatus.isProfileCompleted) {
            if (profileStatus.role === "APPLICANT") {
              return NextResponse.redirect(new URL(PAGE_URLS.SEEKER.ROOT, req.url));
            } else if (profileStatus.role === "EMPLOYER") {
              return NextResponse.redirect(new URL(PAGE_URLS.EMPLOYER.ROOT, req.url));
            }
          }

          // 온보딩 순서 체크 로직
          const currentPath = req.nextUrl.pathname;
          console.log(`[middleware] checking onboarding order for: ${currentPath}`);

          // APPLICANT 온보딩 순서 체크
          if (profileStatus.role === "APPLICANT") {
            // quiz를 안했는데 profile 페이지에 있다면 quiz로 리다이렉트
            if (!profileStatus.hasPersonalityProfile && currentPath.includes("/profile")) {
              console.log(`[middleware] redirecting to quiz from profile page`);
              return NextResponse.redirect(new URL(PAGE_URLS.ONBOARDING.SEEKER.QUIZ, req.url));
            }
            // quiz는 했는데 applicant profile이 없고 quiz 페이지에 있다면 profile로 리다이렉트
            // 단, quiz result 페이지는 예외로 허용
            if (
              profileStatus.hasPersonalityProfile &&
              !profileStatus.hasApplicantProfile &&
              currentPath.includes("/quiz") &&
              !currentPath.includes("/quiz/result")
            ) {
              console.log(`[middleware] redirecting to profile from quiz page`);
              return NextResponse.redirect(new URL(PAGE_URLS.ONBOARDING.SEEKER.PROFILE, req.url));
            }
          }

          // 현재 페이지가 올바른 온보딩 페이지면 허용
          return res;
        }

        // 그 외 페이지 접근 시
        console.log("[middleware] not onboarding page, path:", req.nextUrl.pathname);
        console.log("[middleware] profileStatus:", JSON.stringify(parseBigInt(profileStatus)));
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
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
