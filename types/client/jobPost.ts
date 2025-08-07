import { JobStatus, LanguageLevel, WorkType, ApplicantStatus } from "@/constants/enums";
import { JobType } from "@/constants/jobTypes";
import { getLocationDisplayName, Location } from "@/constants/location";
import { Skill, WorkStyle } from "@/types/profile";
import {
  fromPrismaWorkType,
  fromPrismaJobType,
  fromPrismaLocation,
  fromPrismaAppStatus,
} from "@/types/enumMapper";
import { JobPostCard as JobPostCardType } from "@/types/job";
import { STORAGE_URLS } from "@/constants/storage";

// ============================================================================
// CLIENT TYPES - 클라이언트 전용 타입 정의
// ============================================================================

/**
 * 프론트엔드에서 사용하는 통합 Job Post 데이터 타입
 */
export interface JobPostData {
  id: string;
  title: string;
  workType?: WorkType;
  jobType: JobType;
  status: JobStatus;
  businessLocInfo: BizLocInfo;
  deadline: string;
  workSchedule: string;
  requiredSkills: Skill[];
  requiredWorkStyles: WorkStyle[];
  languageLevel?: LanguageLevel;
  hourlyWage: string;
  jobDescription: string;
  isBookmarked?: boolean;
  applicantCount?: number;
  daysAgo?: number;
  applicationStatus?: ApplicantStatus;
}

/**
 * 비즈니스 위치 정보
 */
export interface BizLocInfo {
  bizLocId: string;
  name: string;
  bizDescription: string;
  logoImg: string;
  extraPhotos: string[];
  location: Location;
  address: string;
  workingHours: string;
}

/**
 * 공통 스킬 타입
 */
export interface SkillType {
  id: number;
  name_ko: string;
  name_en: string;
  category_ko: string;
  category_en: string;
}

/**
 * 공통 워크스타일 타입
 */
export interface WorkStyleType {
  id: number;
  name_ko: string;
  name_en: string;
}

/**
 * 공통 비즈니스 위치 타입
 */
export interface BusinessLocationType {
  logo_url?: string | null;
  location?: string;
  name?: string;
}

// ============================================================================
// API RESPONSE TYPES - API 응답 타입들
// ============================================================================

/**
 * 공통 Job Post API 응답 타입
 */
export interface ApiJobPost {
  id: string;
  business_loc_id: string;
  user_id: string;
  title: string;
  job_type: string;
  deadline: string;
  work_schedule: string;
  wage: string;
  description: string;
  status: JobStatus;
  work_type: string;
  language_level?: string;
  created_at?: string;
  updated_at?: string;
  daysAgo?: number;
  applicantCount?: number;
  business_loc?: BusinessLocationType;
  requiredSkills?: SkillType[];
  applicationStatus?: ApplicantStatus;
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
export interface ApiJobPostsResponse {
  items: ApiJobPost[];
  pagination: Pagination;
}

/**
 * Applied Jobs API 응답 타입
 */
export interface ApiAppliedJobResponse extends ApiJobPost {
  applicationStatus: ApplicantStatus;
}

/**
 * Bookmarked Jobs API 응답 타입
 */
export interface ApiBookmarkedJobResponse extends ApiJobPost {}

/**
 * Recommended Jobs API 응답 타입
 */
export interface ApiRecommendedJobResponse {
  user: {
    id: number;
    name: string;
    personalityProfile: {
      id: string;
      name_ko: string;
      name_en: string;
    };
  };
  recommendations: ApiRecommendedJobPost[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
  searchParams: {
    limit: number;
    page: number;
    minScore: number;
    location?: string;
    jobType?: string;
    workType?: string;
  };
}

/**
 * Recommended Job Post 타입
 */
export interface ApiRecommendedJobPost {
  id: number;
  title: string;
  jobType: string;
  workType: string;
  wage: string;
  workSchedule: string;
  description: string;
  deadline: string;
  company: {
    name: string;
    address: string;
    logoUrl?: string;
  };
  employer: {
    name: string;
  };
  workStyles: WorkStyleType[];
  requiredSkills: SkillType[];
  applicantCount: number;
  matchScore: number;
  compatibility: {
    level: string;
    percentage: number;
    description: string;
    color: string;
  };
  createdAt: string;
}

/**
 * Job Post Detail API 응답 타입
 */
export interface ApiJobPostDetailData {
  businessLocInfo: {
    bizDescription: string;
    bizLocId: string;
    address: string;
    location: string;
    name: string;
    logoImg: string;
    extraPhotos: string[];
    workingHours: string;
  };
  deadline: string;
  jobDescription: string;
  hourlyWage: string;
  id: string;
  jobType: JobType;
  languageLevel: string;
  requiredWorkStyles: WorkStyleType[];
  requiredSkills: SkillType[];
  workSchedule: string;
  workType: WorkType;
  status: JobStatus;
  title: string;
  isBookmarked: boolean;
}

// ============================================================================
// CONSTANTS - 상수 정의
// ============================================================================

const DEFAULT_VALUES = {
  BIZ_LOC_ID: "unknown",
  COMPANY_NAME: "Unknown Company",
  LOCATION: Location.TORONTO,
  WORK_TYPE: "on-site" as WorkType,
  LANGUAGE_LEVEL: "INTERMEDIATE" as LanguageLevel,
  STATUS: "PUBLISHED" as JobStatus,
  VIEWS: 0,
} as const;

// ============================================================================
// UTILITY FUNCTIONS - 유틸리티 함수들
// ============================================================================

/**
 * 스킬 배열을 안전하게 매핑
 */
function mapSkills(skills?: SkillType[]): Skill[] {
  if (!skills || !Array.isArray(skills)) {
    return [];
  }

  return skills.map((skill) => ({
    id: skill.id,
    name_ko: skill.name_ko,
    name_en: skill.name_en,
    category_ko: skill.category_ko,
    category_en: skill.category_en,
  }));
}

/**
 * 워크스타일 배열을 안전하게 매핑
 */
function mapWorkStyles(workStyles?: WorkStyleType[]): WorkStyle[] {
  if (!workStyles || !Array.isArray(workStyles)) {
    return [];
  }

  return workStyles.map((style) => ({
    id: style.id,
    name_ko: style.name_ko,
    name_en: style.name_en,
  }));
}

/**
 * 비즈니스 위치 정보를 안전하게 매핑
 */
function mapBusinessLocation(
  businessLoc?: BusinessLocationType,
  defaultLocation: Location = DEFAULT_VALUES.LOCATION
): BizLocInfo {
  return {
    bizLocId: DEFAULT_VALUES.BIZ_LOC_ID,
    name: businessLoc?.name || DEFAULT_VALUES.COMPANY_NAME,
    bizDescription: "",
    logoImg: businessLoc?.logo_url || "",
    extraPhotos: [],
    location: businessLoc?.location
      ? fromPrismaLocation(businessLoc.location as Location) || defaultLocation
      : defaultLocation,
    address: "",
    workingHours: "",
  };
}

/**
 * 에러를 안전하게 처리하는 래퍼 함수
 */
function safeTransform<T>(transformFn: () => T, errorMessage: string, fallback?: T): T {
  try {
    return transformFn();
  } catch (error) {
    console.error(`Error in ${errorMessage}:`, error);
    if (fallback !== undefined) {
      return fallback;
    }
    throw new Error(`Failed to ${errorMessage}`);
  }
}

// ============================================================================
// MAPPER CLASSES - 매퍼 클래스들
// ============================================================================

/**
 * Job Post 데이터 변환을 담당하는 메인 매퍼
 */
export class JobPostMapper {
  /**
   * 공통 Job Post API 응답을 JobPostData로 변환
   */
  static fromJobPost(apiJobPost: ApiJobPost): JobPostData {
    return safeTransform(
      () => ({
        id: apiJobPost.id,
        title: apiJobPost.title,
        workType: fromPrismaWorkType(apiJobPost.work_type),
        jobType: fromPrismaJobType(apiJobPost.job_type),
        status: apiJobPost.status,
        businessLocInfo: mapBusinessLocation(apiJobPost.business_loc),
        deadline: apiJobPost.deadline,
        workSchedule: apiJobPost.work_schedule,
        requiredSkills: mapSkills(apiJobPost.requiredSkills),
        requiredWorkStyles: [], // API에서 제공되지 않는 경우 빈 배열
        languageLevel: apiJobPost.language_level as LanguageLevel,
        hourlyWage: apiJobPost.wage,
        jobDescription: apiJobPost.description,
        applicantCount: apiJobPost.applicantCount,
        daysAgo: apiJobPost.daysAgo,
        applicationStatus: apiJobPost.applicationStatus
          ? fromPrismaAppStatus(apiJobPost.applicationStatus)
          : undefined,
      }),
      "map job post data"
    );
  }

  /**
   * Applied Job API 응답을 JobPostData로 변환
   */
  static fromAppliedJobResponse(response: ApiAppliedJobResponse): JobPostData {
    if (!response) {
      throw new Error("Invalid applied job response structure");
    }
    return this.fromJobPost(response);
  }

  /**
   * Bookmarked Job API 응답을 JobPostData로 변환
   */
  static fromBookmarkedJobResponse(response: ApiBookmarkedJobResponse): JobPostData {
    if (!response) {
      throw new Error("Invalid bookmarked job response structure");
    }
    return this.fromJobPost(response);
  }

  /**
   * Recommended Job Post를 JobPostData로 변환
   */
  static fromRecommendedJobPost(apiJobPost: ApiRecommendedJobPost): JobPostData {
    return safeTransform(
      () => ({
        id: apiJobPost.id.toString(),
        title: apiJobPost.title,
        workType: fromPrismaWorkType(apiJobPost.workType),
        jobType: fromPrismaJobType(apiJobPost.jobType),
        status: DEFAULT_VALUES.STATUS,
        businessLocInfo: {
          bizLocId: DEFAULT_VALUES.BIZ_LOC_ID,
          name: apiJobPost.company.name,
          bizDescription: "",
          logoImg: apiJobPost.company.logoUrl || "",
          extraPhotos: [],
          location: Location.TORONTO, // 기본값
          address: apiJobPost.company.address,
          workingHours: "",
        },
        deadline: apiJobPost.deadline,
        workSchedule: apiJobPost.workSchedule,
        requiredSkills: mapSkills(apiJobPost.requiredSkills),
        requiredWorkStyles: mapWorkStyles(apiJobPost.workStyles),
        languageLevel: DEFAULT_VALUES.LANGUAGE_LEVEL,
        hourlyWage: apiJobPost.wage,
        jobDescription: apiJobPost.description,
        applicantCount: apiJobPost.applicantCount,
      }),
      "map recommended job post data"
    );
  }

  /**
   * Job Post Detail API의 data를 JobPostData로 변환
   */
  static fromDetailJobPost(apiJobPost: ApiJobPostDetailData): JobPostData {
    return safeTransform(
      () => ({
        id: apiJobPost.id,
        title: apiJobPost.title,
        workType: apiJobPost.workType,
        jobType: apiJobPost.jobType,
        status: apiJobPost.status,
        businessLocInfo: {
          bizLocId: apiJobPost.businessLocInfo.bizLocId,
          name: apiJobPost.businessLocInfo.name,
          bizDescription: apiJobPost.businessLocInfo.bizDescription,
          logoImg: apiJobPost.businessLocInfo.logoImg,
          extraPhotos: apiJobPost.businessLocInfo.extraPhotos,
          location: apiJobPost.businessLocInfo.location as Location,
          address: apiJobPost.businessLocInfo.address,
          workingHours: apiJobPost.businessLocInfo.workingHours,
        },
        deadline: apiJobPost.deadline,
        workSchedule: apiJobPost.workSchedule,
        requiredSkills: mapSkills(apiJobPost.requiredSkills),
        requiredWorkStyles: mapWorkStyles(apiJobPost.requiredWorkStyles),
        languageLevel: apiJobPost.languageLevel as LanguageLevel,
        hourlyWage: apiJobPost.hourlyWage,
        jobDescription: apiJobPost.jobDescription,
        isBookmarked: apiJobPost.isBookmarked,
      }),
      "map detail job post data"
    );
  }

  /**
   * 배열 형태의 API 응답을 JobPostData 배열로 변환
   */
  static fromJobPostArray(apiJobPosts: ApiJobPost[]): JobPostData[] {
    return apiJobPosts.map((jobPost) => this.fromJobPost(jobPost));
  }

  /**
   * 새로운 API 응답 구조를 JobPostData 배열로 변환
   */
  static fromApiJobPostsResponse(response: ApiJobPostsResponse): JobPostData[] {
    if (!response?.items) {
      return [];
    }
    return this.fromJobPostArray(response.items);
  }

  static fromAppliedJobResponseArray(responses: ApiAppliedJobResponse[]): JobPostData[] {
    return responses.map((response) => this.fromAppliedJobResponse(response));
  }

  static fromBookmarkedJobResponseArray(responses: ApiBookmarkedJobResponse[]): JobPostData[] {
    return responses.map((response) => this.fromBookmarkedJobResponse(response));
  }

  static fromRecommendedJobPostArray(responses: ApiRecommendedJobPost[]): JobPostData[] {
    return responses.map((jobPost) => this.fromRecommendedJobPost(jobPost));
  }
}

/**
 * Job Post Card 변환을 담당하는 매퍼
 */
export class JobPostCardMapper {
  /**
   * JobPostData를 JobPostCard 타입으로 변환
   */
  static fromJobPostData(jobPost: JobPostData): JobPostCardType {
    return {
      id: jobPost.id,
      title: jobPost.title,
      workType: jobPost.workType || DEFAULT_VALUES.WORK_TYPE,
      wage: jobPost.hourlyWage,
      // TODO 나중에 바꾸기 
      location:
        getLocationDisplayName(jobPost.businessLocInfo.location) || "Location not specified",
      workSchedule: jobPost.workSchedule,
      businessName: jobPost.businessLocInfo.name,
      description: jobPost.jobDescription,
      applicants: jobPost.applicantCount || 0,
      views: DEFAULT_VALUES.VIEWS,
      logoImage: jobPost.businessLocInfo.logoImg
        ? `${STORAGE_URLS.BIZ_LOC.PHOTO}${jobPost.businessLocInfo.logoImg}`
        : undefined,
      requiredSkills: jobPost.requiredSkills,
      applicationStatus: jobPost.applicationStatus,
      daysAgo: jobPost.daysAgo,
    };
  }

  /**
   * RecommendedJobPost를 JobPostCard 타입으로 변환
   */
  static fromRecommendedJobPost(recommendedJob: ApiRecommendedJobPost): JobPostCardType {
    return {
      id: recommendedJob.id.toString(),
      title: recommendedJob.title,
      workType: fromPrismaWorkType(recommendedJob.workType),
      wage: recommendedJob.wage,
      location: recommendedJob.company.address,
      workSchedule: recommendedJob.workSchedule,
      businessName: recommendedJob.company.name,
      description: recommendedJob.description,
      applicants: recommendedJob.applicantCount,
      views: DEFAULT_VALUES.VIEWS,
      logoImage: recommendedJob.company.logoUrl
        ? `${STORAGE_URLS.BIZ_LOC.PHOTO}${recommendedJob.company.logoUrl}`
        : undefined,
      requiredSkills: recommendedJob.requiredSkills,
    };
  }
}
