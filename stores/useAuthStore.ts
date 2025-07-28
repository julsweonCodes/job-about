import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { AppUser, ProfileStatus, SupabaseUser } from "@/types/user";
import { SupabaseUserMapper } from "@/types/user";

// 역할별 데이터 타입
interface SeekerData {
  // 구직자 관련 데이터 (마이 페이지)
  applicantProfile?: {
    job_type1: string;
    job_type2?: string;
    job_type3?: string;
    work_type: string;
    available_day: string;
    available_hour: string;
    location: string;
    language_level: string;
    description: string;
    profile_practical_skills: Array<{ practical_skill_id: number }>;
    work_experiences: Array<{
      company_name: string;
      job_type: string;
      start_date: Date;
      end_date: Date;
      work_type: string;
      description: string;
    }>;
  };
  personalityProfileId?: number;
  skills?: Array<{
    id: number;
    category_ko: string;
    category_en: string;
    name_ko: string;
    name_en: string;
  }>;
  workStyles?: Array<{
    id: number;
    name_ko: string;
    name_en: string;
  }>;
}

interface EmployerData {
  // 구인자 관련 데이터 (마이 페이지)
  employerProfile?: {
    name: string;
    phone_number: string;
    address: string;
    operating_start: string;
    operating_end: string;
    description?: string;
    logo_img: string;
    img_url1?: string;
    img_url2?: string;
    img_url3?: string;
    img_url4?: string;
    img_url5?: string;
    user_id: number;
  };
}

interface AuthState {
  // 기본 상태
  isLoggedIn: boolean;
  supabaseUser: SupabaseUser | null;
  appUser: AppUser | null;
  profileStatus: ProfileStatus | null;
  loginTried: boolean;
  isLoading: boolean;
  error: string | null; // 에러 상태 추가

  // 역할별 데이터
  seekerData: SeekerData | null;
  employerData: EmployerData | null;

  // 기본 액션
  setIsLoggedIn: (value: boolean) => void;
  setSupabaseUser: (user: SupabaseUser | null) => void;
  setAppUser: (appUser: AppUser | null) => void;
  setProfileStatus: (status: ProfileStatus | null) => void;
  setLoginTried: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setError: (error: string | null) => void; // 에러 액션 추가

  // 역할별 데이터 액션
  setSeekerData: (data: SeekerData | null) => void;
  setEmployerData: (data: EmployerData | null) => void;
  clearSeekerData: () => void;
  clearEmployerData: () => void;

  // 유틸리티 액션
  login: (supabaseUser: SupabaseUser, appUser: AppUser, profileStatus: ProfileStatus) => void;
  logout: () => void;
  updateProfileStatus: (updates: Partial<ProfileStatus>) => void;
  clearError: () => void; // 에러 클리어 액션

  // 셀렉터
  isEmployer: () => boolean;
  isApplicant: () => boolean;
  hasCompletedProfile: () => boolean;
  needsOnboarding: () => boolean;
  getUserDisplayName: () => string;
  getUserEmail: () => string;
  getUserProfileImageUrl: () => string | null;

  // 역할별 데이터 셀렉터
  getRoleSpecificData: () => SeekerData | EmployerData | null;

  // 유틸리티 셀렉터 (실무에서 자주 사용)
  hasError: () => boolean;
  isInitialized: () => boolean;
  canAccessRoleData: () => boolean;

  // 추가 유틸리티 셀렉터
  getSeekerData: () => SeekerData | null;
  getEmployerData: () => EmployerData | null;

  // 역할별 완성도 체크
  isSeekerProfileComplete: () => boolean;
  isEmployerProfileComplete: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // 초기 상태
        isLoggedIn: false,
        supabaseUser: null,
        appUser: null,
        profileStatus: null,
        loginTried: false,
        isLoading: false,
        error: null,
        seekerData: null,
        employerData: null,

        // 기본 액션
        setIsLoggedIn: (value) => set({ isLoggedIn: value }),
        setSupabaseUser: (user) => set({ supabaseUser: user }),
        setAppUser: (appUser) => set({ appUser }),
        setProfileStatus: (status) => set({ profileStatus: status }),
        setLoginTried: (value) => set({ loginTried: value }),
        setIsLoading: (value) => set({ isLoading: value }),
        setError: (error) => set({ error }),
        clearError: () => set({ error: null }),

        // 역할별 데이터 액션
        setSeekerData: (data) => set({ seekerData: data }),
        setEmployerData: (data) => set({ employerData: data }),
        clearSeekerData: () => set({ seekerData: null }),
        clearEmployerData: () => set({ employerData: null }),

        // 유틸리티 액션
        login: (supabaseUser, appUser, profileStatus) =>
          set({
            isLoggedIn: true,
            supabaseUser,
            appUser,
            profileStatus,
            loginTried: true,
            error: null, // 로그인 시 에러 클리어
            // 역할별 데이터는 별도로 로드
            seekerData: null,
            employerData: null,
          }),

        logout: () =>
          set({
            isLoggedIn: false,
            supabaseUser: null,
            appUser: null,
            profileStatus: null,
            loginTried: false,
            error: null,
            seekerData: null,
            employerData: null,
          }),

        updateProfileStatus: (updates) =>
          set((state) => ({
            profileStatus: state.profileStatus ? { ...state.profileStatus, ...updates } : null,
          })),

        // 기본 셀렉터
        isEmployer: () => {
          const { profileStatus } = get();
          return profileStatus?.role === "EMPLOYER";
        },

        isApplicant: () => {
          const { profileStatus } = get();
          return profileStatus?.role === "APPLICANT";
        },

        hasCompletedProfile: () => {
          const { profileStatus } = get();
          return profileStatus?.isProfileCompleted ?? false;
        },

        needsOnboarding: () => {
          const { profileStatus } = get();
          return !profileStatus?.hasRole || !profileStatus?.isProfileCompleted;
        },

        getUserDisplayName: () => {
          const { supabaseUser } = get();
          if (!supabaseUser) return "";

          return SupabaseUserMapper.getDisplayName(supabaseUser);
        },

        getUserEmail: () => {
          const { supabaseUser } = get();
          return SupabaseUserMapper.getEmail(supabaseUser);
        },

        getUserProfileImageUrl: () => {
          const { appUser } = get();
          if (!appUser) return null;

          return appUser.img_url || null;
        },

        getRoleSpecificData: () => {
          const { profileStatus, seekerData, employerData } = get();

          if (profileStatus?.role === "APPLICANT") {
            return seekerData;
          } else if (profileStatus?.role === "EMPLOYER") {
            return employerData;
          }

          return null;
        },

        // 유틸리티 셀렉터 (실무에서 자주 사용)
        hasError: () => {
          const { error } = get();
          return !!error;
        },

        isInitialized: () => {
          const { loginTried } = get();
          return loginTried;
        },

        canAccessRoleData: () => {
          const { isLoggedIn, profileStatus } = get();
          return isLoggedIn && !!profileStatus?.hasRole;
        },

        // 추가 유틸리티 셀렉터
        getSeekerData: () => {
          const { seekerData } = get();
          return seekerData;
        },

        getEmployerData: () => {
          const { employerData } = get();
          return employerData;
        },

        // 역할별 완성도 체크
        isSeekerProfileComplete: () => {
          const { profileStatus } = get();
          return (
            profileStatus?.role === "APPLICANT" &&
            profileStatus?.hasPersonalityProfile &&
            profileStatus?.hasApplicantProfile
          );
        },

        isEmployerProfileComplete: () => {
          const { profileStatus } = get();
          return profileStatus?.role === "EMPLOYER" && profileStatus?.isProfileCompleted;
        },
      }),
      {
        name: "auth-storage",
        // 민감한 데이터는 제외
        partialize: (state) => ({
          isLoggedIn: state.isLoggedIn,
          loginTried: state.loginTried,
        }),
      }
    ),
    {
      name: "auth-store",
    }
  )
);
