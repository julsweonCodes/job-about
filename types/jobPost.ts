import { JobStatus, LanguageLevel, WorkType } from "@/constants/enums";
import { JobType } from "@/constants/jobTypes";
import { getLocationDisplayName, Location } from "@/constants/location";
import { Skill, WorkStyle } from "@/types/profile";
import { fromPrismaWorkType, fromPrismaJobType, fromPrismaLocation } from "@/types/enumMapper";
import { JobPostCard as JobPostCardType } from "@/types/job";
import { STORAGE_URLS } from "@/constants/storage";
import {
  JobType as JobTypeEnum,
  LanguageLevel as LanguageLevelEnum,
  JobStatus as JobStatusEnum,
  Location as LocationEnum,
  WorkType as WorkTypeEnum,
  ApplicationStatus,
} from "@prisma/client";

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
  applicationStatus?: string; // 지원 상태 추가
}

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

// 공통 Job Post API 응답 타입 (모든 API에서 사용)
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
  business_loc?: {
    logo_url?: string;
    location?: string;
    name?: string;
  };
  requiredSkills?: Array<{
    id: number;
    name_ko: string;
    name_en: string;
    category_ko: string;
    category_en: string;
  }>;
  applicationStatus?: string; // 지원 상태 (Applied Jobs에서만 사용)
}

// 새로운 API 응답 구조 (apiGetData가 반환하는 data 필드)
export interface ApiJobPostsResponse {
  items: ApiJobPost[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Applied Jobs API 응답 타입 (ApiJobPost와 동일하지만 applicationStatus 포함)
export interface ApiAppliedJobResponse extends ApiJobPost {
  applicationStatus: string; // Applied Jobs에서만 사용
}

// Bookmarked Jobs API 응답 타입 (ApiJobPost와 동일)
export interface ApiBookmarkedJobResponse extends ApiJobPost {}

// Recommended Jobs API 응답 타입
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
  workStyles: Array<{
    id: number;
    name_ko: string;
    name_en: string;
  }>;
  requiredSkills: Array<{
    id: number;
    name_ko: string;
    name_en: string;
    category_ko: string;
    category_en: string;
  }>;
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

// Job Post Detail API의 data 필드 타입
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
  jobType: string;
  languageLevel: string;
  requiredWorkStyles: Array<{
    id: number;
    name_ko: string;
    name_en: string;
  }>;
  requiredSkills: Array<{
    id: number;
    category_ko: string;
    category_en: string;
    name_ko: string;
    name_en: string;
  }>;
  workSchedule: string;
  workType: string;
  status: string;
  title: string;
  isBookmarked: boolean;
}

// Mapper 클래스
export class JobPostMapper {
  /**
   * Job Post API 응답을 JobPostData로 변환
   */
  static fromJobPost(apiJobPost: ApiJobPost): JobPostData {
    try {
      return {
        id: apiJobPost.id,
        title: apiJobPost.title,
        workType: fromPrismaWorkType(apiJobPost.work_type),
        jobType: fromPrismaJobType(apiJobPost.job_type),
        status: apiJobPost.status,
        businessLocInfo: this.mapJobPostBusinessLocInfo(apiJobPost.business_loc),
        deadline: apiJobPost.deadline,
        workSchedule: apiJobPost.work_schedule,
        requiredSkills: this.mapRequiredSkills(apiJobPost.requiredSkills),
        requiredWorkStyles: [], // API에서 제공되지 않는 경우 빈 배열
        languageLevel: apiJobPost.language_level as LanguageLevel,
        hourlyWage: apiJobPost.wage,
        jobDescription: apiJobPost.description,
        applicantCount: apiJobPost.applicantCount,
        daysAgo: apiJobPost.daysAgo,
      };
    } catch (error) {
      console.error("Error mapping LatestJobPost to JobPostData:", error);
      throw new Error("Failed to map latest job post data");
    }
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
    try {
      return {
        id: apiJobPost.id.toString(),
        title: apiJobPost.title,
        workType: fromPrismaWorkType(apiJobPost.workType),
        jobType: fromPrismaJobType(apiJobPost.jobType),
        status: "PUBLISHED" as JobStatus, // Recommended jobs는 항상 published
        businessLocInfo: this.mapRecommendedJobBusinessLocInfo(apiJobPost.company),
        deadline: apiJobPost.deadline,
        workSchedule: apiJobPost.workSchedule,
        requiredSkills: this.mapRequiredSkills(apiJobPost.requiredSkills),
        requiredWorkStyles: this.mapWorkStyles(apiJobPost.workStyles),
        languageLevel: "INTERMEDIATE" as LanguageLevel, // 기본값
        hourlyWage: apiJobPost.wage,
        jobDescription: apiJobPost.description,
        applicantCount: apiJobPost.applicantCount,
      };
    } catch (error) {
      console.error("Error mapping RecommendedJobPost to JobPostData:", error);
      throw new Error("Failed to map recommended job post data");
    }
  }

  /**
   * Job Post Detail API의 data를 JobPostData로 변환
   */
  static fromDetailJobPost(apiJobPost: ApiJobPostDetailData): JobPostData {
    try {
      return {
        id: apiJobPost.id,
        title: apiJobPost.title,
        workType: fromPrismaWorkType(apiJobPost.workType),
        jobType: fromPrismaJobType(apiJobPost.jobType),
        status: apiJobPost.status as JobStatus,
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
        requiredSkills: this.mapRequiredSkills(apiJobPost.requiredSkills),
        requiredWorkStyles: this.mapWorkStyles(apiJobPost.requiredWorkStyles),
        languageLevel: apiJobPost.languageLevel as LanguageLevel,
        hourlyWage: apiJobPost.hourlyWage,
        jobDescription: apiJobPost.jobDescription,
        isBookmarked: apiJobPost.isBookmarked,
      };
    } catch (error) {
      console.error("Error mapping DetailJobPost to JobPostData:", error);
      throw new Error("Failed to map detail job post data");
    }
  }

  /**
   * Job Post Business Location 정보 매핑
   */
  private static mapJobPostBusinessLocInfo(businessLoc?: ApiJobPost["business_loc"]): BizLocInfo {
    if (!businessLoc) {
      throw new Error("Business location information is required");
    }

    return {
      bizLocId: "unknown", // Latest jobs에는 business_loc_id가 없음
      name: businessLoc.name || "Unknown Company",
      bizDescription: "",
      logoImg: businessLoc.logo_url || "",
      extraPhotos: [],
      location: fromPrismaLocation(businessLoc.location as Location) || Location.TORONTO,
      address: "",
      workingHours: "",
    };
  }

  /**
   * Recommended Jobs Company 정보 매핑
   */
  private static mapRecommendedJobBusinessLocInfo(
    company: ApiRecommendedJobPost["company"]
  ): BizLocInfo {
    return {
      bizLocId: "unknown", // Recommended jobs에는 business_loc_id가 없음
      name: company.name,
      bizDescription: "",
      logoImg: company.logoUrl || "",
      extraPhotos: [],
      location: "VANCOUVER" as Location, // 기본값
      address: company.address,
      workingHours: "",
    };
  }

  /**
   * Required Skills 매핑
   */
  private static mapRequiredSkills(requiredSkills?: any[]): Skill[] {
    if (!requiredSkills || !Array.isArray(requiredSkills)) {
      return [];
    }

    return requiredSkills.map((skill) => ({
      id: skill.id,
      name_ko: skill.name_ko,
      name_en: skill.name_en,
      category_ko: skill.category_ko,
      category_en: skill.category_en,
    }));
  }

  /**
   * Work Styles 매핑
   */
  private static mapWorkStyles(
    workStyles?: Array<{
      id: number;
      name_ko: string;
      name_en: string;
    }>
  ): WorkStyle[] {
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

  /**
   * JobPostData를 JobPostCard 타입으로 변환
   */
  static convertJobPostDataToCard(jobPost: JobPostData): JobPostCardType {
    return {
      id: jobPost.id,
      title: jobPost.title,
      workType: jobPost.workType || ("on-site" as WorkType),
      wage: jobPost.hourlyWage,
      location:
        getLocationDisplayName(jobPost.businessLocInfo.location) || "Location not specified",
      workSchedule: jobPost.workSchedule,
      businessName: jobPost.businessLocInfo.name,
      description: jobPost.jobDescription,
      applicants: jobPost.applicantCount || 0,
      views: 0, // 기본값
      logoImage: jobPost.businessLocInfo.logoImg
        ? `${STORAGE_URLS.BIZ_LOC.PHOTO}${jobPost.businessLocInfo.logoImg}`
        : undefined,
      requiredSkills: jobPost.requiredSkills,
      applicationStatus: jobPost.applicationStatus as any, // 지원 상태 추가
      daysAgo: jobPost.daysAgo,
    };
  }

  /**
   * RecommendedJobPost를 JobPostCard 타입으로 변환
   */
  static convertRecommendedToJobPostCard(recommendedJob: ApiRecommendedJobPost): JobPostCardType {
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
      views: 0,
      logoImage: recommendedJob.company.logoUrl
        ? `${STORAGE_URLS.BIZ_LOC.PHOTO}${recommendedJob.company.logoUrl}`
        : undefined,
      requiredSkills: recommendedJob.requiredSkills, // required skills 추가
    };
  }
}

/*JobPost API 공통 응답*/
export type PaginatedJobPostResponse = {
  items: JobPostItem[];
  pagination: Pagination;
};

export type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type JobPostItem = {
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
};

type SkillType = {
  id: number;
  name_ko: string;
  name_en: string;
  category_ko: string;
  category_en: string;
};
