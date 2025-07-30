"use client";

import React, { useMemo, useCallback } from "react";
import { Bookmark } from "lucide-react";
import BackHeader from "@/components/common/BackHeader";
import { JobPostCard, JobPostCardSkeleton } from "@/app/seeker/components/JopPostCard";
import { WorkType } from "@/constants/enums";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSeekerBookmarks } from "@/hooks/useSeekerBookmarks";
import { useFilterStore } from "@/stores/useFilterStore";
import { JobPost as ApiJobPost, JobPostCard as JobPostCardType } from "@/types/job";
import { STORAGE_URLS } from "@/constants/storage";
import LoadingScreen from "@/components/common/LoadingScreen";
import { PAGE_URLS } from "@/constants/api";

// 상수 분리
const DEFAULT_VALUES = {
  LOCATION: "Location not specified",
  BUSINESS_NAME: "Company",
  VIEWS: 0,
  SKELETON_COUNT: 6,
} as const;

// 타입 정의
interface JobTypeMapping {
  [key: string]: string;
}

// 유틸리티 함수들을 컴포넌트 외부로 분리
const convertToJobPostCard = (apiJob: ApiJobPost): JobPostCardType => {
  return {
    id: apiJob.id,
    title: apiJob.title,
    type: apiJob.work_type as WorkType,
    wage: apiJob.wage,
    location: DEFAULT_VALUES.LOCATION,
    dateRange: apiJob.daysAgo ? `${apiJob.daysAgo} days ago` : "Recently",
    businessName: DEFAULT_VALUES.BUSINESS_NAME,
    description: apiJob.description,
    applicants: apiJob.applicantCount || 0,
    views: DEFAULT_VALUES.VIEWS,
    logoImage: apiJob.business_loc?.logo_url
      ? `${STORAGE_URLS.BIZ_LOC.PHOTO}${apiJob.business_loc.logo_url}`
      : undefined,
  };
};

const filterJobsByType = (job: ApiJobPost, jobType: string): boolean => {
  if (jobType === "all") return true;

  const jobTypeMap: JobTypeMapping = {
    Remote: "REMOTE",
    OnSite: "ON_SITE",
    Hybrid: "HYBRID",
  };

  return job.work_type === jobTypeMap[jobType];
};

const filterJobsByLocation = (job: ApiJobPost, location: string): boolean => {
  if (location === "all") return true;
  // Location filtering logic would go here
  // For now, we'll skip location filtering as it's not available in the API
  return true;
};

function SeekerBookmarksPage() {
  const router = useRouter();
  const { filters } = useFilterStore();

  const { bookmarkedJobs, loading, error, hasMore, loadMore, refresh } = useSeekerBookmarks({
    limit: 20,
    autoFetch: true,
  });

  const filteredBookmarkedJobs = useMemo(() => {
    if (!Array.isArray(bookmarkedJobs)) return [];
    return bookmarkedJobs
      .filter(
        (job) =>
          filterJobsByType(job, filters.jobType) && filterJobsByLocation(job, filters.location)
      )
      .map(convertToJobPostCard);
  }, [bookmarkedJobs, filters.jobType, filters.location]);

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
                <p className="text-slate-600 mt-1">
                  {filteredBookmarkedJobs.length} job
                  {filteredBookmarkedJobs.length !== 1 ? "s" : ""} bookmarked
                </p>
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
                    {filteredBookmarkedJobs.map((job) => (
                      <JobPostCard key={job.id} job={job} onView={() => handleViewJob(job.id)} />
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
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bookmark className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No bookmarks yet</h3>
                  <p className="text-slate-600 mb-6">
                    You haven't bookmarked any jobs yet. Start exploring opportunities!
                  </p>
                  <button
                    onClick={handleBrowseJobs}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200"
                  >
                    Browse Jobs
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* 에러 상태는 로딩 상태와 독립적으로 표시 */}
        {error && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bookmark className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Something went wrong</h3>
            <p className="text-slate-600 mb-4">Failed to load your bookmarks. Please try again.</p>
            <button
              onClick={handleRefresh}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SeekerBookmarksPage;
