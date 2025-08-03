import { useState, useEffect, useCallback, useRef } from "react";
import { apiGetData } from "@/utils/client/API";
import { WorkType } from "@/constants/enums";
import { Location } from "@/constants/location";
import { toPrismaWorkType } from "@/types/enumMapper";

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

        // 파라미터 우선, 없으면 기본값 사용
        const finalWorkType = params?.workType || workType;
        const finalLocation = params?.location || location;
        const finalPage = params?.page || currentPage;
        const finalLimit = params?.limit || limit;

        if (finalWorkType) {
          queryParams.work_type = toPrismaWorkType(finalWorkType);
        }

        if (finalLocation) {
          queryParams.location = finalLocation;
        }

        queryParams.page = finalPage;
        queryParams.limit = finalLimit;

        const response = await apiGetData<any[]>(apiUrl, queryParams);

        if (response && Array.isArray(response)) {
          const newData = transformData ? response.map(transformData) : response;

          if (finalPage === 1) {
            // 첫 페이지면 전체 교체 (필터 변경 시)
            setData(newData);
            setCurrentPage(1);
          } else {
            // 추가 페이지면 중복 제거 후 추가
            setData((prev) => {
              const existingIds = new Set(prev.map((item: any) => item.id));
              const uniqueNewData = newData.filter((item: any) => !existingIds.has(item.id));
              return [...prev, ...uniqueNewData];
            });
            setCurrentPage(finalPage);
          }

          // hasMore는 현재 페이지의 데이터가 limit보다 적으면 false
          setHasMore(newData.length >= finalLimit);
          setTotalCount(newData.length || 0);
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
    [apiUrl, currentPage, limit, transformData]
  );

  const loadMore = useCallback(async () => {
    console.log("📡 loadMore called:", {
      loading,
      hasMore,
      currentPage,
      nextPage: currentPage + 1,
    });

    if (loading || !hasMore) {
      console.log("❌ loadMore skipped:", { loading, hasMore });
      return;
    }

    const nextPage = currentPage + 1;

    try {
      setLoading(true);
      setError(null);

      const queryParams: Record<string, any> = {
        page: nextPage,
        limit: limit,
      };

      // loadMore에서는 현재 설정된 workType과 location 사용
      if (workType) {
        queryParams.work_type = toPrismaWorkType(workType);
      }

      if (location) {
        queryParams.location = location;
      }

      console.log("📡 API call params:", queryParams);
      const response = await apiGetData<any[]>(apiUrl, queryParams);
      console.log("📡 API response:", {
        hasResponse: !!response,
        isArray: Array.isArray(response),
        responseLength: response?.length,
      });

      if (response && Array.isArray(response)) {
        const newData = transformData ? response.map(transformData) : response;
        console.log("🔄 Transformed data:", {
          originalLength: response.length,
          transformedLength: newData.length,
        });

        // 기존 데이터에 새로운 데이터 추가 (중복 제거)
        setData((prev) => {
          const existingIds = new Set(prev.map((item: any) => item.id));
          const uniqueNewData = newData.filter((item: any) => !existingIds.has(item.id));
          console.log("➕ Adding unique data:", {
            newDataLength: newData.length,
            uniqueNewDataLength: uniqueNewData.length,
            existingDataLength: prev.length,
            finalDataLength: prev.length + uniqueNewData.length,
          });
          return [...prev, ...uniqueNewData];
        });

        // hasMore는 현재 페이지의 데이터가 limit보다 적으면 false
        const newHasMore = newData.length >= limit;
        console.log("📊 Updated hasMore:", {
          newDataLength: newData.length,
          limit,
          newHasMore,
        });
        setHasMore(newHasMore);
        setCurrentPage(nextPage);
      } else {
        console.log("❌ API response invalid");
        setError("Failed to fetch data");
      }
    } catch (err) {
      console.error("❌ loadMore error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
      console.log("🔄 loadMore completed");
    }
  }, [loading, hasMore, currentPage, limit, apiUrl, workType, location, transformData]);

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
