"use client";

import React, { useMemo } from "react";
import { MapPin, DollarSign, Briefcase } from "lucide-react";
import { ProfileHeader } from "@/components/common/ProfileHeader";
import FilterDropdown from "@/app/seeker/components/FilterDropdown";
import { JobPostCard, JobPostCardSkeleton } from "@/app/seeker/components/JobPostCard";
import { WorkType } from "@/constants/enums";
import { useRouter } from "next/navigation";
import { useLatestJobs } from "@/hooks/seeker/useSeekerLatestJobPosts";
import { useRecommendedJobs } from "@/hooks/seeker/useSeekerRecommendedJobs";
import { useFilterStore } from "@/stores/useFilterStore";
import {
  JobPost as ApiJobPost,
  JobPostCard as JobPostCardType,
  RecommendedJobPost,
} from "@/types/job";
import { STORAGE_URLS } from "@/constants/storage";

function SeekerPage() {
  const router = useRouter();
  const { filters } = useFilterStore();

  // 최신 공고 (전체 최신 공고)
  const {
    latestJobs,
    loading: latestLoading,
    error: latestError,
    hasMore: latestHasMore,
    loadMore: loadMoreLatest,
    refresh: refreshLatest,
    isInitialized: latestInitialized,
  } = useLatestJobs({
    limit: 20,
    autoFetch: true,
  });

  // 추천 공고 (AI 맞춤 추천)
  const {
    recommendedJobs,
    loading: recommendedLoading,
    error: recommendedError,
    hasMore: recommendedHasMore,
    loadMore: loadMoreRecommended,
    refresh: refreshRecommended,
    isInitialized: recommendedInitialized,
  } = useRecommendedJobs({
    limit: 6,
    autoFetch: true,
  });

  // API 데이터를 JobPostCard 타입으로 변환
  const convertToJobPostCard = (apiJob: ApiJobPost): JobPostCardType => {
    return {
      id: apiJob.id,
      title: apiJob.title,
      type: apiJob.work_type as WorkType,
      wage: apiJob.wage,
      location: "Location not specified", // API에서 location 필드가 없음
      dateRange: apiJob.daysAgo ? `${apiJob.daysAgo} days ago` : "Recently",
      businessName: "Company", // Placeholder, as business info might be limited in API response
      description: apiJob.description,
      applicants: apiJob.applicantCount || 0,
      views: 0, // Placeholder
      logoImage: apiJob.business_loc?.logo_url
        ? `${STORAGE_URLS.BIZ_LOC.PHOTO}${apiJob.business_loc?.logo_url}`
        : undefined, // Changed from coverImage
      requiredSkills: apiJob.requiredSkills, // required skills 추가
    };
  };

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
      requiredSkills: recommendedJob.requiredSkills, // required skills 추가
    };
  };

  // 필터링된 최신 공고
  const filteredLatestJobs = useMemo(() => {
    if (!Array.isArray(latestJobs)) return [];

    return latestJobs
      .filter((job) => {
        // Job Type filter
        if (filters.jobType !== "all") {
          const jobTypeMap: Record<string, string> = {
            Remote: "REMOTE",
            OnSite: "ON_SITE",
            Hybrid: "HYBRID",
          };
          if (job.work_type !== jobTypeMap[filters.jobType]) {
            return false;
          }
        }

        // Salary filter
        if (filters.salary !== "all" && job.wage !== filters.salary) {
          return false;
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
      .map(convertToJobPostCard);
  }, [latestJobs, filters]);

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

        // Salary filter
        if (filters.salary !== "all" && job.wage !== filters.salary) {
          return false;
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

  const handleViewJob = (id: string) => {
    router.push(`/seeker/post/${id}`);
  };

  const handleLoadMoreRecommended = () => {
    if (!recommendedLoading && recommendedHasMore) {
      loadMoreRecommended();
    }
  };

  const handleLoadMoreLatest = () => {
    if (!latestLoading && latestHasMore) {
      loadMoreLatest();
    }
  };

  const hasError = recommendedError || latestError;

  // 스켈레톤 표시 조건 수정
  const showRecommendedSkeleton =
    !recommendedInitialized || (recommendedLoading && recommendedJobs.length === 0);
  const showLatestSkeleton = !latestInitialized || (latestLoading && latestJobs.length === 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader />

      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
          <p className="text-base lg:text-lg text-gray-600">
            Discover opportunities that match your skills and interests
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
            <FilterDropdown
              filter={{
                id: "salary",
                label: "Salary",
                icon: <DollarSign className="w-4 h-4 md:w-5 md:h-5" />,
                options: ["all", "15.00", "18.00", "20.00", "100.00"],
              }}
            />
          </div>
        </div>

        {/* Error Display */}
        {hasError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{hasError}</p>
            <div className="mt-2 space-x-2">
              <button
                onClick={refreshRecommended}
                className="text-sm text-red-600 hover:text-red-800 underline"
              >
                Refresh Recommended
              </button>
              <button
                onClick={refreshLatest}
                className="text-sm text-red-600 hover:text-red-800 underline"
              >
                Refresh Latest
              </button>
            </div>
          </div>
        )}

        {/* Recommended Jobs */}
        {(filteredRecommendedJobs.length > 0 || showRecommendedSkeleton) && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Recommended for You</h2>
              {!showRecommendedSkeleton && recommendedJobs.length > 0 && (
                <button
                  onClick={handleLoadMoreRecommended}
                  disabled={recommendedLoading || !recommendedHasMore}
                  className="text-sm text-purple-600 hover:text-purple-800 disabled:opacity-50"
                >
                  {recommendedLoading ? "Loading..." : recommendedHasMore ? "Show More" : "No More"}
                </button>
              )}
            </div>
            {showRecommendedSkeleton ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                {[...Array(4)].map((_, i) => (
                  <JobPostCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                  {filteredRecommendedJobs.map((job) => (
                    <JobPostCard key={job.id} job={job} onView={handleViewJob} isRecommended />
                  ))}
                </div>
                {recommendedHasMore && (
                  <div className="text-center pt-6">
                    <button
                      onClick={handleLoadMoreRecommended}
                      disabled={recommendedLoading}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {recommendedLoading ? "Loading..." : "Load More Recommended"}
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        )}

        {/* Latest Jobs */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Latest Opportunities</h2>
            {!showLatestSkeleton && latestJobs.length > 0 && (
              <button
                onClick={handleLoadMoreLatest}
                disabled={latestLoading || !latestHasMore}
                className="text-sm text-purple-600 hover:text-purple-800 disabled:opacity-50"
              >
                {latestLoading ? "Loading..." : latestHasMore ? "Show More" : "No More"}
              </button>
            )}
          </div>
          {showLatestSkeleton ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {[...Array(6)].map((_, i) => (
                <JobPostCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {filteredLatestJobs.map((job) => (
                  <JobPostCard key={job.id} job={job} onView={handleViewJob} />
                ))}
              </div>
              {latestHasMore && (
                <div className="text-center pt-8">
                  <button
                    onClick={handleLoadMoreLatest}
                    disabled={latestLoading}
                    className="px-8 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {latestLoading ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
              {!latestLoading && filteredLatestJobs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
                  <button
                    onClick={refreshLatest}
                    className="mt-4 text-purple-600 hover:text-purple-800 underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default SeekerPage;
