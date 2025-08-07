import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { JobPostData } from "@/types/client/jobPost";

// Latest Jobs 데이터 타입 정의
export interface LatestJobsData {
  jobs: JobPostData[];
  currentPage: number;
  hasMore: boolean;
  totalCount: number;
  scrollPosition: number;
  filters: {
    workType: string;
    location: string;
  };
  lastUpdated: number;
}

// Store 상태 타입 정의
interface LatestJobsStoreState {
  // 데이터
  data: LatestJobsData | null;

  // 로딩 상태
  isLoading: boolean;

  // 에러 상태
  error: string | null;

  // Hydration 상태
  isHydrated: boolean;

  // 액션들
  setJobs: (jobs: JobPostData[], page: number, hasMore: boolean, totalCount: number) => void;
  addJobs: (jobs: JobPostData[], page: number, hasMore: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
  setScrollPosition: (position: number) => void;
  setFilters: (workType: string, location: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // 데이터 초기화
  resetData: () => void;
  clearJobs: () => void;

  // Hydration 관련
  setHydrated: (hydrated: boolean) => void;

  // 유틸리티 함수들
  hasData: () => boolean;
  isDataStale: (maxAgeMinutes?: number) => boolean;
  shouldRefetch: (workType: string, location: string) => boolean;
}

// 초기 상태
const initialData: LatestJobsData = {
  jobs: [],
  currentPage: 1,
  hasMore: true,
  totalCount: 0,
  scrollPosition: 0,
  filters: {
    workType: "all",
    location: "all",
  },
  lastUpdated: 0,
};

export const useLatestJobsStore = create<LatestJobsStoreState>()(
  devtools(
    persist(
      (set, get) => ({
        // 초기 상태
        data: null,
        isLoading: false,
        error: null,
        isHydrated: typeof window !== "undefined", // 클라이언트에서만 true

        // Jobs 관련 액션
        setJobs: (jobs, page, hasMore, totalCount) =>
          set((state) => ({
            data: {
              jobs,
              currentPage: page,
              hasMore,
              totalCount,
              scrollPosition: state.data?.scrollPosition || 0,
              filters: state.data?.filters || { workType: "all", location: "all" },
              lastUpdated: Date.now(),
            },
            error: null,
          })),

        addJobs: (jobs, page, hasMore) =>
          set((state) => {
            console.log("🔄 Store addJobs called:", {
              jobsLength: jobs.length,
              page,
              hasMore,
              existingJobsLength: state.data?.jobs.length || 0,
            });

            if (!state.data) {
              console.log("❌ No existing data in store");
              return state;
            }

            // 중복 제거
            const existingIds = new Set(state.data.jobs.map((job) => job.id));
            const uniqueNewJobs = jobs.filter((job) => !existingIds.has(job.id));

            console.log("➕ Adding jobs to store:", {
              newJobsLength: jobs.length,
              uniqueNewJobsLength: uniqueNewJobs.length,
              existingJobsLength: state.data.jobs.length,
              finalJobsLength: state.data.jobs.length + uniqueNewJobs.length,
              hasMore,
            });

            return {
              data: {
                ...state.data,
                jobs: [...state.data.jobs, ...uniqueNewJobs],
                currentPage: page,
                hasMore, // hasMore 상태를 명시적으로 업데이트
                lastUpdated: Date.now(),
              },
            };
          }),

        setHasMore: (hasMore) =>
          set((state) => {
            console.log("🔄 Store setHasMore called:", {
              hasMore,
              currentHasMore: state.data?.hasMore,
            });
            if (!state.data) return state;
            return {
              data: {
                ...state.data,
                hasMore,
                lastUpdated: Date.now(),
              },
            };
          }),

        setScrollPosition: (position) =>
          set((state) => ({
            data: state.data
              ? {
                  ...state.data,
                  scrollPosition: position,
                }
              : null,
          })),

        setFilters: (workType, location) =>
          set((state) => ({
            data: state.data
              ? {
                  ...state.data,
                  filters: { workType, location },
                  lastUpdated: Date.now(),
                }
              : null,
          })),

        setLoading: (loading) =>
          set({
            isLoading: loading,
          }),

        setError: (error) =>
          set({
            error,
            isLoading: false,
          }),

        // 데이터 초기화
        resetData: () => {
          console.log("🔄 Store resetData called");
          set({
            data: null,
            isLoading: false,
            error: null,
          });
        },

        clearJobs: () =>
          set((state) => ({
            data: state.data
              ? {
                  ...state.data,
                  jobs: [],
                  currentPage: 1,
                  hasMore: true,
                  totalCount: 0,
                  scrollPosition: 0,
                }
              : null,
          })),

        // Hydration 관련
        setHydrated: (hydrated) =>
          set((state) => ({
            isHydrated: hydrated,
          })),

        // 유틸리티 함수들
        hasData: () => {
          const { data } = get();
          return data !== null && data.jobs.length > 0;
        },

        isDataStale: (maxAgeMinutes = 5) => {
          const { data } = get();
          if (!data) return true;

          const maxAgeMs = maxAgeMinutes * 60 * 1000;
          return Date.now() - data.lastUpdated > maxAgeMs;
        },

        shouldRefetch: (workType, location) => {
          const { data } = get();
          if (!data) return true;

          // 필터가 변경되었으면 리페치
          if (data.filters.workType !== workType || data.filters.location !== location) {
            return true;
          }

          // 데이터가 오래되었으면 리페치
          return get().isDataStale();
        },
      }),
      {
        name: "latest-jobs-storage",
        // localStorage 사용 (기본 동작)
        partialize: (state) => ({
          data: state.data,
          isHydrated: state.isHydrated,
        }),
        // 스토리지 에러 처리
        onRehydrateStorage: () => (state) => {
          if (state) {
            try {
              console.log("🔄 Storage rehydrated:", {
                hasData: !!state.data,
                jobsLength: state.data?.jobs.length || 0,
                hasMore: state.data?.hasMore,
                currentPage: state.data?.currentPage,
                filters: state.data?.filters,
                isRehydrating: true,
              });
            } catch (error) {
              console.warn("Storage not available, skipping persistence:", error);
            }
          }
        },
      }
    ),
    {
      name: "latest-jobs-store",
    }
  )
);

// 편의 함수들 - 컴포넌트에서 쉽게 사용할 수 있도록
export const useLatestJobsData = () => {
  const {
    data,
    isLoading,
    error,
    isHydrated,
    setJobs,
    addJobs,
    setHasMore,
    setScrollPosition,
    setFilters,
    setLoading,
    setError,
    setHydrated,
  } = useLatestJobsStore();

  const hasMoreValue = data?.hasMore ?? true;

  console.log("🔄 useLatestJobsData hasMore calculation:", {
    dataHasMore: data?.hasMore,
    hasMoreValue,
    dataExists: !!data,
  });

  return {
    jobs: data?.jobs || [],
    currentPage: data?.currentPage || 1,
    hasMore: hasMoreValue,
    totalCount: data?.totalCount || 0,
    scrollPosition: data?.scrollPosition || 0,
    filters: data?.filters || { workType: "all", location: "all" },
    isLoading,
    error,
    isHydrated,
    setJobs,
    addJobs,
    setHasMore,
    setScrollPosition,
    setFilters,
    setLoading,
    setError,
    setHydrated,
  };
};

// 데이터 존재 여부 확인 함수들
export const useLatestJobsStatus = () => {
  const { hasData, isDataStale, shouldRefetch } = useLatestJobsStore();

  return {
    hasData: hasData(),
    isDataStale: (maxAgeMinutes?: number) => isDataStale(maxAgeMinutes),
    shouldRefetch: (workType: string, location: string) => shouldRefetch(workType, location),
  };
};
