import { PAGE_URLS } from "@/constants/api";

// 정적 라우트 목록 (미들웨어와 AuthProvider에서 공통 사용)
export const STATIC_ROUTES = [
  PAGE_URLS.HOME,
  PAGE_URLS.ONBOARDING.ROOT,
  // seeker onboarding
  PAGE_URLS.ONBOARDING.SEEKER.ROOT,
  PAGE_URLS.ONBOARDING.SEEKER.PROFILE,
  PAGE_URLS.ONBOARDING.SEEKER.QUIZ,
  // employer onboarding
  PAGE_URLS.ONBOARDING.EMPLOYER.ROOT,
  PAGE_URLS.ONBOARDING.EMPLOYER.PROFILE,
  // seeker
  PAGE_URLS.SEEKER.ROOT,
  PAGE_URLS.SEEKER.MYPAGE.ROOT,
  PAGE_URLS.SEEKER.MYPAGE.PROFILE,
  PAGE_URLS.SEEKER.MYPAGE.APPLIES,
  PAGE_URLS.SEEKER.MYPAGE.BOOKMARKS,
  // employer
  PAGE_URLS.EMPLOYER.ROOT,
  PAGE_URLS.EMPLOYER.MYPAGE,
  PAGE_URLS.EMPLOYER.POST.CREATE,
  PAGE_URLS.EMPLOYER.POST.DASHBOARD,
  PAGE_URLS.AUTH.CALLBACK,
  PAGE_URLS.AUTH.ERROR,
] as const;

// 동적 라우트 패턴 (미들웨어에서 사용)
export const DYNAMIC_ROUTE_PATTERNS = [
  /^\/seeker\/post\/[\w-]+$/, // /seeker/post/[id]
  /^\/employer\/post\/[\w-]+\/edit$/, // /employer/post/[id]/edit
  /^\/employer\/post\/[\w-]+\/applicants$/, // /employer/post/[id]/applicants
  /^\/employer\/post\/[\w-]+\/applicants\/[\w-]+$/, // /employer/post/[id]/applicants/[applicationId]
] as const;

// 라우트 존재 여부 확인 함수
export const isExistingRoute = (pathname: string) => {
  // Static routes 체크
  if (STATIC_ROUTES.includes(pathname as any)) {
    return true;
  }

  // Dynamic routes 패턴 매칭
  return DYNAMIC_ROUTE_PATTERNS.some((pattern) => pattern.test(pathname));
};
