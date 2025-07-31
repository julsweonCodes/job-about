import { useState, useCallback, useEffect } from "react";
import { PaginationParams, PaginationState } from "@/types/hooks";

interface UsePaginationOptions<T> {
  initialPage?: number;
  initialLimit?: number;
  autoFetch?: boolean;
  fetchFunction: (params: PaginationParams) => Promise<{
    data: T[];
    totalCount: number;
    hasMore: boolean;
  }>;
}

export interface UsePaginationReturn<T> {
  data: T[] | null; // null 허용
  pagination: PaginationState;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
  fetchPage: (page: number) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  goToPage: (page: number) => void;
}

export function usePagination<T>({
  initialPage = 1,
  initialLimit = 10,
  autoFetch = true,
  fetchFunction,
}: UsePaginationOptions<T>): UsePaginationReturn<T> {
  const [data, setData] = useState<T[] | null>(null); // null로 초기화
  const [loading, setLoading] = useState(autoFetch); // autoFetch가 true면 초기 로딩 상태
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: initialPage,
    totalPages: 0,
    totalCount: 0,
    hasMore: true,
  });

  const fetchPage = useCallback(
    async (page: number) => {
      try {
        setLoading(true);
        setError(null);

        const params: PaginationParams = {
          page,
          limit: initialLimit,
        };

        const result = await fetchFunction(params);

        const totalPages = Math.ceil(result.totalCount / initialLimit);

        // 첫 페이지인 경우 데이터 교체, 그 외에는 추가
        if (page === 1) {
          setData(result.data);
        } else {
          setData((prevData) => [...(prevData || []), ...result.data]);
        }

        setPagination({
          currentPage: page,
          totalPages,
          totalCount: result.totalCount,
          hasMore: result.hasMore,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        if (page === 1) {
          setData(null);
        }
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    },
    [fetchFunction, initialLimit]
  );

  const loadMore = useCallback(async () => {
    if (loading || !pagination.hasMore) return;

    const nextPage = pagination.currentPage + 1;
    await fetchPage(nextPage);
  }, [loading, pagination.hasMore, pagination.currentPage, fetchPage]);

  const refresh = useCallback(async () => {
    await fetchPage(initialPage);
  }, [fetchPage, initialPage]);

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= pagination.totalPages) {
        fetchPage(page);
      }
    },
    [fetchPage, pagination.totalPages]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchPage(initialPage);
    }
  }, [autoFetch, fetchPage, initialPage]);

  return {
    data: data, // null 상태 그대로 반환
    pagination,
    loading,
    error,
    isInitialized,
    fetchPage,
    loadMore,
    refresh,
    goToPage,
  };
}
