"use client";

import React, { useMemo, useCallback, useEffect, useRef, useState } from "react";
import { InfiniteScrollLoader } from "@/components/common/InfiniteScrollLoader";
import { JobPostCard, JobPostCardSkeleton } from "@/app/seeker/components/JobPostCard";
import FilterDropdown from "@/app/seeker/components/FilterDropdown";
import { EmptyState } from "@/components/common/EmptyState";
import { useRouter } from "next/navigation";
import { useLatestJobsInfinite } from "@/hooks/seeker/useSeekerLatestJobs";
import { useFilterStore } from "@/stores/useFilterStore";
import { JobPostMapper } from "@/types/jobPost";
import { PAGE_URLS } from "@/constants/api";
import BackHeader from "@/components/common/BackHeader";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { workTypeFilter, locationFilter } from "@/constants/filterOptions";
import { Briefcase } from "lucide-react";
import { SCROLL_IDS } from "@/constants/scrollIds";

function LatestJobsPage() {
  const router = useRouter();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // 필터 상태 관리
  const { filters: currentFilters } = useFilterStore();

  // 스크롤 복원 훅 사용
  const { restoreScrollPosition, handleNavigateToDetail } = useScrollRestoration({
    pageId: SCROLL_IDS.SEEKER.LATEST,
    enabled: true,
    delay: 100,
  });

  // Latest Jobs 데이터
  const {
    jobs: latestJobs,
    isLoading: latestLoading,
    hasMore: latestHasMore,
    loadMore: loadMoreLatest,
    error: latestError,
    isLoadMoreLoading: isFetchingNextPage,
  } = useLatestJobsInfinite(currentFilters);

  // API 응답을 JobPostCard로 변환
  const filteredLatestJobs = useMemo(() => {
    if (!Array.isArray(latestJobs) || latestJobs.length === 0) return [];

    return latestJobs
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
  }, [latestJobs]);

  // 클라이언트 사이드 렌더링 확인
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsHydrated(true);
    }
  }, []);

  // 데이터 로딩 완료 후 스크롤 위치 복원
  useEffect(() => {
    if (isHydrated && !latestLoading && latestJobs.length > 0) {
      const timer = setTimeout(() => {
        restoreScrollPosition();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isHydrated, latestLoading, latestJobs.length, restoreScrollPosition]);

  // 스크롤 이벤트 리스너
  useEffect(() => {
    if (!isHydrated) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      // 상세 페이지에서 뒤로 왔을 때는 스크롤 위치를 덮어쓰지 않음
      const isFromDetailPage = sessionStorage.getItem("from-detail-page") === "true";
      if (!isFromDetailPage) {
        sessionStorage.setItem("scroll-latest-jobs-window", scrollY.toString());
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHydrated]);

  // Intersection Observer 콜백
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && latestHasMore && !latestLoading && !isLoadingRef.current) {
        isLoadingRef.current = true;
        loadMoreLatest().finally(() => {
          isLoadingRef.current = false;
        });
      }
    },
    [latestHasMore, latestLoading, loadMoreLatest]
  );

  // Intersection Observer 설정
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

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

  // 상세 페이지 이동
  const handleViewJob = (id: string) => {
    // 상세 페이지로 이동할 때 스크롤 위치 저장
    handleNavigateToDetail();
    router.push(PAGE_URLS.SEEKER.POST.DETAIL(id));
  };

  const showSkeleton = latestLoading && latestJobs.length === 0;

  // 로딩 상태
  if (showSkeleton) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BackHeader title="Latest Opportunities" />
        <main className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Discover the newest job opportunities
            </h1>
            <p className="text-base lg:text-lg text-gray-600">
              Check out the newest job opportunities
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {[...Array(6)].map((_, i) => (
              <JobPostCardSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  // 에러 상태
  if (latestError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BackHeader title="Latest Opportunities" />
        <main className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Discover the newest job opportunities
            </h1>
            <p className="text-base lg:text-lg text-gray-600">
              Check out the newest job opportunities
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-red-600">Failed to load jobs. Please try again.</p>
            <button
              onClick={() => window.location.reload()}
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
    <div className="min-h-screen bg-gray-50" ref={mainRef}>
      <BackHeader title="Latest Opportunities" />

      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="sm:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Discover the newest job opportunities
          </h1>
          <p className="text-base lg:text-lg text-gray-600">
            Check out the newest job opportunities
          </p>
        </div>
        {/* Filters */}
        <div className="py-5 -mx-6 lg:-mx-8">
          <div className="flex gap-2 md:gap-4 overflow-x-auto py-2 scrollbar-hide px-6 lg:px-8">
            <FilterDropdown filter={workTypeFilter} />
            <FilterDropdown filter={locationFilter} />
          </div>
        </div>
        {/* Error Display */}
        {latestError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{latestError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Refresh
            </button>
          </div>
        )}
        {/* Latest Jobs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {filteredLatestJobs.map((job, index) => (
            <JobPostCard key={`latest-${job.id}-${index}`} job={job} onView={handleViewJob} />
          ))}
        </div>
        {/* 무한 스크롤 로딩 인디케이터 */}
        {isFetchingNextPage && <InfiniteScrollLoader />}
        {/* 무한 스크롤 트리거 요소 */}
        {latestHasMore && latestJobs.length > 0 && <div ref={loadingRef} className="h-10" />}
        {/* 결과가 없을 때 */}
        {filteredLatestJobs.length === 0 && !latestLoading && (
          <EmptyState
            icon={Briefcase}
            title="No jobs found"
            description="We couldn't find any latest jobs matching your current filters. Try adjusting your search criteria or clear all filters to see more opportunities."
            primaryAction={{
              label: "Clear All Filters",
              onClick: () => {
                useFilterStore.getState().resetFilters();
                window.location.reload();
              },
            }}
            secondaryAction={{
              label: "Refresh Results",
              onClick: () => window.location.reload(),
            }}
            size="lg"
          />
        )}
      </main>
    </div>
  );
}

export default LatestJobsPage;
