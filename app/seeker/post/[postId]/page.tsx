"use client";
import React, { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck, ArrowLeft } from "lucide-react";
import PostHeader from "@/components/common/PostHeader";
import JobPostView from "@/components/common/JobPostView";
import { JobPostData } from "@/types/jobPost";
import { useRouter } from "next/navigation";
import { apiGetData, apiPostData, apiDeleteData } from "@/utils/client/API";
import { API_URLS } from "@/constants/api";
import LoadingScreen from "@/components/common/LoadingScreen";
import { showErrorToast, showSuccessToast } from "@/utils/client/toastUtils";

interface Props {
  params: { postId: string };
}

const SeekerJobDetailPage: React.FC<Props> = ({ params }) => {
  const router = useRouter();
  const [jobDetails, setJobDetails] = useState<JobPostData | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loadingStates, setLoadingStates] = useState({
    jobDetails: false,
    bookmark: false,
    apply: false,
  });

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
      setJobDetails(data);
    } catch (error) {
      console.error("Error fetching job post:", error);
      // 에러 처리 - 404 페이지로 리다이렉트 또는 에러 표시
      router.push("/seeker");
    }
  };

  const fetchBookmarkStatus = async () => {
    try {
      // 북마크 상태 확인을 위해 사용자의 북마크 목록에서 확인
      const res = await fetch(`/api/seeker/bookmarks`);
      if (res.ok) {
        const data = await res.json();
        const bookmarkedJobs = data.data || [];
        const isBookmarked = bookmarkedJobs.some(
          (bookmark: any) => bookmark.job_post_id === parseInt(params.postId)
        );
        setIsBookmarked(isBookmarked);
      }
    } catch (error) {
      console.error("Error fetching bookmark status:", error);
    }
  };

  const handleBookmark = async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, bookmark: true }));

      if (isBookmarked) {
        // 북마크 제거
        await apiDeleteData(API_URLS.JOB_POSTS.BOOKMARK(params.postId));
        setIsBookmarked(false);
      } else {
        // 북마크 추가
        await apiPostData(API_URLS.JOB_POSTS.BOOKMARK(params.postId), {});
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, bookmark: false }));
    }
  };

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

  const isInitialLoading = loadingStates.jobDetails;
  const isActionLoading = loadingStates.bookmark || loadingStates.apply;

  // 로딩 상태일 때
  if (isInitialLoading) {
    return <LoadingScreen message="Loading job post..." />;
  }

  // 메인 렌더링
  return (
    <div className="min-h-screen bg-gray-50 font-pretendard">
      {isActionLoading && <LoadingScreen overlay={true} message="Processing..." opacity="light" />}
      {/* Header */}
      <PostHeader
        leftIcon={<ArrowLeft className="w-5 h-5 text-gray-700" />}
        onClickLeft={handleBack}
        rightIcon={
          isBookmarked ? (
            <BookmarkCheck className="w-5 h-5 text-purple-600" />
          ) : (
            <Bookmark className="w-5 h-5 text-gray-700" />
          )
        }
        onClickRight={handleBookmark}
      />

      {/* Job Post Content */}
      {jobDetails && (
        <JobPostView
          jobData={jobDetails}
          mode="seeker"
          showApplyButton={true}
          onApply={handleApply}
        />
      )}
    </div>
  );
};

export default SeekerJobDetailPage;
