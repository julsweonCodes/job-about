import { Skill, WorkStyle } from "@/types/profile";
import { WorkType, LanguageLevel } from "@/constants/enums";
import { JobType } from "@/constants/jobTypes";
import { $Enums } from "@prisma/client";

export interface EmployerProfilePayload {
  name: string;
  phone_number: string;
  address: string;
  operating_start: string; // "08:00"
  operating_end: string; // "17:00"
  description?: string;

  logo_img: string;
  // 이미지 필드 (최대 5장까지 URL 저장)
  img_url1?: string;
  img_url2?: string;
  img_url3?: string;
  img_url4?: string;
  img_url5?: string;

  // 추가 필드 예시: supabase user_id 또는 외래키 등
  user_id: number;

  // created_at, updated_at은 백엔드에서 추가
}

export interface EmployerDashboardCnt {
  active_job_post_cnt: number;
  status_update_cnt: number;
  applicants_cnt: number;
}

export interface JobPostPayload {
  jobTitle: string;
  selectedJobType: JobType;
  deadline: string; // extract yyyymmdd from calendar
  workSchedule: string;
  requiredSkills: Skill[];
  requiredWorkStyles: WorkStyle[];
  wage: string;
  jobDescription: string;
  language_level: LanguageLevel;
  selectedWorkType: WorkType;
  useAI?: boolean;
}

export interface Dashboard {
  activeJobPostsCnt: number;
  allAppsCnt: number;
  needsUpdateCnt: number;
}

export interface JobPost {
  id: string;
  title: string;
  type: $Enums.WorkType | null;
  wage: string;
  location: string;
  businessName: string;
  description: string;
  applicants: number;
  views: number;
  needsUpdate: boolean;
  coverImage: string;
  strt_date: string;
  deadline_date: string;
}
