import { useCallback } from "react";
import { API_URLS } from "@/constants/api";
import { showErrorToast } from "@/utils/client/toastUtils";
import { apiGetData } from "@/utils/client/API";
import { JobPost } from "@/types/job";
import { usePagination } from "@/hooks/usePagination";
import { PaginationParams } from "@/types/hooks";

interface UseSeekerAppliedJobsOptions {
  limit?: number;
  autoFetch?: boolean;
}

interface UseSeekerAppliedJobsReturn {
  appliedJobs: JobPost[] | null;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  isInitialized: boolean;
}

export const useSeekerAppliedJobs = (
  options: UseSeekerAppliedJobsOptions = {}
): UseSeekerAppliedJobsReturn => {
  const { limit = 20, autoFetch = true } = options;

  const fetchAppliedJobs = useCallback(async (params: PaginationParams) => {
    try {
      const response = await apiGetData<JobPost[]>(API_URLS.SEEKER.APPLY, {
        page: params.page,
        limit: params.limit,
      });

      // apiGetData는 이미 ServerResponse에서 data를 추출해줍니다
      if (Array.isArray(response)) {
        const processedJobs = response.map((job: any) => {
          return {
            ...job,
            id: job.job_post?.id || job.id,
            title: job.job_post?.title || job.title,
            description: job.job_post?.description || job.description,
            work_type: job.job_post?.work_type || job.work_type,
            wage: job.job_post?.wage || job.wage,
            business_loc: job.job_post?.business_loc || job.business_loc,
            created_at: job.job_post?.created_at || job.created_at,
            daysAgo: job.job_post?.daysAgo || job.daysAgo,
            applicantCount: job.job_post?.applicantCount || job.applicantCount,
          };
        });

        return {
          data: processedJobs,
          totalCount: processedJobs.length,
          hasMore: processedJobs.length === params.limit,
        };
      } else {
        console.warn("Response is not an array:", response);
        return {
          data: [],
          totalCount: 0,
          hasMore: false,
        };
      }
    } catch (err) {
      console.error("Error fetching applied jobs:", err);
      showErrorToast("Failed to load applied jobs");
      throw new Error("Failed to load applied jobs");
    }
  }, []);

  const {
    data: appliedJobs,
    pagination,
    loading,
    error,
    isInitialized,
    loadMore,
    refresh,
  } = usePagination({
    initialPage: 1,
    initialLimit: limit,
    autoFetch,
    fetchFunction: fetchAppliedJobs,
  });

  return {
    appliedJobs: appliedJobs || null, // null로 초기화
    loading,
    error,
    hasMore: pagination.hasMore,
    loadMore,
    refresh,
    isInitialized,
  };
};
