import { useQuery } from "@tanstack/react-query";
import { JobPostData, JobPostMapper, ApiJobPostDetailData } from "@/types/client/jobPost";
import { API_URLS } from "@/constants/api";
import { SEEKER_QUERY_KEYS } from "@/constants/queryKeys";
import { apiGetData } from "@/utils/client/API";
import { useAuthStore } from "@/stores/useAuthStore";

export const useSeekerJobDetail = (postId: string) => {
  const userId = useAuthStore((s) => s.getUserId());

  return useQuery({
    queryKey: SEEKER_QUERY_KEYS.JOB_DETAIL(postId),
    queryFn: async (): Promise<JobPostData> => {
      const data = await apiGetData(
        API_URLS.SEEKER.POST.DETAIL(
          postId,
          "published",
          userId != null ? String(userId) : undefined
        )
      );
      if (!data) {
        throw new Error("No data received from API");
      }

      const jobPostData = JobPostMapper.fromDetailJobPost(data as ApiJobPostDetailData);
      return jobPostData;
    },
    enabled: !!postId && userId != null,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};
