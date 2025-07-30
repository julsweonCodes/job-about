"use client";
import React, { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck, ArrowLeft } from "lucide-react";
import PostHeader from "@/components/common/PostHeader";
import JobPostView from "@/components/common/JobPostView";
import { JobPostData } from "@/types/jobPost";
import { useRouter } from "next/navigation";
import { apiGet } from "@/utils/client/API";
import { API_URLS } from "@/constants/api";
import LoadingScreen from "@/components/common/LoadingScreen";

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
  });

  const initializeData = async () => {
    try {
      // 로딩 시작
      setLoadingStates({
        jobDetails: true,
        bookmark: false,
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
      const res = await apiGet(API_URLS.JOB_POSTS.DETAIL(params.postId, "published"));

      if (res.status === "success") {
        setJobDetails(res.data);
      } else {
        console.error("Failed to fetch job post:", res.message);
        // 에러 처리 - 404 페이지로 리다이렉트 또는 에러 표시
        router.push("/seeker");
      }
    } catch (error) {
      console.error("Error fetching job post:", error);
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
        const res = await fetch(`/api/job-posts/${params.postId}/bookmark`, {
          method: "DELETE",
        });

        if (res.ok) {
          setIsBookmarked(false);
        } else {
          console.error("Failed to remove bookmark");
        }
      } else {
        // 북마크 추가
        const res = await fetch(`/api/job-posts/${params.postId}/bookmark`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          setIsBookmarked(true);
        } else {
          console.error("Failed to add bookmark");
        }
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, bookmark: false }));
    }
  };

  const handleApply = async () => {
    try {
      const res = await fetch(`/api/job-posts/${params.postId}/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        // 지원 성공 처리
        alert("지원이 완료되었습니다!");
        router.push("/seeker/mypage");
      } else {
        const data = await res.json();
        alert(data.message || "지원에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      alert("지원 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleBack = () => {
    router.back();
  };

  const isLoading = Object.values(loadingStates).some((state) => state);

  // 로딩 상태일 때
  if (isLoading) {
    return <LoadingScreen message="Loading job post..." />;
  }

  // 메인 렌더링
  return (
    <div className="min-h-screen bg-gray-50 font-pretendard">
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
