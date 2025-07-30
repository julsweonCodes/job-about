"use client";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { PAGE_URLS } from "@/constants/api";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

export default function AuthProvider() {
  const { authState, initializeAuth } = useAuth();
  const { profileStatus } = useAuthStore();
  const router = useRouter();

  // 실제 존재하는 경로인지 체크하는 함수
  const isExistingRoute = (pathname: string) => {
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

  // 404(존재하지 않는 경로)에서는 AuthProvider 자체를 렌더하지 않음
  if (typeof window !== "undefined" && !isExistingRoute(window.location.pathname)) {
    console.log("AuthProvider routing disabled for 404");
    return null;
  }

  // 인증 초기화
  useEffect(() => {
    const cleanup = initializeAuth();
    return cleanup;
  }, [initializeAuth]);

  // 중앙화된 인증 체크 및 라우팅 처리
  useEffect(() => {
    const isRoutingDisabled = process.env.NEXT_PUBLIC_DISABLE_MIDDLEWARE === "true";
    if (isRoutingDisabled) {
      console.log("AuthProvider routing disabled for development");
      return;
    }

    const currentPath = window.location.pathname;

    // 공개 페이지들 (인증 불필요)
    const publicPages = [PAGE_URLS.HOME, PAGE_URLS.AUTH.CALLBACK, PAGE_URLS.AUTH.ERROR];
    const isPublicPage = publicPages.some((page) => currentPath === page);

    // 인증이 완료되지 않은 경우
    if (authState === "unauthenticated") {
      // 공개 페이지가 아니면 홈으로 리다이렉트
      if (!isPublicPage) {
        console.log("User not authenticated, redirecting to home");
        router.replace(PAGE_URLS.HOME);
      }
      return;
    }

    // 인증 에러가 발생한 경우
    if (authState === "error") {
      // 공개 페이지가 아니면 홈으로 리다이렉트
      if (!isPublicPage) {
        console.log("Authentication error, redirecting to home");
        router.replace(PAGE_URLS.HOME);
      }
      return;
    }

    // 인증이 완료되지 않았거나 프로필 상태가 없으면 라우팅하지 않음
    if (authState !== "authenticated" || !profileStatus) {
      return;
    }

    // 이미 올바른 페이지에 있다면 리다이렉트하지 않음
    const shouldRedirect = (targetPath: string) => {
      return currentPath !== targetPath;
    };

    // seeker 온보딩 분기
    if (profileStatus.role === "APPLICANT" && !profileStatus.isProfileCompleted) {
      if (!profileStatus.hasPersonalityProfile) {
        if (shouldRedirect(PAGE_URLS.ONBOARDING.SEEKER.QUIZ)) {
          console.log("Redirecting seeker to quiz");
          router.replace(PAGE_URLS.ONBOARDING.SEEKER.QUIZ);
        }
        return;
      } else if (!profileStatus.hasApplicantProfile) {
        if (shouldRedirect(PAGE_URLS.ONBOARDING.SEEKER.PROFILE)) {
          console.log("Redirecting seeker to profile");
          router.replace(PAGE_URLS.ONBOARDING.SEEKER.PROFILE);
        }
        return;
      }
    } else if (profileStatus.role === "EMPLOYER" && !profileStatus.isProfileCompleted) {
      if (shouldRedirect(PAGE_URLS.ONBOARDING.EMPLOYER.PROFILE)) {
        console.log("Redirecting employer to profile");
        router.replace(PAGE_URLS.ONBOARDING.EMPLOYER.PROFILE);
      }
      return;
    } else if (!profileStatus.hasRole) {
      if (shouldRedirect(PAGE_URLS.ONBOARDING.ROOT)) {
        console.log("Redirecting to onboarding root");
        router.replace(PAGE_URLS.ONBOARDING.ROOT);
      }
      return;
    }

    // 온보딩이 모두 끝난 경우에는 추가 라우팅 없음
    console.log("Onboarding completed, no redirect needed");
  }, [authState, profileStatus, router]);

  return null;
}
