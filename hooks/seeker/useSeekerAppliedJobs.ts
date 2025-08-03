import { useCallback } from "react";
import { API_URLS } from "@/constants/api";
import { JobPostData, JobPostMapper, ApiAppliedJobResponse } from "@/types/jobPost";
import { useSeekerPagination } from "./useSeekerPagination";

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
    autoFetch,
    transformData: transformAppliedJob,
  });

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
