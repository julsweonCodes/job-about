import { useQuery } from "@tanstack/react-query";
import { apiGetData } from "@/utils/client/API";
import { RecommendationResponse } from "@/types/job";
import { API_URLS } from "@/constants/api";
import { SEEKER_QUERY_KEYS } from "@/constants/queryKeys";

// 필터를 Prisma 타입으로 변환
const convertFiltersToPrisma = (filters: { workType: string; location: string }) => {
  const convertedFilters: any = {};

  // workType 변환
  // if (filters.workType && filters.workType !== "all") {
  //   convertedFilters.jobType = filters.workType;
  // }

  // location 변환
  if (filters.location && filters.location !== "all") {
    convertedFilters.location = filters.location;
  }

  return convertedFilters;
};

// API 함수 (현재는 페이지네이션 없음, 향후 확장 예정)
const fetchRecommendedJobs = async (filters = { workType: "all", location: "all" }, limit = 4) => {
  // 필터를 Prisma 타입으로 변환
  const prismaFilters = convertFiltersToPrisma(filters);

  try {
    const response = await apiGetData<RecommendationResponse>(API_URLS.RECOMMENDATIONS.JOBS, {
      // 향후 페이지네이션 추가 시 page 파라미터 추가 예정
      // page: 1,
      limit,
      ...prismaFilters,
    });

    if (response && response.recommendations && Array.isArray(response.recommendations)) {
      return {
        jobs: response.recommendations,
        // 향후 페이지네이션 추가 시 아래 필드들 활용 예정
        // currentPage: 1,
        // hasMore: false, // 현재는 항상 false
        totalCount: response.totalCount || 0,
      };
    } else {
      return {
        jobs: [],
        // currentPage: 1,
        // hasMore: false,
        totalCount: 0,
      };
    }
  } catch (error) {
    console.error("Failed to fetch recommended jobs:", error);
    throw error;
  }
};

// React Query Hook (현재는 단순 쿼리, 향후 무한 스크롤로 확장 예정)
export const useRecommendedJobs = (filters = { workType: "all", location: "all" }, limit = 4) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: SEEKER_QUERY_KEYS.RECOMMENDED_JOBS(filters, limit),
    queryFn: () => fetchRecommendedJobs(filters, limit),
    staleTime: 5 * 60 * 1000, // 5분간 신선한 데이터
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
    refetchOnWindowFocus: false, // 윈도우 포커스 시 재요청 안함
  });

  const jobs = data?.jobs || [];

  return {
    recommendedJobs: jobs,
    loading: isLoading,
    error: error?.message || null,
    hasMore: false, // 현재는 항상 false, 향후 페이지네이션 추가 시 변경
    totalCount: data?.totalCount || 0,
    isInitialized: !isLoading,
    currentPage: 1, // 현재는 항상 1, 향후 페이지네이션 추가 시 변경
    fetchRecommendedJobs: refetch,
    loadMore: () => {}, // 현재는 빈 함수, 향후 무한 스크롤 추가 시 구현
    refresh: refetch,
    setPage: () => {}, // 현재는 빈 함수, 향후 페이지네이션 추가 시 구현
    isLoadMoreLoading: false, // 현재는 항상 false, 향후 무한 스크롤 추가 시 변경
  };
};
