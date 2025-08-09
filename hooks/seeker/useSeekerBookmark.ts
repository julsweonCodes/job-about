import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URLS } from "@/constants/api";
import { SEEKER_QUERY_KEYS } from "@/constants/queryKeys";
import { apiPostData, apiDeleteData } from "@/utils/client/API";
import { showSuccessToast, showErrorToast } from "@/utils/client/toastUtils";

export const useSeekerBookmark = (postId: string) => {
  const queryClient = useQueryClient();

  const toggleBookmarkMutation = useMutation({
    mutationFn: async (isBookmarked: boolean) => {
      if (isBookmarked) {
        // 북마크 제거
        await apiDeleteData(API_URLS.SEEKER.POST.BOOKMARK(postId));
        return false;
      } else {
        // 북마크 추가
        await apiPostData(API_URLS.SEEKER.POST.BOOKMARK(postId), {});
        return true;
      }
    },
    onSuccess: (newBookmarkState) => {
      const message = newBookmarkState ? "Bookmark added" : "Bookmark removed";
      showSuccessToast(message);

      // 캐시 업데이트
      queryClient.setQueryData(SEEKER_QUERY_KEYS.JOB_DETAIL(postId), (oldData: any) => {
        if (oldData) {
          return { ...oldData, isBookmarked: newBookmarkState };
        }
        return oldData;
      });
    },
    onError: (error) => {
      const message = (error as Error).message || "Failed to toggle bookmark";
      showErrorToast(message);
    },
  });

  return {
    toggleBookmark: toggleBookmarkMutation.mutate,
    isBookmarkLoading: toggleBookmarkMutation.isPending,
    bookmarkError: toggleBookmarkMutation.error,
  };
};
