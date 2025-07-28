import { useCallback } from "react";
import { apiGet } from "@/utils/client/API";
import { RecommendedJobPost, RecommendationResponse } from "@/types/job";
import { API_URLS } from "@/constants/api";
import { WorkType } from "@/constants/enums";
import { Location } from "@/constants/location";
import { usePagination } from "./usePagination";
import { PaginationParams } from "@/types/hooks";

interface UseRecommendedJobsParams {
  workType?: WorkType;
  location?: Location;
  page?: number;
  limit?: number;
  autoFetch?: boolean;
}

interface UseRecommendedJobsReturn {
  recommendedJobs: RecommendedJobPost[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  totalCount: number;
  isInitialized: boolean;
  currentPage: number;
  fetchRecommendedJobs: (params?: Partial<UseRecommendedJobsParams>) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  setPage: (page: number) => void;
}

export function useRecommendedJobs({
  workType,
  location,
  page = 1,
  limit = 10,
  autoFetch = true,
}: UseRecommendedJobsParams = {}): UseRecommendedJobsReturn {
  const fetchRecommendedJobsFunction = useCallback(
    async (params: PaginationParams) => {
      const queryParams: Record<string, any> = {
        page: params.page,
        limit: params.limit,
      };

      if (workType) {
        queryParams.jobType = workType;
      }

      if (location) {
        queryParams.location = location;
      }

      const response = await apiGet<{ data: RecommendationResponse }>(
        API_URLS.RECOMMENDATIONS.JOBS,
        queryParams
      );

      if (
        response &&
        response.data &&
        response.data.recommendations &&
        Array.isArray(response.data.recommendations)
      ) {
        return {
          data: response.data.recommendations,
          totalCount: response.data.totalCount || 0,
          hasMore: response.data.recommendations.length === params.limit,
        };
      } else {
        throw new Error("Failed to fetch recommended jobs");
      }
    },
    [workType, location]
  );

  const {
    data: recommendedJobs,
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
    fetchFunction: fetchRecommendedJobsFunction,
  });

  const fetchRecommendedJobs = useCallback(
    async (params?: Partial<UseRecommendedJobsParams>) => {
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
    recommendedJobs,
    loading,
    error,
    hasMore: pagination.hasMore,
    totalCount: pagination.totalCount,
    isInitialized,
    currentPage: pagination.currentPage,
    fetchRecommendedJobs,
    loadMore,
    refresh,
    setPage,
  };
}
