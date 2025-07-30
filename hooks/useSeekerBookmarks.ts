import { useCallback } from "react";
import { API_URLS } from "@/constants/api";
import { showErrorToast } from "@/utils/client/toastUtils";
import { apiGetData } from "@/utils/client/API";
import { JobPost } from "@/types/job";
import { usePagination } from "@/hooks/usePagination";
import { PaginationParams } from "@/types/hooks";

interface UseSeekerBookmarksOptions {
  limit?: number;
  autoFetch?: boolean;
}

interface UseSeekerBookmarksReturn {
  bookmarkedJobs: JobPost[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  isInitialized: boolean;
}

export function useSeekerBookmarks({
  limit = 10,
  autoFetch = true,
}: UseSeekerBookmarksOptions = {}): UseSeekerBookmarksReturn {
  const fetchBookmarkedJobs = useCallback(
    async (
      params: PaginationParams
    ): Promise<{
      data: JobPost[];
      totalCount: number;
      hasMore: boolean;
    }> => {
      const response = await apiGetData<{
        data: JobPost[];
        totalCount: number;
        hasMore: boolean;
      }>(API_URLS.JOB_POSTS.BOOKMARKS, params as any);

      if (!response) {
        return {
          data: [],
          totalCount: 0,
          hasMore: false,
        };
      }

      return {
        data: response.data,
        totalCount: response.totalCount,
        hasMore: response.hasMore,
      };
    },
    []
  );

  const {
    data: bookmarkedJobs,
    pagination,
    loading,
    error,
    isInitialized,
    loadMore,
    refresh,
  } = usePagination({
    initialLimit: limit,
    autoFetch,
    fetchFunction: fetchBookmarkedJobs,
  });

  return {
    bookmarkedJobs: bookmarkedJobs || [], // null일 경우 빈 배열 반환
    loading,
    error,
    hasMore: pagination.hasMore,
    loadMore,
    refresh,
    isInitialized,
  };
}
