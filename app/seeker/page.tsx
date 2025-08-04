"use client";

import React, { useMemo } from "react";
import { MapPin, Briefcase } from "lucide-react";
import { ProfileHeader } from "@/components/common/ProfileHeader";
import FilterDropdown from "@/app/seeker/components/FilterDropdown";
import { JobPostCard, JobPostCardSkeleton } from "@/app/seeker/components/JobPostCard";
import { EmptyState } from "@/components/common/EmptyState";
import { useRouter } from "next/navigation";
import { useLatestJobs } from "@/hooks/seeker/useSeekerLatestJobs";
import { useRecommendedJobs } from "@/hooks/seeker/useSeekerRecommendedJobs";
import { useFilterStore } from "@/stores/useFilterStore";
import { JobPostMapper } from "@/types/jobPost";
import { PAGE_URLS } from "@/constants/api";

function SeekerPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = React.useState(false);

  // Hydration 완료 후 마운트 상태 설정
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // 추천 공고 (AI 맞춤 추천)
  const {
    recommendedJobs,
    loading: recommendedLoading,
    error: recommendedError,
    hasMore: recommendedHasMore,
    refresh: refreshRecommended,
    isInitialized: recommendedInitialized,
  } = useRecommendedJobs({
    limit: 4,
    autoFetch: true,
  });

  // 필터 상태 관리
  const { filters: currentFilters } = useFilterStore();

  // 최신 공고 (전체 최신 공고)
  const {
    jobs: latestJobs,
    isLoading: latestLoading,
    error: latestError,
  } = useLatestJobs(currentFilters);

  // 추천 공고를 JobPostCard 타입으로 변환
  const filteredRecommendedJobs = useMemo(() => {
    if (!Array.isArray(recommendedJobs) || recommendedJobs.length === 0) return [];

    return recommendedJobs
      .slice(0, 4)
      .map((recommendedJob) => {
        try {
          return JobPostMapper.convertRecommendedToJobPostCard(recommendedJob);
        } catch (error) {
          console.warn("Failed to convert recommended job:", error);
          return null;
        }
      })
      .filter((job): job is NonNullable<typeof job> => job !== null);
  }, [recommendedJobs]);

  // 서버에서 필터링된 데이터를 그대로 사용 (최대 6개)
  const filteredLatestJobs = useMemo(() => {
    if (!Array.isArray(latestJobs) || latestJobs.length === 0) return [];

    return latestJobs
      .slice(0, 6)
      .map((apiJobPost) => {
        try {
          // API 응답을 JobPostData로 변환
          const jobPostData = JobPostMapper.fromLatestJobPost(apiJobPost);
          return JobPostMapper.convertJobPostDataToCard(jobPostData);
        } catch (error) {
          console.warn("Failed to convert latest job:", error);
          return null;
        }
      })
      .filter((job): job is NonNullable<typeof job> => job !== null);
  }, [latestJobs, latestLoading]);

  const handleViewJob = (id: string) => {
    router.push(PAGE_URLS.SEEKER.POST.DETAIL(id));
  };

  const hasError = recommendedError || (latestError ? latestError.message : null);

  // 스켈레톤 표시 조건 수정
  const showRecommendedSkeleton =
    !recommendedInitialized || (recommendedLoading && recommendedJobs.length === 0);
  const showLatestSkeleton = latestLoading || !Array.isArray(latestJobs);

  // 서버와 클라이언트에서 동일한 구조 렌더링, 내용만 숨기기
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProfileHeader />
        <main className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
            <p className="text-base lg:text-lg text-gray-600">
              Discover opportunities that match your skills and interests
            </p>
          </div>
          <div className="py-5 md:py-8 md:mb-8">
            <div className="flex flex-wrap gap-2 md:gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg">
                <div className="w-4 h-4 md:w-5 md:h-5 bg-gray-200 rounded animate-pulse" />
                <span className="text-sm font-medium text-gray-700">Work Type</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg">
                <div className="w-4 h-4 md:w-5 md:h-5 bg-gray-200 rounded animate-pulse" />
                <span className="text-sm font-medium text-gray-700">Location</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {[...Array(6)].map((_, i) => (
              <JobPostCardSkeleton key={`hydration-skeleton-${i}`} />
            ))}
          </div>
        </main>
      </div>
    );
  }

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
                id: "workType",
                label: "Work Type",
                icon: <Briefcase className="w-4 h-4 md:w-5 md:h-5" />,
                options: ["all", "on-site", "remote", "hybrid"],
              }}
            />
            <FilterDropdown
              filter={{
                id: "location",
                label: "Location",
                icon: <MapPin className="w-4 h-4 md:w-5 md:h-5" />,
                options: ["all", "Vancouver", "Toronto", "Montreal", "Calgary"],
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
                onClick={() => window.location.reload()}
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
              {!showRecommendedSkeleton && recommendedJobs.length > 0 && recommendedHasMore && (
                <button
                  onClick={() => router.push("/seeker/recommendations")}
                  className="text-sm text-purple-600 hover:text-purple-800"
                >
                  Show More
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
                  {filteredRecommendedJobs.map((job, index) => (
                    <JobPostCard
                      key={`recommended-${job.id}-${index}`}
                      job={job}
                      onView={handleViewJob}
                      isRecommended
                    />
                  ))}
                </div>

                {/* 추천 공고 빈 상태 */}
                {!recommendedLoading && filteredRecommendedJobs.length === 0 && (
                  <EmptyState
                    icon={Briefcase}
                    title="No recommendations yet"
                    description="We're working on finding the perfect jobs for you. Check back later for personalized recommendations."
                    primaryAction={{
                      label: "Refresh Recommendations",
                      onClick: refreshRecommended,
                    }}
                    size="md"
                    className="bg-purple-50 rounded-lg"
                  />
                )}
              </>
            )}
          </section>
        )}

        {/* Latest Jobs */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Latest Opportunities</h2>
            {!showLatestSkeleton && latestJobs.length > 6 && (
              <button
                onClick={() => router.push(PAGE_URLS.SEEKER.LATEST)}
                className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
              >
                Show More
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
                {filteredLatestJobs.map((job, index) => (
                  <JobPostCard
                    key={`home-latest-${job.id}-${index}`}
                    job={job}
                    onView={handleViewJob}
                  />
                ))}
              </div>

              {!latestLoading && filteredLatestJobs.length === 0 && (
                <EmptyState
                  icon={Briefcase}
                  title="No jobs found"
                  description="We couldn't find any jobs matching your current filters. Try adjusting your search criteria or clear all filters to see more opportunities."
                  primaryAction={{
                    label: "Clear All Filters",
                    onClick: () => {
                      useFilterStore.getState().resetFilters();
                    },
                  }}
                  secondaryAction={{
                    label: "Refresh Results",
                    onClick: () => window.location.reload(),
                  }}
                  size="lg"
                />
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default SeekerPage;
