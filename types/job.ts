import { ApplicantStatus, JobStatus, WorkType, WorkPeriod } from "@/constants/enums";

// API에서 반환되는 실제 채용 공고 정보
export interface JobPost {
  id: string;
  business_loc_id: string;
  user_id: string;
  title: string;
  job_type: string;
  deadline: string; // ISO date string
  work_schedule: string;
  job_fit_type_id_1: string;
  job_fit_type_id_2?: string;
  job_fit_type_id_3?: string;
  skill_id_1: string;
  skill_id_2?: string;
  skill_id_3?: string;
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
  };
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
  };
  employer: {
    name: string;
  };
  workStyles: Array<{
    id: number;
    name_ko: string;
    name_en: string;
  }>;
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
  type: WorkType;
  wage: string;
  location: string;
  dateRange: string;
  businessName: string;
  description: string;
  applicants: number;
  views: number;
  logoImage?: string;
}

export interface WorkExperience {
  id: string;
  profile_id: string;
  company_name: string;
  job_type: string;
  start_year: number;
  start_month: number;
  work_period: WorkPeriod;
  work_type: WorkType;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface Applicant {
  id: string;
  user_id: string;
  job_post_id: string;
  status: ApplicantStatus;
  created_at: string;
  name?: string;
  profile_image_url?: string;
  description?: string;
  applied_date?: string;
  experience?: string;
  skills?: string[];
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
