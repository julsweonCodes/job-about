// React Query Key 상수들 - Role별로 분리

// Seeker 관련 Query Keys
export const SEEKER_QUERY_KEYS = {
  JOB_DETAIL: (postId: string) => ["seeker-job-detail", postId] as const,
  LATEST_JOBS: (filters?: any, limit?: number) => ["seeker-latest-jobs", filters, limit] as const,
  LATEST_JOBS_INFINITE: (filters?: any) => ["seeker-latest-jobs-infinite", filters] as const,
  RECOMMENDED_JOBS: (filters?: any, limit?: number, page?: number) =>
    ["seeker-recommended-jobs", filters, limit, page] as const,
  RECOMMENDED_JOBS_INFINITE: (serializedFilters?: string, limit?: number) =>
    ["seeker-recommended-jobs-infinite", serializedFilters, limit] as const,
  APPLIED_JOBS: (limit?: number) => ["seeker-applied-jobs", limit] as const,
  BOOKMARKS: (limit?: number) => ["seeker-bookmarks", limit] as const,
  PROFILES: ["seeker-profiles"] as const,
  MYPAGE_MAIN: ["seeker-mypage-main"] as const,
} as const;

// Employer 관련 Query Keys
export const EMPLOYER_QUERY_KEYS = {
  DASHBOARD: ["employer-dashboard"] as const,
  ACTIVE_JOB_POSTS: ["employer-active-job-posts"] as const,
  DRAFT_JOB_POSTS: ["employer-draft-job-posts"] as const,
  JOB_DETAIL: (postId: string) => ["employer-job-detail", postId] as const,
  APPLICANTS_LIST: (postId: string) => ["employer-applicants-list", postId] as const,
  APPLICANTS_DETAIL: (postId: string, appId: string) =>
    ["employer-applicants-detail", postId, appId] as const,
} as const;

// User 관련 Query Keys
export const USER_QUERY_KEYS = {
  INFO: ["user-info"] as const,
  PROFILE: ["user-profile"] as const,
} as const;

// Quiz 관련 Query Keys
export const QUIZ_QUERY_KEYS = {
  MY_PROFILE: ["quiz-my-profile"] as const,
  PERSONALITY_PROFILE: ["personality-profile"] as const,
} as const;

// Common Data 관련 Query Keys
export const COMMON_QUERY_KEYS = {
  SKILLS: ["common-skills"] as const,
  LOCATIONS: ["common-locations"] as const,
  JOB_TYPES: ["common-job-types"] as const,
  WORK_STYLES: ["common-work-styles"] as const,
} as const;
