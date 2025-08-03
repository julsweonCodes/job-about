"use client";

import React, { useMemo } from "react";
import { MapPin, Briefcase } from "lucide-react";
import { ProfileHeader } from "@/components/common/ProfileHeader";
import FilterDropdown from "@/app/seeker/components/FilterDropdown";
import { JobPostCard, JobPostCardSkeleton } from "@/app/seeker/components/JobPostCard";
import { WorkType } from "@/constants/enums";
import { useRouter } from "next/navigation";
import { useLatestJobs } from "@/hooks/seeker/useSeekerLatestJobs";
import { useRecommendedJobs } from "@/hooks/seeker/useSeekerRecommendedJobs";
import { useFilterStore } from "@/stores/useFilterStore";
import { JobPostCard as JobPostCardType, RecommendedJobPost } from "@/types/job";
import { JobPostData } from "@/types/jobPost";
import { STORAGE_URLS } from "@/constants/storage";
import { PAGE_URLS } from "@/constants/api";

function SeekerPage() {
  const router = useRouter();
  const { filters } = useFilterStore();

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

  // 최신 공고 (전체 최신 공고)
  const {
    latestJobs,
    loading: latestLoading,
    error: latestError,
    hasMore: latestHasMore,
    refresh: refreshLatest,
    isInitialized: latestInitialized,
  } = useLatestJobs({
    limit: 6,
    autoFetch: true,
  });

  // JobPostData를 JobPostCard 타입으로 변환 (공통 함수)
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
      views: 0, // 기본값
      logoImage: jobPost.businessLocInfo.logoImg
        ? `${STORAGE_URLS.BIZ_LOC.PHOTO}${jobPost.businessLocInfo.logoImg}`
        : undefined,
      requiredSkills: jobPost.requiredSkills,
    };
  };

  // 추천 공고를 JobPostCard 타입으로 변환 (기존 로직 유지)
  const convertRecommendedToJobPostCard = (recommendedJob: RecommendedJobPost): JobPostCardType => {
    return {
      id: recommendedJob.id.toString(),
      title: recommendedJob.title,
      workType: recommendedJob.jobType as WorkType,
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
        // Work Type filter
        if (filters.workType !== "all") {
          const workTypeMap: Record<string, WorkType> = {
            Remote: WorkType.REMOTE,
            OnSite: WorkType.ON_SITE,
            Hybrid: WorkType.HYBRID,
          };
          if (job.workType !== workTypeMap[filters.workType]) {
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
      .map(convertJobPostDataToCard);
  }, [latestJobs, filters]);

  // 필터링된 추천 공고
  const filteredRecommendedJobs = useMemo(() => {
    if (!Array.isArray(recommendedJobs)) return [];

    return recommendedJobs
      .filter((job) => {
        // Work Type filter
        if (filters.workType !== "all") {
          const workTypeMap: Record<string, string> = {
            Remote: "REMOTE",
            OnSite: "ON_SITE",
            Hybrid: "HYBRID",
          };
          if (job.jobType !== workTypeMap[filters.workType]) {
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

  const handleViewJob = (id: string) => {
    router.push(PAGE_URLS.SEEKER.POST.DETAIL(id));
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
                id: "workType",
                label: "Work Type",
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
              </>
            )}
          </section>
        )}

        {/* Latest Jobs */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Latest Opportunities</h2>
            {!showLatestSkeleton && latestJobs.length > 0 && latestHasMore && (
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
