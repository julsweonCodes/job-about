import { useQuery, useQueryClient, QueryClient } from "@tanstack/react-query";
import { apiGetData } from "@/utils/client/API";
import { EMPLOYER_QUERY_KEYS } from "@/constants/queryKeys";
import { Dashboard } from "@/types/server/employer";
import { API_URLS } from "@/constants/api";
import { Applicant, ApplicantStatus } from "@/types/job";
import { ApplicantDetail } from "@/types/profile";
import {
  ClientJobPost,
  UrgentClientJobPost,
  EmployerMapper,
  ApiJobPost,
  ApiUrgentJobPost,
  ApiDashboard,
} from "@/types/client/employer";
import { JobStatus } from "@/constants/enums";

// API 함수들
const fetchDashboard = async (): Promise<Dashboard> => {
  const data = await apiGetData<ApiDashboard>(API_URLS.EMPLOYER.DASHBOARD.ROOT);
  return data ? EmployerMapper.fromDashboard(data) : ({} as Dashboard);
};

const fetchActiveJobPosts = async (): Promise<ClientJobPost[]> => {
  const data = await apiGetData<ApiJobPost[]>(API_URLS.EMPLOYER.DASHBOARD.JOBPOSTS);
  const mappedData = Array.isArray(data) ? EmployerMapper.fromJobPostArray(data) : [];
  return mappedData;
};

const fetchJobPostAppList = async (postId: string): Promise<Applicant[]> => {
  const data = await apiGetData<Applicant[]>(API_URLS.EMPLOYER.DASHBOARD.APPLICANT_LIST(postId));
  return Array.isArray(data) ? data : [];
};

const fetchApplicationDetail = async (postId: string, appId: string): Promise<ApplicantDetail> => {
  const data = await apiGetData<ApplicantDetail>(
    API_URLS.EMPLOYER.DASHBOARD.APPLICANT_DETAIL(postId, appId)
  );
  return data || ({} as ApplicantDetail);
};

const fetchUrgentJobPosts = async (): Promise<UrgentClientJobPost[]> => {
  const data = await apiGetData<ApiUrgentJobPost[]>(API_URLS.EMPLOYER.DASHBOARD.URGENT);
  return Array.isArray(data) ? EmployerMapper.fromUrgentJobPostArray(data) : [];
};

export const updateApplicantStatus = async (
  postId: string,
  appId: string,
  status: ApplicantStatus
): Promise<number> => {
  const response = await fetch(API_URLS.EMPLOYER.DASHBOARD.APPLICANT_DETAIL(postId, appId), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ postId, appId, status }),
  });
  if (!response.ok) {
    throw new Error(`Failed to update applicant status: ${response.statusText}`);
  }
  const data = await response.json();
  return data.data.id; // 성공적으로 업데이트된 신청자의 수 반환
};

interface UseEmployerDashboardReturn {
  dashboard: Dashboard | undefined;
  activeJobPostList: ClientJobPost[];
  draftJobPostList: ClientJobPost[];
  loadingStates: {
    dashboard: boolean;
    allJobPostList: boolean;
  };
  error: string | null;
  isInitialized: boolean;
  refreshAll: () => Promise<void>;
  invalidateJobPosts: () => void;
}

interface UseEmployerJobPostAppListReturn {
  jobPostAppList: Applicant[];
  loadingStates: {
    jobPostAppList: boolean;
  };
  error: string | null;
  isInitialized: boolean;
  refreshAll: () => Promise<void>;
  invalidateJobPostAllList: () => void;
  queryClient: QueryClient;
}

interface UseApplicantDetailReturn {
  appDetail: ApplicantDetail | undefined;
  loadingStates: {
    appDetail: boolean;
  };
  error: string | null;
  isInitialized: boolean;
  refreshAll: () => Promise<void>;
  invalidateAppDetail: () => void;
  queryClient: QueryClient;
}

interface UseEmployerUrgentJobPostsReturn {
  urgentJobPosts: UrgentClientJobPost[];
  loadingStates: {
    urgentJobPosts: boolean;
  };
  error: string | null;
  isInitialized: boolean;
  refreshAll: () => Promise<void>;
  invalidateUrgentJobPostsList: () => void;
  queryClient: QueryClient;
}

export function useEmployerUrgentJobPosts(): UseEmployerUrgentJobPostsReturn {
  const queryClient = useQueryClient();

  // Urgent Job Posts 쿼리
  const {
    data: urgentJobPosts = [],
    isLoading: urgentJobPostsLoading,
    error: urgentJobPostsError,
    refetch: refetchUrgentJobPosts,
  } = useQuery({
    queryKey: EMPLOYER_QUERY_KEYS.URGENT_JOB_POSTS,
    queryFn: fetchUrgentJobPosts,
    staleTime: 5 * 60 * 1000, // 5분간 신선한 데이터
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
    refetchOnWindowFocus: false,
  });

  // 전체 새로고침 함수
  const refreshAll = async () => {
    const result = await Promise.allSettled([refetchUrgentJobPosts()]);
    result.forEach((r) => {
      if (r.status === "rejected") {
        console.error("❌ Failed during refreshAll:", r.reason);
      }
    });
  };

  // 에러 처리
  const error = urgentJobPostsError?.message || null;

  return {
    urgentJobPosts,
    loadingStates: {
      urgentJobPosts: urgentJobPostsLoading,
    },
    error,
    isInitialized: !urgentJobPostsLoading,
    refreshAll,
    invalidateUrgentJobPostsList: () =>
      queryClient.invalidateQueries({ queryKey: EMPLOYER_QUERY_KEYS.URGENT_JOB_POSTS }),
    queryClient,
  };
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
    select: (data: ClientJobPost[]) => {
      const result = {
        draft: data.filter((p) => p.status === JobStatus.DRAFT),
        active: data.filter((p) => p.status === JobStatus.PUBLISHED),
      };
      return result;
    },
  });

  const draftJobPostList = jobPostList.draft ?? [];
  const activeJobPostList = jobPostList.active ?? [];

  // 전체 새로고침 함수
  const refreshAll = async () => {
    const result = await Promise.allSettled([refetchDashboard(), refetchAllJobPostList()]);
    result.forEach((r) => {
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
  const error = dashboardError?.message || allJobPostListError?.message || null;

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

export function useEmployerJobPostAppList(postId: string): UseEmployerJobPostAppListReturn {
  const queryClient = useQueryClient();

  // Job Post  쿼리
  const {
    data: jobPostAppList = [],
    isLoading: jobPostAppListLoading,
    error: jobPostAppListError,
    refetch: refetchJobPostAppList,
  } = useQuery({
    queryKey: EMPLOYER_QUERY_KEYS.APPLICANTS_LIST(postId),
    queryFn: () => fetchJobPostAppList(postId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // 전체 새로고침 함수
  const refreshAll = async () => {
    const result = await Promise.allSettled([refetchJobPostAppList()]);
    result.forEach((r) => {
      if (r.status === "rejected") {
        console.error("❌ Failed during refreshAll:", r.reason);
      }
    });
  };

  // Job Posts 캐시 무효화 함수 (publish 시 사용)
  const invalidateJobPostAllList = () => {
    queryClient.invalidateQueries({ queryKey: EMPLOYER_QUERY_KEYS.APPLICANTS_LIST(postId) });
  };

  // 에러 처리
  const error = jobPostAppListError?.message || null;

  return {
    jobPostAppList,
    loadingStates: {
      jobPostAppList: jobPostAppListLoading,
    },
    error,
    isInitialized: !jobPostAppListLoading,
    refreshAll,
    invalidateJobPostAllList,
    queryClient,
  };
}

export function useApplicationDetail(postId: string, appId: string): UseApplicantDetailReturn {
  const queryClient = useQueryClient();

  // Dashboard 데이터 쿼리
  const {
    data: appDetail,
    isLoading: appDetailLoading,
    error: appDetailError,
    refetch: refetchAppDetail,
  } = useQuery({
    queryKey: EMPLOYER_QUERY_KEYS.APPLICANTS_DETAIL(postId, appId),
    queryFn: () => fetchApplicationDetail(postId, appId),
    staleTime: 5 * 60 * 1000, // 5분간 신선한 데이터
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
    refetchOnWindowFocus: false,
  });

  // 전체 새로고침 함수
  const refreshAll = async () => {
    const result = await Promise.allSettled([refetchAppDetail()]);
    result.forEach((r) => {
      if (r.status === "rejected") {
        console.error("❌ Failed during refreshAll:", r.reason);
      }
    });
  };

  // Job Posts 캐시 무효화 함수 (publish 시 사용)
  const invalidateAppDetail = () => {
    queryClient.invalidateQueries({
      queryKey: EMPLOYER_QUERY_KEYS.APPLICANTS_DETAIL(postId, appId),
    });
  };

  // 에러 처리
  const error = appDetailError?.message || null;

  return {
    appDetail,
    loadingStates: {
      appDetail: appDetailLoading,
    },
    error,
    isInitialized: !appDetailLoading,
    refreshAll,
    invalidateAppDetail,
    queryClient,
  };
}
