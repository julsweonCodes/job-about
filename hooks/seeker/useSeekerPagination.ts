import { useState, useEffect, useCallback, useRef } from "react";
import { apiGetData } from "@/utils/client/API";
import { WorkType } from "@/constants/enums";
import { Location } from "@/constants/location";

interface UseSeekerPaginationParams<T> {
  apiUrl: string;
  workType?: WorkType;
  location?: Location;
  page?: number;
  limit?: number;
  autoFetch?: boolean;
  transformData?: (data: any) => T; // 데이터 변환 함수
}

interface UseSeekerPaginationReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  totalCount: number;
  isInitialized: boolean;
  currentPage: number;
  fetchData: (params?: Partial<UseSeekerPaginationParams<T>>) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  setPage: (page: number) => void;
}

export function useSeekerPagination<T>({
  apiUrl,
  workType,
  location,
  page = 1,
  limit = 10,
  autoFetch = true,
  transformData,
}: UseSeekerPaginationParams<T>): UseSeekerPaginationReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [isInitialized, setIsInitialized] = useState(false);
  const isInitialFetchRef = useRef(false); // 초기 fetch 중복 방지

  const fetchData = useCallback(
    async (params?: Partial<UseSeekerPaginationParams<T>>) => {
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

        const response = await apiGetData<any[]>(apiUrl, queryParams);

        if (response && Array.isArray(response)) {
          const newData = transformData ? response.map(transformData) : response;
          const targetPage = params?.page || currentPage;

          if (targetPage === 1) {
            // 첫 페이지면 전체 교체
            setData(newData);
          } else {
            // 추가 페이지면 중복 제거 후 추가
            setData((prev) => {
              const existingIds = new Set(prev.map((item: any) => item.id));
              const uniqueNewData = newData.filter((item: any) => !existingIds.has(item.id));
              return [...prev, ...uniqueNewData];
            });
          }

          // hasMore는 현재 페이지의 데이터가 limit보다 적으면 false
          setHasMore(newData.length >= (params?.limit || limit));
          setTotalCount(newData.length || 0);
          setCurrentPage(targetPage);
        } else {
          setError("Failed to fetch data");
          setData([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setData([]);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    },
    [apiUrl, workType, location, currentPage, limit, transformData]
  );

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    const nextPage = currentPage + 1;

    try {
      setLoading(true);
      setError(null);

      const queryParams: Record<string, any> = {
        page: nextPage,
        limit: limit,
      };

      if (workType) {
        queryParams.work_type = workType;
      }

      if (location) {
        queryParams.location = location;
      }

      const response = await apiGetData<any[]>(apiUrl, queryParams);

      if (response && Array.isArray(response)) {
        const newData = transformData ? response.map(transformData) : response;

        // 기존 데이터에 새로운 데이터 추가 (중복 제거)
        setData((prev) => {
          const existingIds = new Set(prev.map((item: any) => item.id));
          const uniqueNewData = newData.filter((item: any) => !existingIds.has(item.id));
          return [...prev, ...uniqueNewData];
        });

        // hasMore는 현재 페이지의 데이터가 limit보다 적으면 false
        setHasMore(newData.length >= limit);
        setCurrentPage(nextPage);
      } else {
        setError("Failed to fetch data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, currentPage, workType, location, limit, apiUrl, transformData]);

  const refresh = useCallback(async () => {
    setCurrentPage(1);
    setData([]);
    setHasMore(true);
    await fetchData({ page: 1 });
  }, [fetchData]);

  const setPage = useCallback(
    (page: number) => {
      fetchData({ page });
    },
    [fetchData]
  );

  useEffect(() => {
    if (autoFetch && !isInitialFetchRef.current) {
      isInitialFetchRef.current = true;
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return {
    data,
    loading,
    error,
    hasMore,
    totalCount,
    isInitialized,
    currentPage,
    fetchData,
    loadMore,
    refresh,
    setPage,
  };
}
