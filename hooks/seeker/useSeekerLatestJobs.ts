import { useCallback } from "react";
import { JobPostData, JobPostMapper, ApiLatestJobPost } from "@/types/jobPost";
import { API_URLS } from "@/constants/api";
import { WorkType } from "@/constants/enums";
import { Location } from "@/constants/location";
import { useSeekerPagination } from "./useSeekerPagination";

interface UseLatestJobsParams {
  workType?: WorkType;
  location?: Location;
  page?: number;
  limit?: number;
  autoFetch?: boolean;
}

interface UseLatestJobsReturn {
  latestJobs: JobPostData[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  totalCount: number;
  isInitialized: boolean;
  currentPage: number;
  fetchLatestJobs: (params?: Partial<UseLatestJobsParams>) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  setPage: (page: number) => void;
}

export function useLatestJobs({
  workType,
  location,
  page = 1,
  limit = 10,
  autoFetch = true,
}: UseLatestJobsParams = {}): UseLatestJobsReturn {
  // JobPostData 변환 함수
  const transformJobPost = useCallback((data: ApiLatestJobPost): JobPostData => {
    return JobPostMapper.fromLatestJobPost(data);
  }, []);

  const {
    data: latestJobs,
    loading,
    error,
    hasMore,
    totalCount,
    isInitialized,
    currentPage,
    fetchData: fetchLatestJobs,
    loadMore,
    refresh,
    setPage,
  } = useSeekerPagination<JobPostData>({
    apiUrl: API_URLS.JOB_POSTS.ROOT,
    workType,
    location,
    page,
    limit,
    autoFetch,
    transformData: transformJobPost,
  });

  return {
    latestJobs,
    loading,
    error,
    hasMore,
    totalCount,
    isInitialized,
    currentPage,
    fetchLatestJobs,
    loadMore,
    refresh,
    setPage,
  };
}
