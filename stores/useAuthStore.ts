import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { AppUser, ProfileStatus, SupabaseUser } from "@/types/user";
import { SupabaseUserMapper } from "@/types/user";
import { STORAGE_URLS } from "@/constants/storage";

// 인증 상태 타입 정의
export type AuthState = "initializing" | "authenticated" | "unauthenticated" | "error";

interface AuthStoreState {
  // 인증 상태 관리
  authState: AuthState;
  retryCount: number;
  lastError: string | null;

  // 사용자 데이터
  supabaseUser: SupabaseUser | null;
  appUser: AppUser | null;
  profileStatus: ProfileStatus | null;

  // 상태 관리 액션
  setAuthState: (state: AuthState) => void;
  setRetryCount: (count: number) => void;
  setLastError: (error: string | null) => void;

  // 사용자 데이터 액션
  setSupabaseUser: (user: SupabaseUser | null) => void;
  setAppUser: (appUser: AppUser | null) => void;
  setProfileStatus: (status: ProfileStatus | null) => void;

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

  // 유틸리티 셀렉터
  hasError: () => boolean;
  isInitialized: () => boolean;
  canAccessRoleData: () => boolean;

  // 재시도 관련
  canRetry: () => boolean;
  getRetryDelay: () => number;

  // 초기화 상태 확인 개선
  isAuthenticated: () => boolean;

  // 세션 타임아웃 확인
  isSessionValid: () => boolean;

  // 마지막 활동 시간 업데이트
  updateLastActivity: () => void;
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

        // 상태 관리 액션
        setAuthState: (state) => set({ authState: state }),
        setRetryCount: (count) => set({ retryCount: count }),
        setLastError: (error) => set({ lastError: error }),

        // 사용자 데이터 액션
        setSupabaseUser: (user) => set({ supabaseUser: user }),
        setAppUser: (appUser) => set({ appUser }),
        setProfileStatus: (status) => set({ profileStatus: status }),

        // 인증 액션
        login: (supabaseUser, appUser, profileStatus) =>
          set({
            authState: "authenticated",
            supabaseUser,
            appUser,
            profileStatus,
            retryCount: 0,
            lastError: null,
          }),

        logout: () =>
          set({
            authState: "unauthenticated",
            supabaseUser: null,
            appUser: null,
            profileStatus: null,
            retryCount: 0,
            lastError: null,
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

        // 유틸리티 셀렉터
        hasError: () => {
          const { lastError } = get();
          return !!lastError;
        },

        // 초기화 상태 확인 개선
        isInitialized: () => {
          const { authState } = get();
          return authState !== "initializing";
        },

        // 인증 완료 상태 확인
        isAuthenticated: () => {
          const { authState, appUser, profileStatus } = get();
          return authState === "authenticated" && !!appUser && !!profileStatus;
        },

        // 세션 타임아웃 확인
        isSessionValid: () => {
          const { authState, appUser } = get();
          if (authState !== "authenticated" || !appUser) return false;

          // 마지막 활동 시간 확인 (30분)
          const lastActivity = localStorage.getItem("lastActivity");
          if (lastActivity) {
            const lastActivityTime = parseInt(lastActivity);
            const now = Date.now();
            const timeout = 30 * 60 * 1000; // 30분

            if (now - lastActivityTime > timeout) {
              return false; // 세션 만료
            }
          }
          return true;
        },

        // 마지막 활동 시간 업데이트
        updateLastActivity: () => {
          localStorage.setItem("lastActivity", Date.now().toString());
        },

        canAccessRoleData: () => {
          const { authState, profileStatus } = get();
          return authState === "authenticated" && !!profileStatus?.hasRole;
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
