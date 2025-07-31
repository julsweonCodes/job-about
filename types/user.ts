export interface ProfileStatus {
  hasRole: boolean;
  isProfileCompleted: boolean;
  role: "APPLICANT" | "EMPLOYER" | null;
  hasPersonalityProfile: boolean;
  hasApplicantProfile: boolean;
}

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
  phone_number?: string;
  description?: string;
}

// user role 정의
export enum UserRole {
  APPLICANT = "applicant",
  EMPLOYER = "employer",
}

// Supabase User 매퍼 클래스
export class SupabaseUserMapper {
  /**
   * Supabase User 객체를 SupabaseUser 타입으로 변환
   */
  static fromSupabaseUser(user: any): SupabaseUser {
    return {
      uid: user.id,
      email: user.email || "",
      displayName:
        user.user_metadata?.name || user.user_metadata?.full_name || user.displayName || "",
      description: user.user_metadata?.description || "",
      user_metadata: user.user_metadata || {},
    };
  }

  /**
   * 사용자 표시 이름 가져오기
   */
  static getDisplayName(user: any): string {
    if (!user) return "";
    return user.user_metadata?.name || user.user_metadata?.full_name || user.displayName || "";
  }

  /**
   * 사용자 아바타 URL 가져오기
   */
  static getAvatarUrl(user: any): string | null {
    if (!user) return null;
    return user.user_metadata?.picture || user.user_metadata?.avatar_url || null;
  }

  /**
   * 사용자 이메일 가져오기
   */
  static getEmail(user: any): string {
    return user?.email || "";
  }

  /**
   * 사용자 메타데이터에서 특정 값 가져오기
   */
  static getMetadataValue(user: any, key: string): any {
    if (!user) return null;
    return user.user_metadata?.[key] || null;
  }
}
