import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { apiGetData } from "@/utils/client/API";
import { API_URLS } from "@/constants/api";
import { SEEKER_QUERY_KEYS } from "@/constants/queryKeys";
import { toPrismaLocation, toPrismaWorkType, toPrismaJobType } from "@/types/enumMapper";
import { WorkType } from "@/constants/enums";
import { Location } from "@/constants/location";
import { JobType } from "@/constants/jobTypes";

// 필터를 Prisma 타입으로 변환
const convertFiltersToPrisma = (filters: {
  workType: string;
  location: string;
  jobType: string;
}) => {
  const convertedFilters: any = {};

  // workType 변환
  if (filters.workType && filters.workType !== "all") {
    try {
      convertedFilters.work_type = toPrismaWorkType(filters.workType as WorkType);
    } catch (error) {
      console.error("Invalid workType filter:", filters.workType);
    }
  }

  // jobType 변환
  if (filters.jobType && filters.jobType !== "all") {
    convertedFilters.job_type = toPrismaJobType(filters.jobType as JobType);
  }

  // location 변환 (location은 그대로 사용)
  if (filters.location && filters.location !== "all") {
    convertedFilters.location = toPrismaLocation(filters.location as Location);
  }

  return convertedFilters;
};

// API 함수
const fetchLatestJobs = async (
  filters = { workType: "all", location: "all", jobType: "all" },
  limit = 10
) => {
  // 필터를 Prisma 타입으로 변환
  const prismaFilters = convertFiltersToPrisma(filters);

  try {
    const response = await apiGetData(API_URLS.SEEKER.POST.LATEST, {
      page: 1,
      limit,
      ...prismaFilters,
    });

    // apiGetData는 response.data를 반환하므로, response.items에 접근
    if (response && response.items && Array.isArray(response.items)) {
      return response.items;
    } else if (Array.isArray(response)) {
      // 이전 구조와의 호환성을 위해 배열인 경우도 처리
      return response;
    } else {
      console.warn("Unexpected API response structure:", response);
      return [];
    }
  } catch (error) {
    console.error("Error fetching latest jobs:", error);
    throw error;
  }
};

// React Query Hook (단순 버전)
export const useLatestJobs = (
  filters = { workType: "all", location: "all", jobType: "all" },
  limit = 10
) => {
  const {
    data: jobs,
    isLoading,
    error,
  } = useQuery({
    queryKey: SEEKER_QUERY_KEYS.LATEST_JOBS(filters, limit),
    queryFn: () => fetchLatestJobs(filters, limit),
    staleTime: 5 * 60 * 1000, // 5분간 신선한 데이터
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
    refetchOnWindowFocus: false, // 윈도우 포커스 시 재요청 안함
  });

  return {
    jobs: jobs || [],
    isLoading,
    error,
    hasMore: false,
    loadMore: () => {},
    isLoadMoreLoading: false,
  };
};

// 무한 스크롤용 Hook (별도로 제공)
export const useLatestJobsInfinite = (
  filters = { workType: "all", location: "all", jobType: "all" }
) => {
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      enabled: true, // 명시적으로 활성화
      queryKey: SEEKER_QUERY_KEYS.LATEST_JOBS_INFINITE(filters),
      queryFn: ({ pageParam }) => {
        // 필터를 Prisma 타입으로 변환
        const prismaFilters = convertFiltersToPrisma(filters);

        return apiGetData(API_URLS.SEEKER.POST.LATEST, {
          page: pageParam,
          limit: 10,
          ...prismaFilters,
        })
          .then((res) => {
            // apiGetData는 response.data를 반환하므로, res.items와 res.pagination에 접근
            let jobs = [];
            let hasMore = false;
            let totalCount = 0;

            if (res && res.items && Array.isArray(res.items)) {
              jobs = res.items;
              hasMore = res.pagination?.hasNextPage || false;
              totalCount = res.pagination?.total || 0;
            } else if (Array.isArray(res)) {
              // 이전 구조와의 호환성을 위해 배열인 경우도 처리
              jobs = res;
              hasMore = jobs.length === 10;
              totalCount = jobs.length;
            } else {
              console.warn("Unexpected API response structure in infinite query:", res);
            }

            // 항상 일관된 객체 구조 반환
            return {
              jobs: jobs || [],
              currentPage: pageParam || 1,
              hasMore: Boolean(hasMore),
              totalCount: totalCount || 0,
            };
          })
          .catch((error) => {
            // 에러 발생 시 빈 결과 반환
            console.error("Failed to fetch latest jobs:", error);
            return {
              jobs: [],
              currentPage: pageParam || 1,
              hasMore: false,
              totalCount: 0,
            };
          });
      },
      getNextPageParam: (lastPage, allPages) => {
        // lastPage가 undefined이거나 hasMore가 false면 더 이상 페이지가 없음
        if (!lastPage || typeof lastPage !== "object") return undefined;
        if (lastPage.hasMore === false) return undefined;
        return allPages.length + 1;
      },
      initialPageParam: 1,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: (failureCount, error) => {
        // 네트워크 에러나 5xx 에러만 재시도
        if (failureCount >= 3) return false;
        if (error instanceof Error) {
          return (
            error.message.includes("network") ||
            error.message.includes("500") ||
            error.message.includes("502") ||
            error.message.includes("503")
          );
        }
        return true;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
  const jobs = data?.pages.flatMap((page) => page?.jobs || []) || [];
  return {
    jobs,
    isLoading,
    error,
    hasMore: hasNextPage,
    loadMore: fetchNextPage,
    isLoadMoreLoading: isFetchingNextPage,
  };
};
