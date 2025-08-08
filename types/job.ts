import { ApplicantStatus, JobStatus, WorkType } from "@/constants/enums";
import { WorkExperience, WorkStyle } from "@/types/profile";
import { Location } from "@/constants/location";

// API에서 반환되는 실제 채용 공고 정보
export interface JobPost {
  id: string;
  business_loc_id: string;
  user_id: string;
  title: string;
  job_type: string;
  deadline: string; // ISO date string
  work_schedule: string;
  wage: string;
  location: string;
  description: string;
  status: JobStatus;
  work_type: string; // API에서 추가되는 필드
  language_level?: string;
  created_at?: string;
  updated_at?: string;
  daysAgo?: number; // API에서 추가되는 필드
  applicantCount?: number; // API에서 추가되는 필드
  business_loc?: {
    logo_url?: string;
    name?: string;
  };
  requiredSkills?: Array<{
    id: number;
    name_ko: string;
    name_en: string;
    category_ko: string;
    category_en: string;
  }>;
  workStyles: Array<{
    id: number;
    name_ko: string;
    name_en: string;
  }>;
}

// 추천 API 응답 타입
export interface RecommendedJobPost {
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

export interface RecommendationResponse {
  user: {
    id: number;
    name: string;
    personalityProfile: number;
  };
  recommendations: RecommendedJobPost[];
  totalCount: number;
  searchParams: {
    limit: number;
    minScore: number;
    location?: string;
    jobType?: string;
  };
}

// 프론트엔드에서 사용하는 JobPost 타입 (기존 호환성 유지)
export interface JobPostCard {
  id: string;
  title: string;
  workType: WorkType;
  wage: string;
  location: Location;
  workSchedule: string;
  businessName: string;
  description: string;
  applicants: number;
  views: number;
  logoImage?: string;
  applicationStatus?: string; // 지원 상태 추가
  requiredSkills?: Array<{
    id: number;
    name_ko: string;
    name_en: string;
    category_ko: string;
    category_en: string;
  }>;
  daysAgo?: number;
}

export interface Applicant {
  application_id: number;
  profile_id: number;
  user_id: number;
  job_post_id: number;
  status: ApplicantStatus;
  created_at: string;
  name?: string;
  profile_image_url?: string;
  description?: string;
  applied_date?: string;
  experience?: string;
  workStyles?: WorkStyle[];
  work_experiences?: WorkExperience[];
}

// 채용 공고 정보 (관계 데이터 포함)
export interface JobPostWithRelations extends JobPost {
  business?: {
    id: string;
    name: string;
    // 기타 business 정보
  };
  applicants?: Applicant[];
  job_fit_types?: Array<{
    id: string;
    name: string;
  }>;
  skills?: Array<{
    id: string;
    name: string;
  }>;
}
export { ApplicantStatus };
