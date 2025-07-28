import { useState, useEffect, useCallback } from "react";
import { apiGet } from "@/utils/client/API";
import { RecommendedJobPost, RecommendationResponse } from "@/types/job";
import { WorkType, Location } from "@prisma/client";
import { API_URLS } from "@/constants/api";

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
  fetchRecommendedJobs: (params?: Partial<UseRecommendedJobsParams>) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useRecommendedJobs({
  workType,
  location,
  page = 1,
  limit = 10,
  autoFetch = true,
}: UseRecommendedJobsParams = {}): UseRecommendedJobsReturn {
  const [recommendedJobs, setRecommendedJobs] = useState<RecommendedJobPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchRecommendedJobs = useCallback(
    async (params?: Partial<UseRecommendedJobsParams>) => {
      try {
        setLoading(true);
        setError(null);

        const queryParams: Record<string, any> = {};

        if (params?.workType || workType) {
          queryParams.work_type = params?.workType || workType;
        }

        if (params?.location || location) {
          queryParams.location = params?.location || location;
        }

        if (params?.page || currentPage) {
          queryParams.page = params?.page || currentPage;
        }

        if (params?.limit || limit) {
          queryParams.limit = params?.limit || limit;
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
          const newRecommendedJobs = response.data.recommendations;

          if (params?.page === 1 || currentPage === 1) {
            // 첫 페이지면 전체 교체
            setRecommendedJobs(newRecommendedJobs);
          } else {
            // 추가 페이지면 기존에 추가
            setRecommendedJobs((prev) => [...prev, ...newRecommendedJobs]);
          }

          setHasMore(newRecommendedJobs.length === (params?.limit || limit));
          setTotalCount(response.data.totalCount || 0);
        } else {
          setError("Failed to fetch recommended jobs");
          setRecommendedJobs([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setRecommendedJobs([]);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    },
    [workType, location, currentPage, limit]
  );

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    await fetchRecommendedJobs({ page: nextPage });
  }, [loading, hasMore, currentPage, fetchRecommendedJobs]);

  const refresh = useCallback(async () => {
    setCurrentPage(1);
    setRecommendedJobs([]);
    setHasMore(true);
    await fetchRecommendedJobs({ page: 1 });
  }, [fetchRecommendedJobs]);

  useEffect(() => {
    if (autoFetch) {
      fetchRecommendedJobs();
    }
  }, [autoFetch, fetchRecommendedJobs]);

  return {
    recommendedJobs,
    loading,
    error,
    hasMore,
    totalCount,
    isInitialized,
    fetchRecommendedJobs,
    loadMore,
    refresh,
  };
}
