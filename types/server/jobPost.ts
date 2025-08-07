import {
  JobType as JobTypeEnum,
  LanguageLevel as LanguageLevelEnum,
  JobStatus as JobStatusEnum,
  Location as LocationEnum,
  WorkType as WorkTypeEnum,
  ApplicationStatus,
} from "@prisma/client";

// ============================================================================
// SERVER TYPES - 서버 전용 타입 정의
// ============================================================================

/**
 * 서버에서 사용하는 Job Post 아이템 타입
 */
export interface JobPostItem {
  id: string;
  business_loc_id: string;
  user_id: string;
  title: string;
  job_type: JobTypeEnum;
  deadline: string;
  work_schedule: string;
  wage: string;
  description: string;
  status: JobStatusEnum;
  created_at: string;
  deleted_at: string | null;
  updated_at: string;
  work_type: WorkTypeEnum | null;
  language_level: LanguageLevelEnum | null;
  business_loc: {
    logo_url: string | null;
    location: LocationEnum;
    name: string;
  };
  daysAgo: number;
  applicantCount: number;
  requiredSkills: SkillType[];
  applicationStatus?: ApplicationStatus;
}

/**
 * 스킬 타입
 */
export interface SkillType {
  id: number;
  name_ko: string;
  name_en: string;
  category_ko: string;
  category_en: string;
}

/**
 * 페이지네이션 정보
 */
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * 페이지네이션된 Job Post 응답
 */
export interface PaginatedJobPostResponse {
  items: JobPostItem[];
  pagination: Pagination;
}
