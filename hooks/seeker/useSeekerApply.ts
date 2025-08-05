import { useMutation } from "@tanstack/react-query";
import { API_URLS } from "@/constants/api";
import { apiPostData } from "@/utils/client/API";
import { showSuccessToast, showErrorToast } from "@/utils/client/toastUtils";

export const useSeekerApply = (postId: string) => {
  const applyMutation = useMutation({
    mutationFn: async () => {
      await apiPostData(API_URLS.JOB_POSTS.APPLY(postId), {});
    },
    onSuccess: () => {
      showSuccessToast("Application submitted successfully!");
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
