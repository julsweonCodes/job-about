// Supabase에서 받아오는 유저 타입
export interface SupabaseUser {
  uid: string;
  email: string;
  displayName: string;
  description: string;
  user_metadata: {
    name?: string;
    picture?: string;
    [key: string]: any;
  };
  // 기타 필요한 필드 추가 가능
}

export interface UpdateUser {
  name?: string;
  phone_number?: string;
  description?: string;
  img_url?: string;
}

// 우리 서비스 DB 유저 타입
export interface AppUser {
  id: string; // DB PK
  user_id: string; // supabase id (FK)
  name: string;
  email: string;
  img_url?: string | null;
  role?: UserRole | null;
  personality_profile_id?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

// user role 정의 
export enum UserRole {
  APPLICANT = "applicant",
  EMPLOYER = "employer",
}