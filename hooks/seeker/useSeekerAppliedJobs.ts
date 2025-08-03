import { useCallback, useEffect } from "react";
import { API_URLS } from "@/constants/api";
import { JobPostData, JobPostMapper, ApiAppliedJobResponse } from "@/types/jobPost";
import { useSeekerPagination } from "./useSeekerPagination";
import { useFilterStore } from "@/stores/useFilterStore";

interface UseSeekerAppliedJobsOptions {
  limit?: number;
  autoFetch?: boolean;
}

interface UseSeekerAppliedJobsReturn {
  appliedJobs: JobPostData[] | null;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  isInitialized: boolean;
}

export const useSeekerAppliedJobs = (
  options: UseSeekerAppliedJobsOptions = {}
): UseSeekerAppliedJobsReturn => {
  const { limit = 20, autoFetch = true } = options;
  const { filters } = useFilterStore();

  // JobPostData 변환 함수
  const transformAppliedJob = useCallback((data: ApiAppliedJobResponse): JobPostData => {
    return JobPostMapper.fromAppliedJobResponse(data);
  }, []);

  const {
    data: appliedJobs,
    loading,
    error,
    hasMore,
    totalCount,
    isInitialized,
    currentPage,
    fetchData: fetchAppliedJobs,
    loadMore,
    refresh,
    setPage,
  } = useSeekerPagination<JobPostData>({
    apiUrl: API_URLS.SEEKER.APPLY,
    page: 1,
    limit,
    autoFetch: false, // 필터 변경 시 수동으로 호출하도록 변경
    transformData: transformAppliedJob,
  });

  // 필터가 변경될 때마다 새로운 데이터 가져오기
  useEffect(() => {
    if (isInitialized) {
      // 필터 변경 시 첫 페이지부터 다시 시작
      fetchAppliedJobs({ page: 1 });
    }
  }, [filters.workType, filters.location, fetchAppliedJobs, isInitialized]);

  // 초기 로딩
  useEffect(() => {
    if (!isInitialized) {
      fetchAppliedJobs({ page: 1 });
    }
  }, [fetchAppliedJobs, isInitialized]);

  return {
    appliedJobs: appliedJobs || null,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    isInitialized,
  };
};
