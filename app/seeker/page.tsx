"use client";

import React, { useMemo } from "react";
import { ProfileHeader } from "@/components/common/ProfileHeader";
import FilterDropdown from "@/app/seeker/components/FilterDropdown";
import { JobPostCard, JobPostCardSkeleton } from "@/app/seeker/components/JobPostCard";
import { EmptyState } from "@/components/common/EmptyState";
import { useRouter } from "next/navigation";
import { useLatestJobs } from "@/hooks/seeker/useSeekerLatestJobs";
import { useRecommendedJobs } from "@/hooks/seeker/useSeekerRecommendedJobs";
import { useFilterStore } from "@/stores/useFilterStore";
import { JobPostMapper, JobPostCardMapper } from "@/types/client/jobPost";
import { PAGE_URLS } from "@/constants/api";
import {
  workTypeFilter,
  jobTypeFilter,
  createLocationFilterFromData,
} from "@/constants/filterOptions";
import { Briefcase } from "lucide-react";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { SCROLL_IDS } from "@/constants/scrollIds";
import { useCommonData } from "@/hooks/useCommonData";

function SeekerPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = React.useState(false);
  const MAX_RECOMMENDED_JOBS = 4;
  const MAX_LATEST_JOBS = 6;

  // Hydration 완료 후 마운트 상태 설정
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // 스크롤 복원 로직 추가
  const { handleNavigateToDetail, restoreScrollPosition } = useScrollRestoration({
    pageId: SCROLL_IDS.SEEKER.HOME,
    enabled: true,
    delay: 100,
  });

  // 스크롤 복원 실행
  React.useEffect(() => {
    if (isMounted) {
      restoreScrollPosition();
    }
  }, [isMounted, restoreScrollPosition]);

  // 필터 상태 관리
  const { filters: currentFilters } = useFilterStore();
  const { locations } = useCommonData();

  // 동적 location 필터 생성
  const locationFilter = React.useMemo(() => {
    if (locations.length > 0) {
      return createLocationFilterFromData(locations);
    }
    // fallback: 기본 location 필터
    return {
      id: "location",
      label: "Location",
      iconType: "location" as const,
      options: [
        { key: "all", label: "All" },
        { key: "toronto", label: "Toronto" },
        { key: "mississauga", label: "Mississauga" },
      ],
    };
  }, [locations]);

  // 추천 공고 (AI 맞춤 추천)
  const {
    recommendedJobs,
    loading: recommendedLoading,
    refresh: refreshRecommended,
    isInitialized: recommendedInitialized,
  } = useRecommendedJobs(currentFilters, MAX_RECOMMENDED_JOBS + 1);

  // 최신 공고 (전체 최신 공고)
  const { jobs: latestJobs, isLoading: latestLoading } = useLatestJobs(
    currentFilters,
    MAX_LATEST_JOBS + 1
  );

  // 추천 공고를 JobPostCard 타입으로 변환
  const filteredRecommendedJobs = useMemo(() => {
    if (!Array.isArray(recommendedJobs) || recommendedJobs.length === 0) return [];

    return recommendedJobs
      .slice(0, MAX_RECOMMENDED_JOBS)
      .map((jobPostData) => {
        try {
          return JobPostCardMapper.fromJobPostData(jobPostData);
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
      .slice(0, MAX_LATEST_JOBS)
      .map((apiJobPost) => {
        try {
          // API 응답을 JobPostData로 변환
          const jobPostData = JobPostMapper.fromJobPost(apiJobPost);
          return JobPostCardMapper.fromJobPostData(jobPostData);
        } catch (error) {
          console.warn("Failed to convert latest job:", error);
          return null;
        }
      })
      .filter((job): job is NonNullable<typeof job> => job !== null);
  }, [latestJobs]);

  const handleViewJob = (id: string) => {
    // 상세 페이지로 이동하기 전에 스크롤 위치 저장
    handleNavigateToDetail();
    router.push(PAGE_URLS.SEEKER.POST.DETAIL(id));
  };

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
            <p className="text-base lg:text-lg text-gray-600">Discover your next opportunity</p>
          </div>

          {/* Filters */}
          <div className="py-5 md:py-8 -mx-6 lg:-mx-8">
            <div className="flex gap-2 md:gap-4 overflow-x-auto py-2 scrollbar-hide px-6 lg:px-8">
              <FilterDropdown filter={workTypeFilter} />
              <FilterDropdown filter={jobTypeFilter} />
              <FilterDropdown filter={locationFilter} />
            </div>
          </div>

          {/* 추천 공고 섹션 */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Recommended for You</h2>
              {!showRecommendedSkeleton && filteredRecommendedJobs.length > 0 && (
                <button
                  onClick={() => router.push(PAGE_URLS.SEEKER.RECOMMENDATIONS)}
                  className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
                >
                  Show More
                </button>
              )}
            </div>
            {showRecommendedSkeleton ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                {[...Array(MAX_RECOMMENDED_JOBS)].map((_, i) => (
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

          {/* Latest Jobs */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Latest Opportunities</h2>
            </div>
          </section>
          <section className="mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              {[...Array(4)].map((_, i) => (
                <JobPostCardSkeleton key={i} />
              ))}
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader />
      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
          <p className="text-base lg:text-lg text-gray-600">Discover your next opportunity</p>
        </div>

        {/* Filters */}
        <div className="py-5 md:py-8 -mx-6 lg:-mx-8">
          <div className="flex gap-2 md:gap-4 overflow-x-auto py-2 scrollbar-hide px-6 lg:px-8">
            <FilterDropdown filter={workTypeFilter} />
            <FilterDropdown filter={jobTypeFilter} />
            <FilterDropdown filter={locationFilter} />
          </div>
        </div>

        {/* 추천 공고 섹션 */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Recommended for You</h2>
            {!showRecommendedSkeleton && recommendedJobs.length > MAX_RECOMMENDED_JOBS && (
              <button
                onClick={() => router.push(PAGE_URLS.SEEKER.RECOMMENDATIONS)}
                className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
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
                  description="We're working on finding the perfect jobs for you. <br/> Check back later for personalized recommendations."
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

        {/* Latest Jobs */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Latest Opportunities</h2>
            {!showLatestSkeleton && latestJobs.length > MAX_LATEST_JOBS && (
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
              {[...Array(MAX_LATEST_JOBS)].map((_, i) => (
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
                  description="We couldn't find any jobs matching your current filters. <br/> Try adjusting your search criteria or clear all filters to see more opportunities."
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
