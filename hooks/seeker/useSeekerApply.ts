import { useMutation } from "@tanstack/react-query";
import { API_URLS } from "@/constants/api";
import { apiPostData } from "@/utils/client/API";
import { showSuccessToast, showErrorToast } from "@/utils/client/toastUtils";

export const useSeekerApply = (postId: string) => {
  const applyMutation = useMutation({
    mutationFn: async () => {
      await apiPostData(API_URLS.SEEKER.POST.APPLY(postId), {});
    },
    onSuccess: () => {
      showSuccessToast("Application submitted successfully!");
    },
    onError: (error) => {
      const message = (error as Error).message || "Application failed. Please try again.";
      showErrorToast(message);
    },
  });

  // Withdraw placeholder (API to be implemented)
  const withdrawMutation = useMutation({
    mutationFn: async () => {
      // TODO: replace with actual endpoint when available
      // await apiDeleteData(API_URLS.SEEKER.POST.WITHDRAW(postId));
      throw new Error("Withdraw API not implemented yet");
    },
    onSuccess: () => {
      showSuccessToast("Application withdrawn successfully!");
    },
    onError: (error) => {
      const message = (error as Error).message || "Failed to withdraw application.";
      showErrorToast(message);
    },
  });

  return {
    apply: applyMutation.mutate,
    isApplying: applyMutation.isPending,
    applyError: applyMutation.error,

    withdraw: withdrawMutation.mutate,
    isWithdrawing: withdrawMutation.isPending,
    withdrawError: withdrawMutation.error,
  };
};
