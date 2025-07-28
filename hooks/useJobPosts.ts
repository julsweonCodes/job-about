import { useState, useEffect, useCallback } from "react";
import { apiGet } from "@/utils/client/API";
import { JobPost } from "@/types/job";
import { WorkType, Location } from "@prisma/client";
import { API_URLS } from "@/constants/api";

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
  fetchLatestJobs: (params?: Partial<UseLatestJobsParams>) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useLatestJobs({
  workType,
  location,
  page = 1,
  limit = 10,
  autoFetch = true,
}: UseLatestJobsParams = {}): UseLatestJobsReturn {
  const [latestJobs, setLatestJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchLatestJobs = useCallback(
    async (params?: Partial<UseLatestJobsParams>) => {
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

        const response = await apiGet<{ data: JobPost[] }>(API_URLS.JOB_POSTS.ROOT, queryParams);

        if (response && response.data && Array.isArray(response.data)) {
          const newLatestJobs = response.data;

          if (params?.page === 1 || currentPage === 1) {
            // 첫 페이지면 전체 교체
            setLatestJobs(newLatestJobs);
          } else {
            // 추가 페이지면 기존에 추가
            setLatestJobs((prev) => [...prev, ...newLatestJobs]);
          }

          setHasMore(newLatestJobs.length === (params?.limit || limit));
          setTotalCount(newLatestJobs.length || 0);
        } else {
          setError("Failed to fetch latest jobs");
          setLatestJobs([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLatestJobs([]);
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
    await fetchLatestJobs({ page: nextPage });
  }, [loading, hasMore, currentPage, fetchLatestJobs]);

  const refresh = useCallback(async () => {
    setCurrentPage(1);
    setLatestJobs([]);
    setHasMore(true);
    await fetchLatestJobs({ page: 1 });
  }, [fetchLatestJobs]);

  useEffect(() => {
    if (autoFetch) {
      fetchLatestJobs();
    }
  }, [autoFetch, fetchLatestJobs]);

  return {
    latestJobs,
    loading,
    error,
    hasMore,
    totalCount,
    isInitialized,
    fetchLatestJobs,
    loadMore,
    refresh,
  };
}
