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
      console.log("🔍 useSeekerBookmarks - API 호출 시작:", params);

      const response = await apiGetData<
        Array<{
          id: string;
          user_id: string;
          job_post_id: string;
          job_post: JobPost;
        }>
      >(API_URLS.JOB_POSTS.BOOKMARKS, params as any);

      console.log("📡 useSeekerBookmarks - API 응답:", response);

      if (!response || !Array.isArray(response)) {
        console.log("❌ useSeekerBookmarks - 응답이 없거나 배열이 아님");
        return {
          data: [],
          totalCount: 0,
          hasMore: false,
        };
      }

      // job_post 객체만 추출하여 JobPost 배열로 변환
      const jobPosts = response.map((item) => item.job_post);

      console.log("🔄 useSeekerBookmarks - 변환된 jobPosts:", jobPosts);

      const result = {
        data: jobPosts,
        totalCount: jobPosts.length, // 실제로는 API에서 totalCount를 받아야 하지만 현재는 배열 길이 사용
        hasMore: jobPosts.length === params.limit,
      };

      console.log("✅ useSeekerBookmarks - 최종 결과:", result);

      return result;
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

  console.log("🔍 useSeekerBookmarks - 훅 상태:", {
    bookmarkedJobs: bookmarkedJobs?.length,
    loading,
    error,
    isInitialized,
    hasMore: pagination.hasMore,
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
