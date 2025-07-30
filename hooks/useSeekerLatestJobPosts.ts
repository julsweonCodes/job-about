import { useCallback } from "react";
import { apiGetData } from "@/utils/client/API";
import { JobPost } from "@/types/job";
import { API_URLS } from "@/constants/api";
import { WorkType } from "@/constants/enums";
import { Location } from "@/constants/location";
import { usePagination } from "./usePagination";
import { PaginationParams } from "@/types/hooks";

interface UseLatestJobsParams {
  workType?: WorkType;
  location?: Location;
  page?: number;
  limit?: number;
  autoFetch?: boolean;
}

interface UseLatestJobsReturn {
  latestJobs: JobPost[];
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
  const fetchLatestJobsFunction = useCallback(
    async (params: PaginationParams) => {
      const queryParams: Record<string, any> = {
        page: params.page,
        limit: params.limit,
      };

      if (workType) {
        queryParams.work_type = workType;
      }

      if (location) {
        queryParams.location = location;
      }

      const data = await apiGetData<{ data: JobPost[] }>(API_URLS.JOB_POSTS.ROOT, queryParams);

      if (data && Array.isArray(data)) {
        return {
          data: data,
          totalCount: data.length,
          hasMore: data.length === params.limit,
        };
      } else {
        throw new Error("Failed to fetch latest jobs");
      }
    },
    [workType, location]
  );

  const {
    data: latestJobPosts,
    pagination,
    loading,
    error,
    isInitialized,
    fetchPage,
    loadMore,
    refresh,
    goToPage,
  } = usePagination({
    initialPage: page,
    initialLimit: limit,
    autoFetch,
    fetchFunction: fetchLatestJobsFunction,
  });

  const fetchLatestJobs = useCallback(
    async (params?: Partial<UseLatestJobsParams>) => {
      const targetPage = params?.page || page;
      await fetchPage(targetPage);
    },
    [fetchPage, page]
  );

  const setPage = useCallback(
    (page: number) => {
      goToPage(page);
    },
    [goToPage]
  );

  return {
    latestJobs: latestJobPosts || [], // null일 경우 빈 배열 반환
    loading,
    error,
    hasMore: pagination.hasMore,
    totalCount: pagination.totalCount,
    isInitialized,
    currentPage: pagination.currentPage,
    fetchLatestJobs,
    loadMore,
    refresh,
    setPage,
  };
}
