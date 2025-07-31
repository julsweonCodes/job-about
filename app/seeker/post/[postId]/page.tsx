"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Bookmark, ArrowLeft } from "lucide-react";
import PostHeader from "@/components/common/PostHeader";
import JobPostView from "@/components/common/JobPostView";
import { JobPostData } from "@/types/jobPost";
import { useRouter } from "next/navigation";
import { apiGetData, apiPostData, apiDeleteData } from "@/utils/client/API";
import { API_URLS } from "@/constants/api";
import LoadingScreen from "@/components/common/LoadingScreen";
import { showErrorToast, showSuccessToast } from "@/utils/client/toastUtils";
import { useDebounce } from "@/hooks/useDebounce";

interface Props {
  params: { postId: string };
}

const SeekerJobDetailPage: React.FC<Props> = ({ params }) => {
  const router = useRouter();
  const [jobDetails, setJobDetails] = useState<JobPostData | null>(null);
  const [loadingStates, setLoadingStates] = useState({
    jobDetails: false,
    bookmark: false,
    apply: false,
  });

  // 북마크 상태 관리
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const [bookmarkError, setBookmarkError] = useState<string | null>(null);

  const initializeData = async () => {
    try {
      // 로딩 시작
      setLoadingStates({
        jobDetails: true,
        bookmark: false,
        apply: false,
      });

      // 모든 API 호출을 병렬로 실행
      await Promise.all([fetchJobDetails()]);
    } catch (error) {
      console.error("Error initializing job details:", error);
    } finally {
      // 로딩 완료
      setLoadingStates({
        jobDetails: false,
        bookmark: false,
        apply: false,
      });
    }
  };

  useEffect(() => {
    if (params.postId) {
      initializeData();
    }
  }, [params.postId]);

  const fetchJobDetails = async () => {
    try {
      // 올바른 API 호출 - status 파라미터를 함수에 직접 전달
      const data = await apiGetData(API_URLS.JOB_POSTS.DETAIL(params.postId, "published"));
      console.log("🔍 job details:", data);
      setJobDetails(data);

      // API 응답에서 isBookmarked 상태 설정
      if (data && typeof data.isBookmarked === "boolean") {
        setIsBookmarked(data.isBookmarked);
      }
    } catch (error) {
      console.error("Error fetching job post:", error);
      // 에러 처리 - 404 페이지로 리다이렉트 또는 에러 표시
      router.push("/seeker");
    }
  };

  // 북마크 토글 함수
  const toggleBookmark = useCallback(async () => {
    try {
      setIsBookmarkLoading(true);
      setBookmarkError(null);

      if (isBookmarked) {
        // 북마크 제거
        await apiDeleteData(API_URLS.JOB_POSTS.BOOKMARK(params.postId));
        setIsBookmarked(false);
        showSuccessToast("Bookmark removed");
      } else {
        // 북마크 추가
        await apiPostData(API_URLS.JOB_POSTS.BOOKMARK(params.postId), {});
        setIsBookmarked(true);
        showSuccessToast("Bookmark added");
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      setBookmarkError((error as Error).message || "Failed to toggle bookmark");
      showErrorToast((error as Error).message || "Failed to toggle bookmark");

      // 에러 발생 시 상태 롤백
      setIsBookmarked(!isBookmarked);
    } finally {
      setIsBookmarkLoading(false);
    }
  }, [isBookmarked, params.postId]);

  // debounce된 북마크 함수 (300ms 지연)
  const debouncedToggleBookmark = useDebounce(toggleBookmark, 300);

  const handleApply = async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, apply: true }));

      await apiPostData(API_URLS.JOB_POSTS.APPLY(params.postId), {});
      // 지원 성공 처리
      showSuccessToast("Application submitted successfully!");
    } catch (error) {
      showErrorToast((error as Error).message || "Application failed. Please try again.");
    } finally {
      setLoadingStates((prev) => ({ ...prev, apply: false }));
    }
  };

  const handleBack = () => {
    router.back();
  };

  const isActionLoading = isBookmarkLoading || loadingStates.apply;

  // 메인 렌더링
  return (
    <div className="min-h-screen bg-gray-50 font-pretendard">
      {isActionLoading && <LoadingScreen overlay={true} message="Processing..." opacity="light" />}
      {/* Header */}
      <PostHeader
        leftIcon={<ArrowLeft className="w-5 h-5 text-gray-700" />}
        onClickLeft={handleBack}
        rightIcon={
          jobDetails ? (
            isBookmarked ? (
              <Bookmark fill="currentColor" className="w-5 h-5 text-purple-600" />
            ) : (
              <Bookmark className="w-5 h-5 text-gray-700" />
            )
          ) : null
        }
        onClickRight={debouncedToggleBookmark}
      />

      {/* Job Post Content */}
      <JobPostView
        jobData={jobDetails}
        mode="seeker"
        showApplyButton={true}
        onApply={handleApply}
      />
    </div>
  );
};

export default SeekerJobDetailPage;
