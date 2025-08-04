import { useQuery } from "@tanstack/react-query";
import { JobPostData, JobPostMapper, ApiJobPostDetailData } from "@/types/jobPost";
import { API_URLS } from "@/constants/api";
import { SEEKER_QUERY_KEYS } from "@/constants/queryKeys";
import { apiGetData } from "@/utils/client/API";

export const useSeekerJobDetail = (postId: string) => {
  return useQuery({
    queryKey: SEEKER_QUERY_KEYS.JOB_DETAIL(postId),
    queryFn: async (): Promise<JobPostData> => {
      const data = await apiGetData(API_URLS.JOB_POSTS.DETAIL(postId, "published"));
      if (!data) {
        throw new Error("No data received from API");
      }
      return JobPostMapper.fromDetailJobPost(data as ApiJobPostDetailData);
    },
    enabled: !!postId,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};
