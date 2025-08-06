import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { apiGetData } from "@/utils/client/API";
import { ApiRecommendedJobResponse } from "@/types/jobPost";
import { API_URLS } from "@/constants/api";
import { SEEKER_QUERY_KEYS } from "@/constants/queryKeys";
import { toPrismaJobType, toPrismaLocation, toPrismaWorkType } from "@/types/enumMapper";
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
    convertedFilters.workType = toPrismaWorkType(filters.workType as WorkType);
  }

  // jobType 변환
  if (filters.jobType && filters.jobType !== "all") {
    convertedFilters.jobType = toPrismaJobType(filters.jobType as JobType);
  }

  // location 변환
  if (filters.location && filters.location !== "all") {
    convertedFilters.location = toPrismaLocation(filters.location as Location);
  }

  return convertedFilters;
};

// API 함수
const fetchRecommendedJobs = async (
  filters = { workType: "all", location: "all", jobType: "all" },
  limit = 4,
  page = 1
) => {
  // 필터를 Prisma 타입으로 변환
  const prismaFilters = convertFiltersToPrisma(filters);

  try {
    const response = await apiGetData<ApiRecommendedJobResponse>(API_URLS.RECOMMENDATIONS.JOBS, {
      page,
      limit,
      minScore: 0, // 기본값
      ...prismaFilters,
    });

    if (response && response.recommendations && Array.isArray(response.recommendations)) {
      return {
        jobs: response.recommendations,
        pagination: response.pagination,
        user: response.user,
        searchParams: response.searchParams,
      };
    } else {
      return {
        jobs: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalCount: 0,
          itemsPerPage: limit,
          hasNextPage: false,
          hasPrevPage: false,
          nextPage: null,
          prevPage: null,
        },
        user: null,
        searchParams: {
          limit,
          page: 1,
          minScore: 0,
          location: null,
          jobType: null,
          workType: null,
        },
      };
    }
  } catch (error) {
    console.error("Failed to fetch recommended jobs:", error);
    throw error;
  }
};

// React Query Hook (단순 버전)
export const useRecommendedJobs = (
  filters = { workType: "all", location: "all", jobType: "all" },
  limit = 4,
  page = 1
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: SEEKER_QUERY_KEYS.RECOMMENDED_JOBS(filters, limit, page),
    queryFn: () => fetchRecommendedJobs(filters, limit, page),
    staleTime: 5 * 60 * 1000, // 5분간 신선한 데이터
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
    refetchOnWindowFocus: false, // 윈도우 포커스 시 재요청 안함
  });

  const jobs = data?.jobs || [];
  const pagination = data?.pagination;
  const user = data?.user;

  return {
    recommendedJobs: jobs,
    loading: isLoading,
    error: error?.message || null,
    hasMore: pagination?.hasNextPage || false,
    totalCount: pagination?.totalCount || 0,
    currentPage: pagination?.currentPage || 1,
    totalPages: pagination?.totalPages || 0,
    user: user,
    searchParams: data?.searchParams,
    isInitialized: !isLoading,
    fetchRecommendedJobs: refetch,
    loadMore: () => {}, // 현재는 빈 함수, 향후 무한 스크롤 추가 시 구현
    refresh: refetch,
    setPage: () => {}, // 현재는 빈 함수, 향후 페이지네이션 추가 시 구현
    isLoadMoreLoading: false, // 현재는 항상 false, 향후 무한 스크롤 추가 시 변경
  };
};

// 무한 스크롤용 Hook
export const useRecommendedJobsInfinite = (
  filters = { workType: "all", location: "all", jobType: "all" },
  limit = 4
) => {
  // 필터를 직렬화하여 쿼리 키에 포함
  const serializedFilters = JSON.stringify(filters);

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      enabled: true, // 명시적으로 활성화
      queryKey: SEEKER_QUERY_KEYS.RECOMMENDED_JOBS_INFINITE(serializedFilters, limit),
      queryFn: ({ pageParam }) => {
        // 필터를 Prisma 타입으로 변환
        const prismaFilters = convertFiltersToPrisma(filters);

        return apiGetData<ApiRecommendedJobResponse>(API_URLS.RECOMMENDATIONS.JOBS, {
          page: pageParam,
          limit,
          minScore: 0,
          ...prismaFilters,
        })
          .then((response) => {
            if (response && response.recommendations && Array.isArray(response.recommendations)) {
              return {
                jobs: response.recommendations,
                currentPage: pageParam || 1,
                hasMore: response.pagination?.hasNextPage || false,
                totalCount: response.pagination?.totalCount || 0,
                pagination: response.pagination,
                user: response.user,
                searchParams: response.searchParams,
              };
            } else {
              return {
                jobs: [],
                currentPage: pageParam || 1,
                hasMore: false,
                totalCount: 0,
                pagination: {
                  currentPage: 1,
                  totalPages: 0,
                  totalCount: 0,
                  itemsPerPage: limit,
                  hasNextPage: false,
                  hasPrevPage: false,
                  nextPage: null,
                  prevPage: null,
                },
                user: null,
                searchParams: {
                  limit,
                  page: 1,
                  minScore: 0,
                  location: null,
                  jobType: null,
                  workType: null,
                },
              };
            }
          })
          .catch((error) => {
            // 에러 발생 시 빈 결과 반환
            console.error("Failed to fetch recommended jobs:", error);
            return {
              jobs: [],
              currentPage: pageParam || 1,
              hasMore: false,
              totalCount: 0,
              pagination: {
                currentPage: 1,
                totalPages: 0,
                totalCount: 0,
                itemsPerPage: limit,
                hasNextPage: false,
                hasPrevPage: false,
                nextPage: null,
                prevPage: null,
              },
              user: null,
              searchParams: {
                limit,
                page: 1,
                minScore: 0,
                location: null,
                jobType: null,
                workType: null,
              },
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
  const user = data?.pages[0]?.user || null;
  const pagination = data?.pages[data.pages.length - 1]?.pagination;
  const searchParams = data?.pages[data.pages.length - 1]?.searchParams;

  return {
    jobs,
    isLoading,
    error,
    hasMore: hasNextPage,
    loadMore: fetchNextPage,
    isLoadMoreLoading: isFetchingNextPage,
    user,
    pagination,
    searchParams,
    totalCount: pagination?.totalCount || 0,
    currentPage: pagination?.currentPage || 1,
    totalPages: pagination?.totalPages || 0,
  };
};
