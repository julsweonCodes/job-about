import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URLS } from "@/constants/api";
import { SEEKER_QUERY_KEYS } from "@/constants/queryKeys";
import { apiPostData } from "@/utils/client/API";
import { showSuccessToast, showErrorToast } from "@/utils/client/toastUtils";

export const useSeekerApply = (postId: string) => {
  const queryClient = useQueryClient();

  const applyMutation = useMutation({
    mutationFn: async () => {
      await apiPostData(API_URLS.JOB_POSTS.APPLY(postId), {});
    },
    onSuccess: () => {
      showSuccessToast("Application submitted successfully!");

      // Job Detail만 optimistic update (즉시 반영)
      queryClient.setQueryData(SEEKER_QUERY_KEYS.JOB_DETAIL(postId), (oldData: any) => {
        if (oldData) {
          return {
            ...oldData,
            applicantCount: (oldData.applicantCount || 0) + 1,
          };
        }
        return oldData;
      });
    },
    onError: (error) => {
      const message = (error as Error).message || "Application failed. Please try again.";
      showErrorToast(message);
    },
  });

  return {
    apply: applyMutation.mutate,
    isApplying: applyMutation.isPending,
    applyError: applyMutation.error,
  };
};
