import { ApplicantStatus, JobStatus, WorkType, WorkPeriod } from "@/constants/enums";

// 채용 공고 정보
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
  created_at?: string;
  updated_at?: string;
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

