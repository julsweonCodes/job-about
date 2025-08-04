import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGetData } from "@/utils/client/API";
import { EMPLOYER_QUERY_KEYS } from "@/constants/queryKeys";
import { Dashboard, JobPost } from "@/types/employer";
import { API_URLS } from "@/constants/api";

// API 함수들
const fetchDashboard = async (): Promise<Dashboard> => {
  const data = await apiGetData<Dashboard>(API_URLS.EMPLOYER.DASHBOARD.ROOT);
  return data || ({} as Dashboard);
};

const fetchActiveJobPosts = async (): Promise<JobPost[]> => {
  const data = await apiGetData<JobPost[]>(API_URLS.EMPLOYER.DASHBOARD.JOBPOSTS);
  return Array.isArray(data) ? data : [];
};

const fetchDraftJobPosts = async (): Promise<JobPost[]> => {
  // TODO: draft API 엔드포인트가 구현되면 수정 필요
  // 현재는 빈 배열로 설정
  return [];
};

interface UseEmployerDashboardReturn {
  dashboard: Dashboard | undefined;
  activeJobPostList: JobPost[];
  draftJobPostList: JobPost[];
  loadingStates: {
    dashboard: boolean;
    allJobPostList: boolean;
  };
  error: string | null;
  isInitialized: boolean;
  refreshAll: () => Promise<void>;
  invalidateJobPosts: () => void;
}

export function useEmployerDashboard(): UseEmployerDashboardReturn {
  const queryClient = useQueryClient();

  // Dashboard 데이터 쿼리
  const {
    data: dashboard,
    isLoading: dashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useQuery({
    queryKey: EMPLOYER_QUERY_KEYS.DASHBOARD,
    queryFn: fetchDashboard,
    staleTime: 5 * 60 * 1000, // 5분간 신선한 데이터
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
    refetchOnWindowFocus: false,
  });

  // Active Job Posts 쿼리
  const {
    data: jobPostList = { draft: [], active: [] },
    isLoading: allJobPostListLoading,
    error: allJobPostListError,
    refetch: refetchAllJobPostList,
  } = useQuery({
    queryKey: EMPLOYER_QUERY_KEYS.ACTIVE_JOB_POSTS,
    queryFn: fetchActiveJobPosts,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    select: (data: JobPost[]) => {
      return {
        draft: data.filter((p) => p.status === "DRAFT"),
        active: data.filter((p) => p.status === "PUBLISHED"),
      };
    }
  });

  const draftJobPostList = jobPostList.draft ?? [];
  const activeJobPostList = jobPostList.active ?? [];

  // 전체 새로고침 함수
  const refreshAll = async () => {
    const result = await Promise.allSettled([refetchDashboard(), refetchAllJobPostList()]);
    result.forEach( (r) => {
      if (r.status === "rejected") {
        console.error("❌ Failed during refreshAll:", r.reason);
      }
    });
  };

  // Job Posts 캐시 무효화 함수 (publish 시 사용)
  const invalidateJobPosts = () => {
    queryClient.invalidateQueries({ queryKey: EMPLOYER_QUERY_KEYS.ACTIVE_JOB_POSTS });
    queryClient.invalidateQueries({ queryKey: EMPLOYER_QUERY_KEYS.DRAFT_JOB_POSTS });
    queryClient.invalidateQueries({ queryKey: EMPLOYER_QUERY_KEYS.DASHBOARD });
  };

  // 에러 처리
  const error =
    dashboardError?.message ||
    allJobPostListError?.message ||
    null;

  return {
    dashboard,
    activeJobPostList,
    draftJobPostList,
    loadingStates: {
      dashboard: dashboardLoading,
      allJobPostList: allJobPostListLoading,
    },
    error,
    isInitialized: !dashboardLoading && !allJobPostListLoading,
    refreshAll,
    invalidateJobPosts,
  };
}
