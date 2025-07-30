import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { AppUser, ProfileStatus, SupabaseUser } from "@/types/user";
import { SupabaseUserMapper } from "@/types/user";
import { STORAGE_URLS } from "@/constants/storage";

// 인증 상태 타입 정의
export type AuthState = "initializing" | "authenticated" | "unauthenticated" | "error";

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

interface AuthStoreState {
  // 인증 상태 관리
  authState: AuthState;
  retryCount: number;
  lastError: string | null;

  // 사용자 데이터
  supabaseUser: SupabaseUser | null;
  appUser: AppUser | null;
  profileStatus: ProfileStatus | null;

  // 역할별 데이터
  seekerData: SeekerData | null;
  employerData: EmployerData | null;

  // 상태 관리 액션
  setAuthState: (state: AuthState) => void;
  setRetryCount: (count: number) => void;
  setLastError: (error: string | null) => void;

  // 사용자 데이터 액션
  setSupabaseUser: (user: SupabaseUser | null) => void;
  setAppUser: (appUser: AppUser | null) => void;
  setProfileStatus: (status: ProfileStatus | null) => void;

  // 역할별 데이터 액션
  setSeekerData: (data: SeekerData | null) => void;
  setEmployerData: (data: EmployerData | null) => void;
  clearSeekerData: () => void;
  clearEmployerData: () => void;

  // 인증 액션
  login: (supabaseUser: SupabaseUser, appUser: AppUser, profileStatus: ProfileStatus) => void;
  logout: () => void;
  retryAuth: () => void;
  resetAuth: () => void;

  // 프로필 업데이트 액션
  updateProfileStatus: (updates: Partial<ProfileStatus>) => void;
  updateProfileImage: (imgUrl: string) => void;

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

  // 유틸리티 셀렉터
  hasError: () => boolean;
  isInitialized: () => boolean;
  canAccessRoleData: () => boolean;
  getSeekerData: () => SeekerData | null;
  getEmployerData: () => EmployerData | null;
  isSeekerProfileComplete: () => boolean;
  isEmployerProfileComplete: () => boolean;

  // 재시도 관련
  canRetry: () => boolean;
  getRetryDelay: () => number;
}

export const useAuthStore = create<AuthStoreState>()(
  devtools(
    persist(
      (set, get) => ({
        // 초기 상태
        authState: "initializing",
        retryCount: 0,
        lastError: null,
        supabaseUser: null,
        appUser: null,
        profileStatus: null,
        seekerData: null,
        employerData: null,

        // 상태 관리 액션
        setAuthState: (state) => set({ authState: state }),
        setRetryCount: (count) => set({ retryCount: count }),
        setLastError: (error) => set({ lastError: error }),

        // 사용자 데이터 액션
        setSupabaseUser: (user) => set({ supabaseUser: user }),
        setAppUser: (appUser) => set({ appUser }),
        setProfileStatus: (status) => set({ profileStatus: status }),

        // 역할별 데이터 액션
        setSeekerData: (data) => set({ seekerData: data }),
        setEmployerData: (data) => set({ employerData: data }),
        clearSeekerData: () => set({ seekerData: null }),
        clearEmployerData: () => set({ employerData: null }),

        // 인증 액션
        login: (supabaseUser, appUser, profileStatus) =>
          set({
            authState: "authenticated",
            supabaseUser,
            appUser,
            profileStatus,
            retryCount: 0,
            lastError: null,
            seekerData: null,
            employerData: null,
          }),

        logout: () =>
          set({
            authState: "unauthenticated",
            supabaseUser: null,
            appUser: null,
            profileStatus: null,
            retryCount: 0,
            lastError: null,
            seekerData: null,
            employerData: null,
          }),

        retryAuth: () => {
          const { retryCount } = get();
          set({
            authState: "initializing",
            retryCount: retryCount + 1,
            lastError: null,
          });
        },

        resetAuth: () => {
          set({
            authState: "initializing",
            retryCount: 0,
            lastError: null,
          });
        },

        updateProfileStatus: (updates) =>
          set((state) => ({
            profileStatus: state.profileStatus ? { ...state.profileStatus, ...updates } : null,
          })),

        updateProfileImage: (imgUrl) =>
          set((state) => ({
            appUser: state.appUser ? { ...state.appUser, img_url: imgUrl } : null,
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
          if (!appUser || !appUser.img_url) {
            return null;
          }
          return `${STORAGE_URLS.USER.PROFILE_IMG}${appUser.img_url}`;
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

        // 유틸리티 셀렉터
        hasError: () => {
          const { lastError } = get();
          return !!lastError;
        },

        isInitialized: () => {
          const { authState } = get();
          return authState !== "initializing";
        },

        canAccessRoleData: () => {
          const { authState, profileStatus } = get();
          return authState === "authenticated" && !!profileStatus?.hasRole;
        },

        getSeekerData: () => {
          const { seekerData } = get();
          return seekerData;
        },

        getEmployerData: () => {
          const { employerData } = get();
          return employerData;
        },

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

        // 재시도 관련
        canRetry: () => {
          const { retryCount } = get();
          return retryCount < 3; // 최대 3번 재시도
        },

        getRetryDelay: () => {
          const { retryCount } = get();
          return Math.min(1000 * Math.pow(2, retryCount), 5000); // 지수 백오프, 최대 5초
        },
      }),
      {
        name: "auth-storage",
        // 민감한 데이터는 제외하고 최소한의 정보만 저장
        partialize: (state) => ({
          authState: state.authState,
          retryCount: state.retryCount,
        }),
        // 스토리지 에러 처리
        onRehydrateStorage: () => (state) => {
          if (state) {
            try {
              // localStorage 접근 테스트
              const testKey = "__test_storage__";
              localStorage.setItem(testKey, "test");
              localStorage.removeItem(testKey);
            } catch (e) {
              // 스토리지 접근 실패 시 안전한 상태로 리셋
              state.authState = "unauthenticated";
              state.retryCount = 0;
            }
          }
        },
      }
    ),
    {
      name: "auth-store",
    }
  )
);
