// 스크롤 복원을 위한 페이지 ID 상수들
export const SCROLL_IDS = {
  // Seeker 관련 페이지들
  SEEKER: {
    HOME: "seeker-home",
    LATEST: "seeker-latest",
    APPLIES: "seeker-applies",
    BOOKMARKS: "seeker-bookmarks",
    RECOMMENDATIONS: "seeker-recommendations",
  },

  // Employer 관련 페이지들 (향후 확장용)
  EMPLOYER: {
    DASHBOARD: "employer-dashboard",
    JOB_POSTS: "employer-job-posts",
  },

  // 기타 페이지들
  COMMON: {
    PROFILE: "profile",
    SETTINGS: "settings",
  },
} as const;

// 타입 정의
export type ScrollId = typeof SCROLL_IDS;
