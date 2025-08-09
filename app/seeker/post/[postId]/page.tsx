"use client";
import React, { useEffect } from "react";
import { Bookmark, ArrowLeft } from "lucide-react";
import PostHeader from "@/components/common/PostHeader";
import JobPostView from "@/components/common/JobPostView";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/common/LoadingScreen";
import { useDebounce } from "@/hooks/useDebounce";
import { useSeekerJobDetail } from "@/hooks/seeker/useSeekerJobDetail";
import { useSeekerBookmark } from "@/hooks/seeker/useSeekerBookmark";
import { useSeekerApply } from "@/hooks/seeker/useSeekerApply";
import { PAGE_URLS } from "@/constants/api";

interface Props {
  params: { postId: string };
}

const SeekerJobDetailPage: React.FC<Props> = ({ params }) => {
  const router = useRouter();

  // React Query hooks
  const { data: jobDetails, error } = useSeekerJobDetail(params.postId);
  const { toggleBookmark, isBookmarkLoading } = useSeekerBookmark(params.postId);
  const { apply, isApplying, isWithdrawing, withdraw } = useSeekerApply(params.postId);

  // 북마크 상태 (jobDetails에서 가져옴)
  const isBookmarked = jobDetails?.isBookmarked || false;

  // debounce된 북마크 함수 (300ms 지연)
  const debouncedToggleBookmark = useDebounce(() => toggleBookmark(isBookmarked), 300);

  const handleApply = () => {
    apply();
  };

  const handleWithdraw = () => {
    withdraw();
  };

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    if (error) {
      console.error("Error fetching job post:", error);
      router.push(PAGE_URLS.SEEKER.ROOT);
    }
  }, [error, router]);
  if (error) return null;

  const isActionLoading = isBookmarkLoading || isApplying || isWithdrawing;

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
        jobData={jobDetails || null}
        mode="seeker"
        showApplyButton={true}
        onApply={handleApply}
        onWithdraw={handleWithdraw}
      />
    </div>
  );
};

export default SeekerJobDetailPage;
