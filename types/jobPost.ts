import { JobStatus, LanguageLevel, WorkType } from "@/constants/enums";
import { JobType } from "@/constants/jobTypes";
import { Location } from "@/constants/location";
import { Skill, WorkStyle } from "@/types/profile";
import { fromPrismaWorkType } from "@/types/enumMapper";

export interface JobPostData {
  id: string;
  title: string;
  workType?: WorkType;
  jobType: JobType;
  status: JobStatus;
  businessLocInfo: BizLocInfo;
  deadline: string;
  schedule: string;
  requiredSkills: Skill[];
  requiredWorkStyles: WorkStyle[];
  languageLevel?: LanguageLevel;
  hourlyWage: string;
  jobDescription: string;
  isBookmarked?: boolean;
  applicantCount?: number;
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

// Latest Jobs API 응답 타입 (직접 JobPost 배열)
export interface ApiLatestJobPost {
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
  };
  requiredSkills?: Array<{
    id: number;
    name_ko: string;
    name_en: string;
    category_ko: string;
    category_en: string;
  }>;
}

// 공통 Job Post 타입 (Applied와 Bookmarked에서 공통으로 사용)
export interface ApiJobPostWithBusinessLoc {
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
    id: string;
    name: string;
    description: string;
    logo_url?: string;
    address: string;
    operating_start: string;
    operating_end: string;
    location: string;
  };
  requiredSkills?: Array<{
    id: number;
    name_ko: string;
    name_en: string;
    category_ko: string;
    category_en: string;
  }>;
  _count?: {
    applications: number;
  };
}

// Applied Jobs API 응답 타입
export interface ApiAppliedJobResponse {
  id: string;
  job_post_id: string;
  profile_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  job_post: ApiJobPostWithBusinessLoc;
}

// Bookmarked Jobs API 응답 타입
export interface ApiBookmarkedJobResponse {
  id: string;
  user_id: string;
  job_post_id: string;
  job_post: ApiJobPostWithBusinessLoc;
}

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
  totalCount: number;
  searchParams: {
    limit: number;
    minScore: number;
    location?: string;
    jobType?: string;
  };
}

export interface ApiRecommendedJobPost {
  id: number;
  title: string;
  jobType: string;
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

// Mapper 클래스
export class JobPostMapper {
  /**
   * Latest Jobs API 응답을 JobPostData로 변환
   */
  static fromLatestJobPost(apiJobPost: ApiLatestJobPost): JobPostData {
    try {
      return {
        id: apiJobPost.id,
        title: apiJobPost.title,
        workType: fromPrismaWorkType(apiJobPost.work_type),
        jobType: apiJobPost.job_type as JobType,
        status: apiJobPost.status,
        businessLocInfo: this.mapLatestJobBusinessLocInfo(apiJobPost.business_loc),
        deadline: apiJobPost.deadline,
        schedule: apiJobPost.work_schedule,
        requiredSkills: this.mapRequiredSkills(apiJobPost.requiredSkills),
        requiredWorkStyles: [], // API에서 제공되지 않는 경우 빈 배열
        languageLevel: apiJobPost.language_level as LanguageLevel,
        hourlyWage: apiJobPost.wage,
        jobDescription: apiJobPost.description,
        applicantCount: apiJobPost.applicantCount,
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
    if (!response?.job_post) {
      throw new Error("Invalid applied job response structure");
    }
    return this.fromAppliedJobPost(response.job_post);
  }

  /**
   * Applied Job Post를 JobPostData로 변환
   */
  static fromAppliedJobPost(apiJobPost: ApiJobPostWithBusinessLoc): JobPostData {
    try {
      return {
        id: apiJobPost.id,
        title: apiJobPost.title,
        workType: fromPrismaWorkType(apiJobPost.work_type),
        jobType: apiJobPost.job_type as JobType,
        status: apiJobPost.status,
        businessLocInfo: this.mapAppliedJobBusinessLocInfo(apiJobPost.business_loc),
        deadline: apiJobPost.deadline,
        schedule: apiJobPost.work_schedule,
        requiredSkills: this.mapRequiredSkills(apiJobPost.requiredSkills),
        requiredWorkStyles: [], // API에서 제공되지 않는 경우 빈 배열
        languageLevel: apiJobPost.language_level as LanguageLevel,
        hourlyWage: apiJobPost.wage,
        jobDescription: apiJobPost.description,
        applicantCount: apiJobPost.applicantCount || apiJobPost._count?.applications,
      };
    } catch (error) {
      console.error("Error mapping AppliedJobPost to JobPostData:", error);
      throw new Error("Failed to map applied job post data");
    }
  }

  /**
   * Bookmarked Job API 응답을 JobPostData로 변환
   */
  static fromBookmarkedJobResponse(response: ApiBookmarkedJobResponse): JobPostData {
    if (!response?.job_post) {
      throw new Error("Invalid bookmarked job response structure");
    }
    return this.fromBookmarkedJobPost(response.job_post);
  }

  /**
   * Bookmarked Job Post를 JobPostData로 변환
   */
  static fromBookmarkedJobPost(apiJobPost: ApiJobPostWithBusinessLoc): JobPostData {
    try {
      return {
        id: apiJobPost.id,
        title: apiJobPost.title,
        workType: fromPrismaWorkType(apiJobPost.work_type),
        jobType: apiJobPost.job_type as JobType,
        status: apiJobPost.status,
        businessLocInfo: this.mapBookmarkedJobBusinessLocInfo(apiJobPost.business_loc),
        deadline: apiJobPost.deadline,
        schedule: apiJobPost.work_schedule,
        requiredSkills: this.mapRequiredSkills(apiJobPost.requiredSkills),
        requiredWorkStyles: [], // API에서 제공되지 않는 경우 빈 배열
        languageLevel: apiJobPost.language_level as LanguageLevel,
        hourlyWage: apiJobPost.wage,
        jobDescription: apiJobPost.description,
        applicantCount: apiJobPost.applicantCount || apiJobPost._count?.applications,
      };
    } catch (error) {
      console.error("Error mapping BookmarkedJobPost to JobPostData:", error);
      throw new Error("Failed to map bookmarked job post data");
    }
  }

  /**
   * Recommended Job Post를 JobPostData로 변환
   */
  static fromRecommendedJobPost(apiJobPost: ApiRecommendedJobPost): JobPostData {
    try {
      return {
        id: apiJobPost.id.toString(),
        title: apiJobPost.title,
        workType: "on-site" as WorkType, // Recommended jobs에는 workType이 없으므로 기본값
        jobType: apiJobPost.jobType as JobType,
        status: "PUBLISHED" as JobStatus, // Recommended jobs는 항상 published
        businessLocInfo: this.mapRecommendedJobBusinessLocInfo(apiJobPost.company),
        deadline: apiJobPost.deadline,
        schedule: apiJobPost.workSchedule,
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
   * Latest Jobs Business Location 정보 매핑
   */
  private static mapLatestJobBusinessLocInfo(
    businessLoc?: ApiLatestJobPost["business_loc"]
  ): BizLocInfo {
    if (!businessLoc) {
      throw new Error("Business location information is required");
    }

    return {
      bizLocId: "unknown", // Latest jobs에는 business_loc_id가 없음
      name: "Unknown Company", // 기본값
      bizDescription: "",
      logoImg: businessLoc.logo_url || "",
      extraPhotos: [],
      location: "VANCOUVER" as Location, // 기본값
      address: "",
      workingHours: "",
    };
  }

  /**
   * Applied Jobs Business Location 정보 매핑
   */
  private static mapAppliedJobBusinessLocInfo(
    businessLoc?: ApiJobPostWithBusinessLoc["business_loc"]
  ): BizLocInfo {
    if (!businessLoc) {
      throw new Error("Business location information is required");
    }

    return {
      bizLocId: businessLoc.id,
      name: businessLoc.name,
      bizDescription: businessLoc.description,
      logoImg: businessLoc.logo_url || "",
      extraPhotos: [], // API에서 제공되지 않는 경우 빈 배열
      location: businessLoc.location as Location,
      address: businessLoc.address,
      workingHours: `${businessLoc.operating_start} - ${businessLoc.operating_end}`,
    };
  }

  /**
   * Bookmarked Jobs Business Location 정보 매핑
   */
  private static mapBookmarkedJobBusinessLocInfo(
    businessLoc?: ApiJobPostWithBusinessLoc["business_loc"]
  ): BizLocInfo {
    if (!businessLoc) {
      throw new Error("Business location information is required");
    }

    return {
      bizLocId: businessLoc.id,
      name: businessLoc.name,
      bizDescription: businessLoc.description,
      logoImg: businessLoc.logo_url || "",
      extraPhotos: [], // API에서 제공되지 않는 경우 빈 배열
      location: businessLoc.location as Location,
      address: businessLoc.address,
      workingHours: `${businessLoc.operating_start} - ${businessLoc.operating_end}`,
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
   * Work Styles 매핑 (Recommended jobs용)
   */
  private static mapWorkStyles(workStyles?: ApiRecommendedJobPost["workStyles"]): WorkStyle[] {
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
  static fromLatestJobPostArray(apiJobPosts: ApiLatestJobPost[]): JobPostData[] {
    return apiJobPosts.map((jobPost) => this.fromLatestJobPost(jobPost));
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
