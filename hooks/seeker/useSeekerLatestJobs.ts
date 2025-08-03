import { useCallback, useEffect, useMemo, useRef } from "react";
import { JobPostData, JobPostMapper, ApiLatestJobPost } from "@/types/jobPost";
import { API_URLS } from "@/constants/api";
import { WorkType } from "@/constants/enums";
import { Location } from "@/constants/location";
import { useSeekerPagination } from "./useSeekerPagination";
import { useFilterStore } from "@/stores/useFilterStore";

interface UseLatestJobsParams {
  workType?: WorkType;
  location?: Location;
  page?: number;
  limit?: number;
  autoFetch?: boolean;
}

interface UseLatestJobsReturn {
  latestJobs: JobPostData[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  totalCount: number;
  isInitialized: boolean;
  currentPage: number;
  fetchLatestJobs: (params?: Partial<UseLatestJobsParams>) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  setPage: (page: number) => void;
}

export function useLatestJobs({
  workType,
  location,
  page = 1,
  limit = 10,
}: UseLatestJobsParams = {}): UseLatestJobsReturn {
  const { filters } = useFilterStore();
  const isInitialLoadRef = useRef(false);

  // 필터 스토어의 workType 문자열을 WorkType enum으로 변환
  const getWorkTypeFromFilter = useCallback((filterWorkType: string): WorkType | undefined => {
    if (filterWorkType === "all") return undefined;

    const workTypeMap: Record<string, WorkType> = {
      Remote: WorkType.REMOTE,
      "On-Site": WorkType.ON_SITE,
      Hybrid: WorkType.HYBRID,
    };

    return workTypeMap[filterWorkType];
  }, []);

  // 필터에서 workType 가져오기
  const filterWorkType = getWorkTypeFromFilter(filters.workType);

  // JobPostData 변환 함수
  const transformJobPost = useCallback((data: ApiLatestJobPost): JobPostData => {
    return JobPostMapper.fromLatestJobPost(data);
  }, []);

  // 현재 적용된 필터 계산 (메모이제이션)
  const currentFilters = useMemo(() => {
    return {
      workType: filterWorkType || workType,
      location: filters.location !== "all" ? (filters.location as Location) : location,
    };
  }, [filterWorkType, workType, filters.location, location]);

  // 안정적인 필터 값 (문자열로 변환하여 비교)
  const stableWorkType = currentFilters.workType || "all";
  const stableLocation = currentFilters.location || "all";

  const {
    data: latestJobs,
    loading,
    error,
    hasMore,
    totalCount,
    isInitialized,
    currentPage,
    fetchData: fetchLatestJobs,
    loadMore,
    refresh,
    setPage,
  } = useSeekerPagination<JobPostData>({
    apiUrl: API_URLS.JOB_POSTS.ROOT,
    workType: currentFilters.workType, // 현재 필터 적용
    location: currentFilters.location,
    page,
    limit,
    autoFetch: false, // 수동으로 첫 페이지 로드
    transformData: transformJobPost,
  });

  // 초기 로딩 및 필터 변경 시 데이터 리셋
  useEffect(() => {
    // 이미 로딩 중이면 무시
    if (isInitialLoadRef.current) {
      return;
    }

    isInitialLoadRef.current = true;

    const loadData = async () => {
      try {
        await fetchLatestJobs({
          page: 1,
          workType: currentFilters.workType,
          location: currentFilters.location,
        });
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        isInitialLoadRef.current = false;
      }
    };

    loadData();
  }, [stableWorkType, stableLocation]);

  return {
    latestJobs,
    loading,
    error,
    hasMore,
    totalCount,
    isInitialized,
    currentPage,
    fetchLatestJobs,
    loadMore,
    refresh,
    setPage,
  };
}
