import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URLS } from "@/constants/api";
import { apiPostData } from "@/utils/client/API";
import { showSuccessToast, showErrorToast } from "@/utils/client/toastUtils";
import { SEEKER_QUERY_KEYS } from "@/constants/queryKeys";

export const useSeekerApply = (postId: string) => {
  const queryClient = useQueryClient();

  const invalidateDetailAndLists = () => {
    // 상세 화면 갱신
    queryClient.invalidateQueries({ queryKey: SEEKER_QUERY_KEYS.JOB_DETAIL(postId) });
    // 지원 리스트(무한 스크롤) 갱신 - 모든 파라미터 조합에 대해 invalidate
    // 부분 일치 무효화가 동작하도록 베이스 키 사용
    queryClient.invalidateQueries({ queryKey: SEEKER_QUERY_KEYS.APPLIED_JOBS_BASE });
  };

  const applyMutation = useMutation({
    mutationFn: async () => {
      await apiPostData(API_URLS.SEEKER.POST.APPLY(postId), {});
    },
    onSuccess: () => {
      showSuccessToast("Application submitted successfully!");
      invalidateDetailAndLists();
    },
    onError: (error) => {
      const message = (error as Error).message || "Application failed. Please try again.";
      showErrorToast(message);
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: async () => {
      await apiPostData(API_URLS.SEEKER.POST.WITHDRAW(postId), {});
    },
    onSuccess: () => {
      showSuccessToast("Application withdrawn successfully!");
      invalidateDetailAndLists();
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
