import { useInfiniteQuery } from "@tanstack/react-query";
import { API_URLS } from "@/constants/api";
import { SEEKER_QUERY_KEYS } from "@/constants/queryKeys";
import { JobPostData, JobPostMapper, ApiBookmarkedJobResponse } from "@/types/jobPost";
import { apiGetData } from "@/utils/client/API";

interface UseSeekerBookmarksOptions {
  limit?: number;
  autoFetch?: boolean;
}

interface UseSeekerBookmarksReturn {
  bookmarkedJobs: JobPostData[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  isLoadMoreLoading: boolean;
}

// API 함수
const fetchBookmarkedJobs = async (pageParam: number, limit: number) => {
  try {
    const response = await apiGetData(API_URLS.JOB_POSTS.BOOKMARKS, {
      page: pageParam,
      limit,
    });

    if (!response) {
      throw new Error("No response received from API");
    }

    // apiGetData는 response.data를 반환하므로, response.items와 response.pagination에 접근
    if (response && response.items && Array.isArray(response.items)) {
      const jobs = response.items
        .map((data: ApiBookmarkedJobResponse) => {
          try {
            return JobPostMapper.fromBookmarkedJobResponse(data);
          } catch (error) {
            console.warn("Failed to transform bookmarked job data:", error, data);
            return null;
          }
        })
        .filter((job: JobPostData | null): job is JobPostData => job !== null);

      return {
        jobs,
        currentPage: pageParam,
        hasMore: response.pagination?.hasNextPage || false,
        totalCount: response.pagination?.total || 0,
      };
    } else if (Array.isArray(response)) {
      // 이전 구조와의 호환성을 위해 배열인 경우도 처리
      const jobs = response
        .map((data: ApiBookmarkedJobResponse) => {
          try {
            return JobPostMapper.fromBookmarkedJobResponse(data);
          } catch (error) {
            console.warn("Failed to transform bookmarked job data:", error, data);
            return null;
          }
        })
        .filter((job: JobPostData | null): job is JobPostData => job !== null);

      return {
        jobs,
        currentPage: pageParam,
        hasMore: response.length === limit,
        totalCount: response.length,
      };
    } else {
      console.warn("Unexpected response format:", response);
      return {
        jobs: [],
        currentPage: pageParam,
        hasMore: false,
        totalCount: 0,
      };
    }
  } catch (error) {
    console.error("Failed to fetch bookmarked jobs:", error);
    throw error instanceof Error ? error : new Error("Unknown error occurred");
  }
};

export function useSeekerBookmarks({
  limit = 20,
  autoFetch = true,
}: UseSeekerBookmarksOptions = {}): UseSeekerBookmarksReturn {
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useInfiniteQuery({
      queryKey: SEEKER_QUERY_KEYS.BOOKMARKS(limit),
      queryFn: ({ pageParam }) => fetchBookmarkedJobs(pageParam, limit),
      getNextPageParam: (lastPage, allPages) =>
        lastPage.hasMore ? allPages.length + 1 : undefined,
      initialPageParam: 1,
      staleTime: 5 * 60 * 1000, // 5분간 신선한 데이터
      gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
      refetchOnWindowFocus: false,
      enabled: autoFetch,
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

  const bookmarkedJobs = data?.pages.flatMap((page) => page.jobs) || [];

  return {
    bookmarkedJobs,
    loading: isLoading,
    error: error as Error | null,
    hasMore: hasNextPage,
    loadMore: fetchNextPage,
    refresh: refetch,
    isLoadMoreLoading: isFetchingNextPage,
  };
}
