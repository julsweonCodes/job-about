"use client";

import React, { useMemo } from "react";
import FilterDropdown from "@/app/seeker/components/FilterDropdown";
import { JobPostCard, JobPostCardSkeleton } from "@/app/seeker/components/JobPostCard";
import { WorkType } from "@/constants/enums";
import { useRouter } from "next/navigation";
import { useRecommendedJobs } from "@/hooks/seeker/useSeekerRecommendedJobs";
import { useFilterStore } from "@/stores/useFilterStore";
import { JobPostMapper } from "@/types/jobPost";
import { PAGE_URLS } from "@/constants/api";
import BackHeader from "@/components/common/BackHeader";
import { workTypeFilter, locationFilterLimited } from "@/constants/filterOptions";

function RecommendedJobsPage() {
  const router = useRouter();
  const { filters } = useFilterStore();

  // 추천 공고
  const {
    recommendedJobs,
    loading: recommendedLoading,
    error: recommendedError,
    refresh: refreshRecommended,
    isInitialized: recommendedInitialized,
  } = useRecommendedJobs(filters, 10);

  // 필터링된 추천 공고
  const filteredRecommendedJobs = useMemo(() => {
    if (!Array.isArray(recommendedJobs)) return [];

    return recommendedJobs
      .filter((job) => {
        // Work Type filter
        if (filters.workType !== "all") {
          const workTypeMap: Record<string, WorkType> = {
            Remote: WorkType.REMOTE,
            "On-Site": WorkType.ON_SITE,
            Hybrid: WorkType.HYBRID,
          };
          // RecommendedJobPost에는 workType이 없으므로 jobType으로 비교
          const jobTypeToWorkType: Record<string, WorkType> = {
            REMOTE: WorkType.REMOTE,
            ON_SITE: WorkType.ON_SITE,
            HYBRID: WorkType.HYBRID,
          };
          if (jobTypeToWorkType[job.jobType] !== workTypeMap[filters.workType]) {
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
      .map((job) => JobPostMapper.convertRecommendedToJobPostCard(job));
  }, [recommendedJobs, filters]);

  const handleViewJob = (id: string) => {
    router.push(PAGE_URLS.SEEKER.POST.DETAIL(id));
  };

  const handleRefresh = () => {
    refreshRecommended();
  };

  const showSkeleton =
    !recommendedInitialized || (recommendedLoading && recommendedJobs.length === 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <BackHeader title="Recommended for You" />

      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            AI-powered job recommendations based on your profile
          </h1>
          <p className="text-base lg:text-lg text-gray-600">
            Discover jobs tailored to your skills and preferences
          </p>
        </div>

        {/* Filters */}
        <div className="py-5 md:py-8 md:mb-8">
          <div className="flex flex-wrap gap-2 md:gap-4">
            <FilterDropdown filter={workTypeFilter} />
            <FilterDropdown filter={locationFilterLimited} />
          </div>
        </div>

        {/* Error Display */}
        {recommendedError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{recommendedError}</p>
            <button
              onClick={handleRefresh}
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

        {/* 결과가 없을 때 */}
        {!showSkeleton && filteredRecommendedJobs.length === 0 && !recommendedLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No recommended jobs found matching your criteria.
            </p>
            <button
              onClick={handleRefresh}
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
