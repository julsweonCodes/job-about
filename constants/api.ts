// API URL 상수 관리
export const API_URLS = {
  // 사용자 관련
  USER: {
    ME: "/api/user/me",
    CHECK: "/api/users/check",
    ROLE: "/api/users/role",
    CREATE: "/api/users",
    UPDATE: "/api/users",
    UPDATE_PROFILE_IMAGE: "/api/users/image",
  },

  // 인증 관련
  AUTH: {
    CALLBACK: "/auth/callback",
    ERROR: "/auth/auth-code-error",
  },

  // 온보딩 관련
  ONBOARDING: {
    ROOT: "/onboarding",
    SEEKER: "/onboarding/seeker",
    EMPLOYER: "/onboarding/employer",
    SEEKER_PROFILE: "/onboarding/seeker/profile",
    SEEKER_QUIZ: "/onboarding/seeker/quiz",
    EMPLOYER_PROFILE: "/onboarding/employer/profile",
  },

  // 구인자 관련
  EMPLOYER: {
    PROFILE: "/api/employer/profile",
    DASHBOARD: {
      ROOT: "/api/employer/dashboard",
      JOBPOSTS: "/api/employer/dashboard/jobposts",
      APPLICANT_LIST: (postId: string) => `/api/employer/dashboard/${postId}/applicants`,
    },
    POST: {
      CREATE: "/api/employer/post/create",
      PUBLISH: (id: string) => `/api/employer/post/preview/${id}`,
      DETAIL: (id: string, status?: string) =>
        status ? `/api/employer/post/${id}?status=${status}` : `/api/employer/post/${id}`,
      EDIT: (id: string) => `/api/employer/post/${id}/edit`,
      STATUS: "/api/employer/dashboard/jobposts",
    },
    APPLICANTS: {
      UPDATE_STATUS: "/api/employer/applicants/update-status",
    },
  },

  // 구직자 관련
  SEEKER: {
    PROFILES: "/api/seeker/profiles",
    APPLY: "/api/seeker/applies",
  },

  // 직업 관련
  JOB_POSTS: {
    ROOT: "/api/job-posts",
    DETAIL: (id: string, status: string) => `/api/job-posts/${id}?status=${status}`,
    WORK_STYLES: (id: string) => `/api/job-posts/${id}/work-styles`,
    MATCH_CANDIDATES: (id: string) => `/api/job-posts/${id}/match-candidates`,
    APPLY: (id: string) => `/api/job-posts/${id}/apply`,
    BOOKMARK: (id: string) => `/api/job-posts/${id}/bookmark`,
    BOOKMARKS: "/api/seeker/bookmarks",
    APPLIES: "/api/seeker/applies",
  },

  // 퀴즈 관련
  QUIZ: {
    ROOT: "/api/quiz",
    PROFILES: "/api/quiz/profiles",
    MY_PROFILE: "/api/quiz/my-profile",
  },

  // 추천 관련
  RECOMMENDATIONS: {
    JOBS: "/api/recommendations/jobs",
  },

  // enum 관련
  ENUM: {
    ROOT: "/api/enum",
    BY_NAME: (name: string) => `/api/enum?name=${name}`,
  },

  // 기타
  WORK_STYLES: "/api/work-styles",
  UTILS: "/api/utils",
} as const;

// 페이지 URL 상수
export const PAGE_URLS = {
  HOME: "/",
  ONBOARDING: {
    ROOT: "/onboarding",
    SEEKER: {
      ROOT: "/onboarding/seeker",
      PROFILE: "/onboarding/seeker/profile",
      QUIZ: "/onboarding/seeker/quiz",
    },
    EMPLOYER: {
      ROOT: "/onboarding/employer",
      PROFILE: "/onboarding/employer/profile",
    },
  },
  SEEKER: {
    ROOT: "/seeker",
    LATEST: "/seeker/latest",
    RECOMMENDATIONS: "/seeker/recommendations",
    MYPAGE: {
      ROOT: "/seeker/mypage",
      PROFILE: "/seeker/mypage/profile",
      APPLIES: "/seeker/mypage/applies",
      BOOKMARKS: "/seeker/mypage/bookmarks",
    },
    POST: {
      DETAIL: (id: string) => `/seeker/post/${id}`,
    },
  },
  EMPLOYER: {
    ROOT: "/employer",
    MYPAGE: "/employer/mypage",
    POST: {
      CREATE: "/employer/post/create",
      DASHBOARD: "/employer/post/dashboard",
      PREVIEW: (id: string, useAI: boolean) => `/employer/post/preview/${id}?useAI=${useAI}`,
      DETAIL: (id: string) => `/employer/post/${id}`,
      EDIT: (id: string) => `/employer/post/${id}/edit`,
      APPLICANTS: (id: string) => `/employer/post/${id}/applicants`,
      APPLICANT: (id: string, applicantId: string) =>
        `/employer/post/${id}/applicants/${applicantId}`,
    },
    PENDING_UPDATES: "/employer/pending-updates",
  },
  AUTH: {
    CALLBACK: "/auth/callback",
    ERROR: "/auth/auth-code-error",
  },
} as const;

// 환경별 API 베이스 URL
export const getApiBaseUrl = () => {
  if (typeof window !== "undefined") {
    // 클라이언트 사이드
    return window.location.origin;
  }
  // 서버 사이드
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
};

// 전체 API URL 생성 헬퍼
export const createApiUrl = (path: string) => {
  return `${getApiBaseUrl()}${path}`;
};

// HTTP 메소드 상수
export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
} as const;

// HTTP 메소드 타입
export type HttpMethod = (typeof HTTP_METHODS)[keyof typeof HTTP_METHODS];
