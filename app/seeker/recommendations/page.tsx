"use client";

import React, { useMemo, useCallback, useEffect, useRef } from "react";
import { MapPin, Briefcase } from "lucide-react";
import { ProfileHeader } from "@/components/common/ProfileHeader";
import { InfiniteScrollLoader } from "@/components/common/InfiniteScrollLoader";
import FilterDropdown from "@/app/seeker/components/FilterDropdown";
import { JobPostCard, JobPostCardSkeleton } from "@/app/seeker/components/JobPostCard";
import { WorkType } from "@/constants/enums";
import { useRouter } from "next/navigation";
import { useRecommendedJobs } from "@/hooks/seeker/useSeekerRecommendedJobs";
import { useFilterStore } from "@/stores/useFilterStore";
import {
  JobPost as ApiJobPost,
  JobPostCard as JobPostCardType,
  RecommendedJobPost,
} from "@/types/job";
import { STORAGE_URLS } from "@/constants/storage";
import { PAGE_URLS } from "@/constants/api";

function RecommendedJobsPage() {
  const router = useRouter();
  const { filters } = useFilterStore();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  // 추천 공고 (무한 스크롤)
  const {
    recommendedJobs,
    loading: recommendedLoading,
    error: recommendedError,
    hasMore: recommendedHasMore,
    loadMore: loadMoreRecommended,
    refresh: refreshRecommended,
    isInitialized: recommendedInitialized,
  } = useRecommendedJobs({
    limit: 10,
    autoFetch: true,
  });

  // 추천 공고를 JobPostCard 타입으로 변환
  const convertRecommendedToJobPostCard = (recommendedJob: RecommendedJobPost): JobPostCardType => {
    return {
      id: recommendedJob.id.toString(),
      title: recommendedJob.title,
      type: recommendedJob.jobType as WorkType,
      wage: recommendedJob.wage,
      location: recommendedJob.company.address,
      dateRange: "Recently", // 추천 공고는 최신순이므로
      businessName: recommendedJob.company.name,
      description: recommendedJob.description,
      applicants: recommendedJob.applicantCount,
      views: 0,
      logoImage: recommendedJob.company.logoUrl
        ? `${STORAGE_URLS.BIZ_LOC.PHOTO}${recommendedJob.company.logoUrl}`
        : undefined,
      requiredSkills: recommendedJob.requiredSkills,
    };
  };

  // 필터링된 추천 공고
  const filteredRecommendedJobs = useMemo(() => {
    if (!Array.isArray(recommendedJobs)) return [];

    return recommendedJobs
      .filter((job) => {
        // Job Type filter
        if (filters.jobType !== "all") {
          const jobTypeMap: Record<string, string> = {
            Remote: "REMOTE",
            OnSite: "ON_SITE",
            Hybrid: "HYBRID",
          };
          if (job.jobType !== jobTypeMap[filters.jobType]) {
            return false;
          }
        }

        // Search query filter
        if (
          filters.searchQuery &&
          !job.title.toLowerCase().includes(filters.searchQuery.toLowerCase())
        ) {
          return false;
        }

        return true;
      })
      .map(convertRecommendedToJobPostCard);
  }, [recommendedJobs, filters]);

  // 무한 스크롤 콜백
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && recommendedHasMore && !recommendedLoading) {
        loadMoreRecommended();
      }
    },
    [recommendedHasMore, recommendedLoading, loadMoreRecommended]
  );

  // Intersection Observer 설정
  useEffect(() => {
    if (loadingRef.current) {
      observerRef.current = new IntersectionObserver(handleIntersection, {
        root: null,
        rootMargin: "100px",
        threshold: 0.1,
      });

      observerRef.current.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection]);

  const handleViewJob = (id: string) => {
    router.push(PAGE_URLS.SEEKER.POST.DETAIL(id));
  };

  const showSkeleton =
    !recommendedInitialized || (recommendedLoading && recommendedJobs.length === 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader />

      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Recommended for You</h1>
          <p className="text-base lg:text-lg text-gray-600">
            AI-powered job recommendations based on your profile
          </p>
        </div>

        {/* Filters */}
        <div className="py-5 md:py-8 md:mb-8">
          <div className="flex flex-wrap gap-2 md:gap-4">
            <FilterDropdown
              filter={{
                id: "jobType",
                label: "Job Type",
                icon: <Briefcase className="w-4 h-4 md:w-5 md:h-5" />,
                options: ["all", "Remote", "OnSite", "Hybrid"],
              }}
            />
            <FilterDropdown
              filter={{
                id: "location",
                label: "Location",
                icon: <MapPin className="w-4 h-4 md:w-5 md:h-5" />,
                options: ["all"],
              }}
            />
          </div>
        </div>

        {/* Error Display */}
        {recommendedError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{recommendedError}</p>
            <button
              onClick={refreshRecommended}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Refresh
            </button>
          </div>
        )}

        {/* Recommended Jobs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {showSkeleton
            ? // 초기 로딩 스켈레톤
              [...Array(6)].map((_, i) => <JobPostCardSkeleton key={i} />)
            : // 실제 데이터
              filteredRecommendedJobs.map((job, index) => (
                <JobPostCard
                  key={`recommendations-${job.id}-${index}`}
                  job={job}
                  onView={handleViewJob}
                  isRecommended
                />
              ))}
        </div>

        {/* 무한 스크롤 로딩 인디케이터 */}
        {recommendedLoading && recommendedJobs.length > 0 && <InfiniteScrollLoader />}

        {/* 무한 스크롤 트리거 요소 */}
        <div ref={loadingRef} className="h-10" />

        {/* 결과가 없을 때 */}
        {!showSkeleton && filteredRecommendedJobs.length === 0 && !recommendedLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No recommended jobs found matching your criteria.
            </p>
            <button
              onClick={refreshRecommended}
              className="mt-4 text-purple-600 hover:text-purple-800 underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default RecommendedJobsPage;
