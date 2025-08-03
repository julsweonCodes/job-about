import { useCallback } from "react";
import { JobPost } from "@/types/job";
import { API_URLS } from "@/constants/api";
import { WorkType } from "@/constants/enums";
import { Location } from "@/constants/location";
import { useSeekerPagination } from "./useSeekerPagination";

interface UseLatestJobsParams {
  workType?: WorkType;
  location?: Location;
  page?: number;
  limit?: number;
  autoFetch?: boolean;
}

interface UseLatestJobsReturn {
  latestJobs: JobPost[];
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
  autoFetch = true,
}: UseLatestJobsParams = {}): UseLatestJobsReturn {
  // JobPost 데이터 변환 함수
  const transformJobPost = useCallback((data: any): JobPost => {
    return {
      id: data.id,
      business_loc_id: data.business_loc_id,
      user_id: data.user_id,
      title: data.title,
      job_type: data.job_type,
      deadline: data.deadline,
      work_schedule: data.work_schedule,
      job_fit_type_id_1: data.job_fit_type_id_1,
      job_fit_type_id_2: data.job_fit_type_id_2,
      job_fit_type_id_3: data.job_fit_type_id_3,
      skill_id_1: data.skill_id_1,
      skill_id_2: data.skill_id_2,
      skill_id_3: data.skill_id_3,
      wage: data.wage,
      location: data.location,
      description: data.description,
      status: data.status,
      work_type: data.work_type,
      language_level: data.language_level,
      created_at: data.created_at,
      updated_at: data.updated_at,
      daysAgo: data.daysAgo,
      applicantCount: data.applicantCount,
      business_loc: data.business_loc,
      requiredSkills: data.requiredSkills,
    };
  }, []);

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
  } = useSeekerPagination<JobPost>({
    apiUrl: API_URLS.JOB_POSTS.ROOT,
    workType,
    location,
    page,
    limit,
    autoFetch,
    transformData: transformJobPost,
  });

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
