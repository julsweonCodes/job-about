import { useCallback } from "react";
import { apiGet } from "@/utils/client/API";
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

      const response = await apiGet<{ data: JobPost[] }>(API_URLS.JOB_POSTS.ROOT, queryParams);

      if (response && response.data && Array.isArray(response.data)) {
        return {
          data: response.data,
          totalCount: response.data.length,
          hasMore: response.data.length === params.limit,
        };
      } else {
        throw new Error("Failed to fetch latest jobs");
      }
    },
    [workType, location]
  );

  const {
    data: latestJobs,
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
    latestJobs,
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
