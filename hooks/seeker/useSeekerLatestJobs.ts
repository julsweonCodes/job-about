import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { apiGetData } from "@/utils/client/API";
import { API_URLS } from "@/constants/api";
import { toPrismaWorkType } from "@/types/enumMapper";
import { WorkType } from "@/constants/enums";

// 필터를 Prisma 타입으로 변환
const convertFiltersToPrisma = (filters: { workType: string; location: string }) => {
  const convertedFilters: any = {};

  // workType 변환
  if (filters.workType && filters.workType !== "all") {
    try {
      convertedFilters.work_type = toPrismaWorkType(filters.workType as WorkType);
    } catch (error) {
      console.error("Invalid workType filter:", filters.workType);
    }
  }

  // location 변환 (location은 그대로 사용)
  if (filters.location && filters.location !== "all") {
    convertedFilters.location = filters.location;
  }

  return convertedFilters;
};

// API 함수
const fetchLatestJobs = async (filters = { workType: "all", location: "all" }) => {
  // 필터를 Prisma 타입으로 변환
  const prismaFilters = convertFiltersToPrisma(filters);

  try {
    const response = await apiGetData(API_URLS.JOB_POSTS.ROOT, {
      page: 1,
      limit: 10,
      ...prismaFilters,
    });
    if (Array.isArray(response)) {
      return response;
    } else {
      return [];
    }
  } catch (error) {
    throw error;
  }
};

// React Query Hook (단순 버전)
export const useLatestJobs = (filters = { workType: "all", location: "all" }) => {
  const {
    data: jobs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["latest-jobs", filters],
    queryFn: () => fetchLatestJobs(filters),
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
export const useLatestJobsInfinite = (filters = { workType: "all", location: "all" }) => {
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["latest-jobs-infinite", filters],
      queryFn: ({ pageParam }) => {
        // 필터를 Prisma 타입으로 변환
        const prismaFilters = convertFiltersToPrisma(filters);

        return apiGetData(API_URLS.JOB_POSTS.ROOT, {
          page: pageParam,
          limit: 10,
          ...prismaFilters,
        }).then((res) => ({
          jobs: res || [], // res is already the data array
          currentPage: pageParam,
          hasMore: res?.length === 10,
          totalCount: res.totalCount || 0, // totalCount might be missing if res is just the array
        }));
      },
      getNextPageParam: (lastPage, allPages) =>
        lastPage.hasMore ? allPages.length + 1 : undefined,
      initialPageParam: 1,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    });
  const jobs = data?.pages.flatMap((page) => page.jobs) || [];
  return {
    jobs,
    isLoading,
    error,
    hasMore: hasNextPage,
    loadMore: fetchNextPage,
    isLoadMoreLoading: isFetchingNextPage,
  };
};
