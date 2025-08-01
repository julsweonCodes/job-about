import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// WorkStyle 데이터 타입 정의
export interface WorkStyle {
  id: number;
  name_ko: string;
  name_en: string;
  description_ko: string;
  description_en: string;
}

// Seeker 관련 데이터 타입 정의
export interface SeekerData {
  workStyle: WorkStyle | null;
  // 추후 다른 seeker 관련 데이터 추가 가능
  // profile: SeekerProfile | null;
  // preferences: SeekerPreferences | null;
}

// Store 상태 타입 정의
interface SeekerStoreState {
  // 데이터
  data: SeekerData;

  // 로딩 상태
  isLoading: {
    workStyle: boolean;
  };

  // 에러 상태
  errors: {
    workStyle: string | null;
  };

  // 액션들
  setWorkStyle: (workStyle: WorkStyle | null) => void;
  setWorkStyleLoading: (loading: boolean) => void;
  setWorkStyleError: (error: string | null) => void;

  // 데이터 초기화
  resetData: () => void;
  resetErrors: () => void;

  // 유틸리티 함수들
  hasWorkStyle: () => boolean;
  getWorkStyleDisplayName: () => string;
}

// 초기 상태
const initialState: SeekerData = {
  workStyle: null,
};

const initialLoadingState = {
  workStyle: false,
};

const initialErrorState = {
  workStyle: null,
};

export const useSeekerStore = create<SeekerStoreState>()(
  devtools(
    persist(
      (set, get) => ({
        // 초기 상태
        data: initialState,
        isLoading: initialLoadingState,
        errors: initialErrorState,

        // WorkStyle 관련 액션
        setWorkStyle: (workStyle) =>
          set((state) => ({
            data: {
              ...state.data,
              workStyle,
            },
            errors: {
              ...state.errors,
              workStyle: null, // 데이터 설정 시 에러 초기화
            },
          })),

        setWorkStyleLoading: (loading) =>
          set((state) => ({
            isLoading: {
              ...state.isLoading,
              workStyle: loading,
            },
          })),

        setWorkStyleError: (error) =>
          set((state) => ({
            errors: {
              ...state.errors,
              workStyle: error,
            },
            isLoading: {
              ...state.isLoading,
              workStyle: false, // 에러 발생 시 로딩 상태 해제
            },
          })),

        // 데이터 초기화
        resetData: () =>
          set({
            data: initialState,
            isLoading: initialLoadingState,
            errors: initialErrorState,
          }),

        resetErrors: () =>
          set({
            errors: initialErrorState,
          }),

        // 유틸리티 함수들
        hasWorkStyle: () => {
          const { data } = get();
          return data.workStyle !== null;
        },

        getWorkStyleDisplayName: () => {
          const { data } = get();
          if (!data.workStyle) return "";

          // 한국어 우선, 없으면 영어
          return data.workStyle.name_ko || data.workStyle.name_en || "";
        },
      }),
      {
        name: "seeker-storage",
        // 민감하지 않은 데이터만 저장
        partialize: (state) => ({
          data: state.data,
        }),
        // 스토리지 에러 처리
        onRehydrateStorage: () => (state) => {
          if (state) {
            try {
              // localStorage 접근 테스트
              const testKey = "__test_storage__";
              localStorage.setItem(testKey, "test");
              localStorage.removeItem(testKey);
            } catch (error) {
              console.warn("Storage not available, skipping persistence:", error);
            }
          }
        },
      }
    ),
    {
      name: "seeker-store",
    }
  )
);

// 편의 함수들 - 컴포넌트에서 쉽게 사용할 수 있도록
export const useSeekerWorkStyle = () => {
  const { data, isLoading, errors, setWorkStyle, setWorkStyleLoading, setWorkStyleError } =
    useSeekerStore();

  return {
    workStyle: data.workStyle,
    isLoading: isLoading.workStyle,
    error: errors.workStyle,
    setWorkStyle,
    setLoading: setWorkStyleLoading,
    setError: setWorkStyleError,
  };
};

// 데이터 존재 여부 확인 함수들
export const useSeekerDataStatus = () => {
  const { hasWorkStyle, getWorkStyleDisplayName } = useSeekerStore();

  return {
    hasWorkStyle: hasWorkStyle(),
    workStyleDisplayName: getWorkStyleDisplayName(),
  };
};
