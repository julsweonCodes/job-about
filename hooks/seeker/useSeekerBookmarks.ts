import { useCallback, useEffect } from "react";
import { API_URLS } from "@/constants/api";
import { JobPostData, JobPostMapper, ApiBookmarkedJobResponse } from "@/types/jobPost";
import { useSeekerPagination } from "./useSeekerPagination";
import { useFilterStore } from "@/stores/useFilterStore";

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
  const { filters } = useFilterStore();

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
    autoFetch: false, // 필터 변경 시 수동으로 호출하도록 변경
    transformData: transformBookmarkedJob,
  });

  // 필터가 변경될 때마다 새로운 데이터 가져오기
  useEffect(() => {
    if (isInitialized) {
      // 필터 변경 시 첫 페이지부터 다시 시작
      fetchBookmarkedJobs({ page: 1 });
    }
  }, [filters.workType, filters.location, fetchBookmarkedJobs, isInitialized]);

  // 초기 로딩
  useEffect(() => {
    if (!isInitialized) {
      fetchBookmarkedJobs({ page: 1 });
    }
  }, [fetchBookmarkedJobs, isInitialized]);

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
