"use client";

import React, { useMemo, useCallback, useEffect, useRef, useState } from "react";
import { MapPin, Briefcase } from "lucide-react";
import { InfiniteScrollLoader } from "@/components/common/InfiniteScrollLoader";
import { JobPostCard, JobPostCardSkeleton } from "@/app/seeker/components/JobPostCard";
import FilterDropdown from "@/app/seeker/components/FilterDropdown";
import { EmptyState } from "@/components/common/EmptyState";
import { WorkType } from "@/constants/enums";
import { useRouter } from "next/navigation";
import { useLatestJobsInfinite } from "@/hooks/seeker/useSeekerLatestJobs";
import { useFilterStore } from "@/stores/useFilterStore";

import { JobPostMapper } from "@/types/jobPost";
import { STORAGE_URLS } from "@/constants/storage";
import { PAGE_URLS } from "@/constants/api";
import BackHeader from "@/components/common/BackHeader";

// 필터 정의
const workTypeFilter = {
  id: "workType",
  label: "Work Type",
  icon: <Briefcase className="w-4 h-4 md:w-5 md:h-5" />,
  options: ["all", "on-site", "remote", "hybrid"],
};

const locationFilter = {
  id: "location",
  label: "Location",
  icon: <MapPin className="w-4 h-4 md:w-5 md:h-5" />,
  options: ["all", "Vancouver", "Toronto", "Montreal", "Calgary"],
};

function LatestJobsPage() {
  const router = useRouter();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // 필터 상태 관리
  const { filters: currentFilters } = useFilterStore();

  // Latest Jobs 데이터
  const {
    jobs: latestJobs,
    isLoading: latestLoading,
    hasMore: latestHasMore,
    loadMore: loadMoreLatest,
    error: latestError,
    isLoadMoreLoading: isFetchingNextPage,
  } = useLatestJobsInfinite(currentFilters);

  const restoreScrollPosition = useCallback(() => {
    if (typeof window === "undefined") return;
    const savedPosition = sessionStorage.getItem("scroll-latest-jobs-window");
    const isBackNavigation = sessionStorage.getItem("scroll-back-navigation");

    // 뒤로가기 플래그가 있으면 복원하지 않음 (브라우저 뒤로가기로 페이지를 벗어난 경우)
    if (isBackNavigation) {
      // 뒤로가기 플래그 제거
      sessionStorage.removeItem("scroll-back-navigation");
      return;
    }

    // 상세 페이지에서 뒤로 왔는지 확인
    const isFromDetailPage = sessionStorage.getItem("from-detail-page") === "true";

    // 상세 페이지에서 뒤로 왔고, 저장된 스크롤 위치가 있으면 복원
    if (isFromDetailPage && savedPosition) {
      const scrollY = parseInt(savedPosition, 10);
      if (!isNaN(scrollY) && scrollY > 0) {
        window.scrollTo(0, scrollY);
      }
      // 플래그 제거
      sessionStorage.removeItem("from-detail-page");
    }
  }, []);

  // 클라이언트 사이드 렌더링 확인
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsHydrated(true);
      // 브라우저 자동 스크롤 복원 비활성화
      // if ("scrollRestoration" in history) {
      //   history.scrollRestoration = "manual";
      // }
    }
  }, []);

  // 페이지 로드 시 스크롤 위치 복원
  useEffect(() => {
    if (isHydrated) {
      const savedPosition = sessionStorage.getItem("scroll-latest-jobs-window");
      const isBackNavigation = sessionStorage.getItem("scroll-back-navigation");

      // 뒤로가기 플래그가 있으면 복원하지 않음 (브라우저 뒤로가기로 페이지를 벗어난 경우)
      if (isBackNavigation) {
        sessionStorage.removeItem("scroll-back-navigation");
        return;
      }

      // 상세 페이지에서 뒤로 왔는지 확인
      const isFromDetailPage = sessionStorage.getItem("from-detail-page") === "true";

      // 상세 페이지에서 뒤로 왔고, 저장된 스크롤 위치가 있으면 복원
      if (isFromDetailPage && savedPosition) {
        const scrollY = parseInt(savedPosition, 10);
        if (!isNaN(scrollY) && scrollY > 0) {
          setTimeout(() => {
            window.scrollTo(0, scrollY);
          }, 100);
        }
        // 플래그 제거
        sessionStorage.removeItem("from-detail-page");
      }
    }
  }, [isHydrated]);

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

  // 데이터 변환
  const filteredLatestJobs = useMemo(() => {
    if (!Array.isArray(latestJobs)) return [];

    return latestJobs.map((apiJobPost) => {
      try {
        const jobPostData = JobPostMapper.fromLatestJobPost(apiJobPost);
        return JobPostMapper.convertJobPostDataToCard(jobPostData);
      } catch (error) {
        console.error("Error converting jobPost:", error, apiJobPost);
        return {
          id: apiJobPost.id || "unknown",
          title: apiJobPost.title || "Unknown Job",
          workType: "on-site" as WorkType,
          wage: apiJobPost.wage || 0,
          location: "Location not specified",
          dateRange: "Recently",
          businessName: "Unknown Company",
          description: apiJobPost.description || "No description available",
          applicants: apiJobPost.applicantCount || 0,
          views: 0,
          logoImage: apiJobPost.business_loc?.logo_url
            ? `${STORAGE_URLS.BIZ_LOC.PHOTO}${apiJobPost.business_loc.logo_url}`
            : undefined,
          requiredSkills: apiJobPost.requiredSkills || [],
        };
      }
    });
  }, [latestJobs]);

  // 무한 스크롤 콜백
  const handleIntersection = useCallback(
    async (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      if (!entry.isIntersecting || isLoadingRef.current || !latestHasMore || latestLoading) {
        return;
      }

      isLoadingRef.current = true;

      try {
        await loadMoreLatest();
      } catch (error) {
        console.error("Failed to load more jobs:", error);
      } finally {
        isLoadingRef.current = false;
      }
    },
    [latestHasMore, loadMoreLatest, latestLoading]
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
    const currentScrollY = window.scrollY;
    sessionStorage.setItem("scroll-latest-jobs-window", currentScrollY.toString());
    // 상세 페이지로 이동할 때 플래그 설정
    sessionStorage.setItem("from-detail-page", "true");
    router.push(PAGE_URLS.SEEKER.POST.DETAIL(id));
  };

  // 브라우저 내장 뒤로가기 버튼 감지
  useEffect(() => {
    const handlePopState = () => {
      // 즉시 스크롤을 맨 위로 이동
      window.scrollTo(0, 0);
      // 뒤로가기로 페이지를 벗어날 때 스크롤 초기화
      sessionStorage.removeItem("scroll-latest-jobs-window");
      // 뒤로가기 플래그 설정
      sessionStorage.setItem("scroll-back-navigation", "true");
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // 페이지 로드 시점에서 뒤로가기 감지
  useEffect(() => {
    // document.referrer를 사용해서 뒤로가기 감지
    const isBackFromDetailPage =
      document.referrer &&
      document.referrer.includes(PAGE_URLS.SEEKER.POST.DETAIL("")) &&
      window.location.href.includes(PAGE_URLS.SEEKER.LATEST);

    if (isBackFromDetailPage) {
      // 상세 페이지에서 뒤로가기로 돌아온 경우 스크롤 초기화
      sessionStorage.removeItem("scroll-latest-jobs-window");
    }
  }, []);

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
