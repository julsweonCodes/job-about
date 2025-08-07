"use client";

import React, { useMemo, useCallback, useEffect, useRef, useState } from "react";
import FilterDropdown from "@/app/seeker/components/FilterDropdown";
import { JobPostCard, JobPostCardSkeleton } from "@/app/seeker/components/JobPostCard";
import { useRouter } from "next/navigation";
import { useRecommendedJobsInfinite } from "@/hooks/seeker/useSeekerRecommendedJobs";
import { useFilterStore } from "@/stores/useFilterStore";
import { JobPostMapper, JobPostCardMapper } from "@/types/client/jobPost";
import { PAGE_URLS } from "@/constants/api";
import BackHeader from "@/components/common/BackHeader";
import { workTypeFilter, jobTypeFilter, locationFilter } from "@/constants/filterOptions";
import { InfiniteScrollLoader } from "@/components/common/InfiniteScrollLoader";
import { EmptyState } from "@/components/common/EmptyState";
import { Briefcase } from "lucide-react";

function RecommendedJobsPage() {
  const router = useRouter();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // 필터 상태 관리
  const { filters } = useFilterStore();

  // 추천 공고 (무한 스크롤)
  const {
    jobs: recommendedJobs,
    isLoading: recommendedLoading,
    hasMore: recommendedHasMore,
    loadMore: loadMoreRecommended,
    error: recommendedError,
    isLoadMoreLoading: isFetchingNextPage,
  } = useRecommendedJobsInfinite(filters, 10);

  // 클라이언트 사이드 렌더링 확인
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsHydrated(true);
    }
  }, []);

  // API에서 받은 데이터를 JobPostCard로 변환
  const recommendedJobCards = useMemo(() => {
    if (!Array.isArray(recommendedJobs)) return [];

    const cards = recommendedJobs
      .map((job) => JobPostCardMapper.fromRecommendedJobPost(job))
      .filter((job) => job !== null);

    return cards;
  }, [recommendedJobs]);

  // Intersection Observer 콜백
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (
        entry.isIntersecting &&
        recommendedHasMore &&
        !recommendedLoading &&
        !isLoadingRef.current
      ) {
        isLoadingRef.current = true;
        loadMoreRecommended().finally(() => {
          isLoadingRef.current = false;
        });
      }
    },
    [recommendedHasMore, recommendedLoading, loadMoreRecommended]
  );

  // Intersection Observer 설정
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (loadingRef.current && recommendedHasMore && !recommendedLoading && !isLoadingRef.current) {
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
  }, [recommendedHasMore, recommendedLoading, handleIntersection]);

  const handleViewJob = (id: string) => {
    router.push(PAGE_URLS.SEEKER.POST.DETAIL(id));
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const showSkeleton = recommendedLoading && recommendedJobs.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <BackHeader title="Recommended for You" />

      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            AI-powered job recommendations based on your profile
          </h1>
          <p className="text-base lg:text-lg text-gray-600">
            Discover jobs tailored to your skills and preferences
          </p>
        </div>

        {/* Filters */}
        <div className="py-5 md:py-8 -mx-6 lg:-mx-8">
          <div className="flex gap-2 md:gap-4 overflow-x-auto py-2 scrollbar-hide px-6 lg:px-8">
            <FilterDropdown filter={workTypeFilter} />
            <FilterDropdown filter={jobTypeFilter} />
            <FilterDropdown filter={locationFilter} />
          </div>
        </div>

        {/* Error Display */}
        {recommendedError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{recommendedError?.message || String(recommendedError)}</p>
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
              recommendedJobCards.map((job, index) => (
                <JobPostCard
                  key={`recommendations-${job.id}-${index}`}
                  job={job}
                  onView={handleViewJob}
                  isRecommended
                />
              ))}
        </div>

        {/* 무한 스크롤 로딩 인디케이터 */}
        {isFetchingNextPage && <InfiniteScrollLoader />}

        {/* 무한 스크롤 트리거 요소 */}
        {recommendedHasMore && recommendedJobs.length > 0 && (
          <div ref={loadingRef} className="h-10" />
        )}

        {/* 결과가 없을 때 */}
        {!showSkeleton && recommendedJobCards.length === 0 && !recommendedLoading && (
          <EmptyState
            icon={Briefcase}
            title="No recommended jobs found"
            description="We couldn't find any recommended jobs matching your current filters. Try adjusting your search criteria or clear all filters to see more opportunities."
            primaryAction={{
              label: "Clear All Filters",
              onClick: () => {
                useFilterStore.getState().resetFilters();
                window.location.reload();
              },
            }}
            secondaryAction={{
              label: "Refresh Results",
              onClick: handleRefresh,
            }}
            size="lg"
          />
        )}
      </main>
    </div>
  );
}

export default RecommendedJobsPage;
