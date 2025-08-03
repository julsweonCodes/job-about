"use client";

import React, { useMemo, useCallback, useEffect, useRef } from "react";
import { MapPin, Briefcase } from "lucide-react";
import { InfiniteScrollLoader } from "@/components/common/InfiniteScrollLoader";
import FilterDropdown from "@/app/seeker/components/FilterDropdown";
import { JobPostCard, JobPostCardSkeleton } from "@/app/seeker/components/JobPostCard";
import { EmptyState } from "@/components/common/EmptyState";
import { WorkType } from "@/constants/enums";
import { useRouter } from "next/navigation";
import { useLatestJobs } from "@/hooks/seeker/useSeekerLatestJobs";
import { useFilterStore } from "@/stores/useFilterStore";
import { JobPostCard as JobPostCardType } from "@/types/job";
import { JobPostData } from "@/types/jobPost";
import { STORAGE_URLS } from "@/constants/storage";
import { PAGE_URLS } from "@/constants/api";
import BackHeader from "@/components/common/BackHeader";

function LatestJobsPage() {
  const router = useRouter();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false); // 로딩 상태를 ref로 관리

  // Latest Jobs 데이터
  const {
    latestJobs,
    loading: latestLoading,
    hasMore: latestHasMore,
    loadMore: loadMoreLatest,
    error: latestError,
    refresh: refreshLatest,
    isInitialized: latestInitialized,
  } = useLatestJobs({
    limit: 10,
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

  // 서버에서 필터링된 데이터를 그대로 사용
  const filteredLatestJobs = useMemo(() => {
    if (!Array.isArray(latestJobs)) return [];
    return latestJobs.map(convertJobPostDataToCard);
  }, [latestJobs]);

  // 무한 스크롤 콜백 - 실무에서 중요한 부분
  const handleIntersection = useCallback(
    async (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      // 이미 로딩 중이거나 더 이상 데이터가 없으면 무시
      if (!entry.isIntersecting || isLoadingRef.current || !latestHasMore || latestLoading) {
        return;
      }

      // 로딩 상태 설정
      isLoadingRef.current = true;

      try {
        // 다음 페이지 로드
        await loadMoreLatest();
      } catch (error) {
        console.error("Failed to load more jobs:", error);
      } finally {
        // 로딩 완료 후 상태 리셋
        isLoadingRef.current = false;
      }
    },
    [latestHasMore, loadMoreLatest, latestLoading]
  );

  // Observer 설정 - 실무에서 안정적인 무한 스크롤
  useEffect(() => {
    // 기존 Observer 해제
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    // 조건이 맞으면 새로운 Observer 설정
    if (loadingRef.current && latestHasMore && !latestLoading && !isLoadingRef.current) {
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
        observerRef.current = null;
      }
    };
  }, [latestHasMore, latestLoading, handleIntersection]);

  const handleViewJob = (id: string) => {
    router.push(PAGE_URLS.SEEKER.POST.DETAIL(id));
  };

  const showSkeleton = !latestInitialized || (latestLoading && latestJobs.length === 0);

  if (latestError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BackHeader title="Latest Opportunities" />
        <main className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Latest Opportunities
            </h1>
            <p className="text-base lg:text-lg text-gray-600">
              Discover the newest job opportunities
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-red-600">Failed to load jobs. Please try again.</p>
            <button
              onClick={refreshLatest}
              className="mt-4 text-purple-600 hover:text-purple-800 underline"
            >
              Refresh
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BackHeader title="Latest Opportunities" />

      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Discover the newest job opportunities
          </h1>
          <p className="text-base lg:text-lg text-gray-600">
            Check out the newest job opportunities
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
                options: ["all", "Remote", "On-Site", "Hybrid"],
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
        {latestError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{latestError}</p>
            <button
              onClick={refreshLatest}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Refresh
            </button>
          </div>
        )}

        {/* Latest Jobs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {showSkeleton
            ? // 초기 로딩 스켈레톤
              [...Array(6)].map((_, i) => <JobPostCardSkeleton key={`skeleton-${i}`} />)
            : // 실제 데이터
              filteredLatestJobs.map((job, index) => (
                <JobPostCard key={`latest-${job.id}-${index}`} job={job} onView={handleViewJob} />
              ))}
        </div>

        {/* 무한 스크롤 로딩 인디케이터 */}
        {latestLoading && latestJobs.length > 0 && <InfiniteScrollLoader />}

        {/* 무한 스크롤 트리거 요소 */}
        {latestHasMore && <div ref={loadingRef} className="h-10" />}

        {/* 결과가 없을 때 */}
        {!showSkeleton && filteredLatestJobs.length === 0 && !latestLoading && (
          <EmptyState
            icon={Briefcase}
            title="No jobs found"
            description="We couldn't find any latest jobs matching your current filters. Try adjusting your search criteria or clear all filters to see more opportunities."
            primaryAction={{
              label: "Clear All Filters",
              onClick: () => {
                useFilterStore.getState().resetFilters();
                refreshLatest();
              },
            }}
            secondaryAction={{
              label: "Refresh Results",
              onClick: refreshLatest,
            }}
            size="lg"
          />
        )}
      </main>
    </div>
  );
}

export default LatestJobsPage;
