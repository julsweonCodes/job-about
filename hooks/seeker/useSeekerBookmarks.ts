import { useCallback } from "react";
import { API_URLS } from "@/constants/api";
import { JobPostData, JobPostMapper, ApiBookmarkedJobResponse } from "@/types/jobPost";
import { useSeekerPagination } from "./useSeekerPagination";

interface UseSeekerBookmarksOptions {
  limit?: number;
  autoFetch?: boolean;
}

interface UseSeekerBookmarksReturn {
  bookmarkedJobs: JobPostData[];
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
  // JobPostData 변환 함수
  const transformBookmarkedJob = useCallback((data: ApiBookmarkedJobResponse): JobPostData => {
    return JobPostMapper.fromBookmarkedJobResponse(data);
  }, []);

  const {
    data: bookmarkedJobs,
    loading,
    error,
    hasMore,
    totalCount,
    isInitialized,
    currentPage,
    fetchData: fetchBookmarkedJobs,
    loadMore,
    refresh,
    setPage,
  } = useSeekerPagination<JobPostData>({
    apiUrl: API_URLS.JOB_POSTS.BOOKMARKS,
    page: 1,
    limit,
    autoFetch,
    transformData: transformBookmarkedJob,
  });

  return {
    bookmarkedJobs: bookmarkedJobs || [],
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    isInitialized,
  };
}
