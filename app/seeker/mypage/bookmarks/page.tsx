"use client";

import React, { useMemo, useCallback } from "react";
import { Bookmark } from "lucide-react";
import BackHeader from "@/components/common/BackHeader";
import { JobPostCard, JobPostCardSkeleton } from "@/app/seeker/components/JobPostCard";
import { EmptyState } from "@/components/common/EmptyState";
import { useRouter } from "next/navigation";
import { useSeekerBookmarks } from "@/hooks/seeker/useSeekerBookmarks";
import { JobPostData } from "@/types/jobPost";
import { WorkType } from "@/constants/enums";
import { STORAGE_URLS } from "@/constants/storage";
import { PAGE_URLS } from "@/constants/api";
import { JobPostCard as JobPostCardType } from "@/types/job";

// 상수 분리
const DEFAULT_VALUES = {
  SKELETON_COUNT: 6,
} as const;

function SeekerBookmarksPage() {
  const router = useRouter();

  const { bookmarkedJobs, loading, error, hasMore, loadMore, refresh } = useSeekerBookmarks({
    limit: 20,
    autoFetch: true,
  });

  // JobPostData를 JobPostCard 타입으로 변환
  const convertJobPostDataToCard = (jobPost: JobPostData): JobPostCardType => {
    return {
      id: jobPost.id,
      title: jobPost.title,
      workType: jobPost.workType || ("on-site" as WorkType),
      wage: jobPost.hourlyWage,
      location: jobPost.businessLocInfo.address || "Location not specified",
      dateRange: "Recently", // 기본값
      businessName: jobPost.businessLocInfo.name,
      description: jobPost.jobDescription,
      applicants: jobPost.applicantCount || 0,
      views: 0,
      logoImage: jobPost.businessLocInfo.logoImg
        ? `${STORAGE_URLS.BIZ_LOC.PHOTO}${jobPost.businessLocInfo.logoImg}`
        : undefined,
      requiredSkills: jobPost.requiredSkills,
    };
  };

  const filteredBookmarkedJobs = useMemo(() => {
    if (!bookmarkedJobs || bookmarkedJobs.length === 0) {
      return [];
    }

    // JobPostCard 형태로 변환
    return bookmarkedJobs.map(convertJobPostDataToCard);
  }, [bookmarkedJobs]);

  const handleViewJob = useCallback(
    (id: string) => {
      router.push(PAGE_URLS.SEEKER.POST.DETAIL(id));
    },
    [router]
  );

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading) {
      loadMore();
    }
  }, [hasMore, loading, loadMore]);

  const handleRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  const handleBrowseJobs = useCallback(() => {
    router.push(PAGE_URLS.SEEKER.ROOT);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <BackHeader title="My Bookmarks" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">My Bookmarks</h1>
              {bookmarkedJobs && bookmarkedJobs.length > 0 && (
                <p className="text-slate-600 mt-1">you can check your bookmarks here</p>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {/* 초기 렌더링 시 스켈레톤 표시 (데이터가 없거나 로딩 중일 때) */}
          {(loading || !bookmarkedJobs || bookmarkedJobs.length === 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {Array.from({ length: DEFAULT_VALUES.SKELETON_COUNT }).map((_, index) => (
                <JobPostCardSkeleton key={index} />
              ))}
            </div>
          )}

          {/* 데이터가 있고 로딩이 완료된 경우에만 UI 표시 */}
          {!loading && bookmarkedJobs && bookmarkedJobs.length > 0 && (
            <>
              {/* 데이터가 있는 경우 */}
              {filteredBookmarkedJobs.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredBookmarkedJobs.map((job, index) => (
                      <JobPostCard
                        key={`bookmarked-${job.id}-${index}`}
                        job={job}
                        onView={() => handleViewJob(job.id)}
                      />
                    ))}
                  </div>
                  {hasMore && (
                    <div className="flex justify-center mt-8">
                      <button
                        onClick={handleLoadMore}
                        disabled={loading}
                        className="px-6 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
                      >
                        {loading ? "Loading..." : "Load More"}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                /* 데이터가 없는 경우 (빈 상태) */
                <EmptyState
                  icon={Bookmark}
                  title="No bookmarks yet"
                  description="You haven't bookmarked any jobs yet. Start exploring opportunities!"
                  primaryAction={{
                    label: "Browse Jobs",
                    onClick: handleBrowseJobs,
                  }}
                  size="md"
                />
              )}
            </>
          )}
        </div>

        {/* 에러 상태는 로딩 상태와 독립적으로 표시 */}
        {error && (
          <EmptyState
            icon={Bookmark}
            title="Something went wrong"
            description="Failed to load your bookmarks. Please try again."
            primaryAction={{
              label: "Try Again",
              onClick: handleRefresh,
              variant: "secondary",
            }}
            size="md"
            className="bg-red-50 rounded-lg"
          />
        )}
      </div>
    </div>
  );
}

export default SeekerBookmarksPage;
