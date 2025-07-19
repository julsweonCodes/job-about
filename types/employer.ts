export interface EmployerProfilePayload {
  name: string;
  phone_number: string;
  address: string;
  operating_start: string; // "08:00"
  operating_end: string;   // "17:00"
  description?: string;
  language_level: "BEGINNER" | "INTERMEDIATE" | "FLUENT";

  logo_img: string;
  // 이미지 필드 (최대 5장까지 URL 저장)
  img_url1?: string;
  img_url2?: string;
  img_url3?: string;
  img_url4?: string;
  img_url5?: string;

  // 추가 필드 예시: supabase user_id 또는 외래키 등
  user_id : number;

  // created_at, updated_at은 백엔드에서 추가
}

export interface EmployerDashboardCnt {
  active_job_post_cnt: number;
  status_update_cnt: number;
  applicants_cnt: number;
}

export interface JobPostPayload {
  jobTitle: string;
  jobType: string;
  deadline: string; // extract yyyymmdd from calendar
  workSchedule: string;
  requiredSkills: string;
  requiredPersonality: string;
  wage: string;
  location: string; // 이거 수정?
  jobDescription?: string;
  language_level: "BEGINNER" | "INTERMEDIATE" | "FLUENT";
}