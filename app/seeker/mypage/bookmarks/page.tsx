"use client";

import React, { useMemo, useCallback, useEffect, useRef, useState } from "react";
import { Bookmark } from "lucide-react";
import BackHeader from "@/components/common/BackHeader";
import { JobPostCard, JobPostCardSkeleton } from "@/app/seeker/components/JobPostCard";
import { EmptyState } from "@/components/common/EmptyState";
import { InfiniteScrollLoader } from "@/components/common/InfiniteScrollLoader";
import { useRouter } from "next/navigation";
import { useSeekerBookmarks } from "@/hooks/seeker/useSeekerBookmarks";
import { JobPostMapper } from "@/types/jobPost";
import { PAGE_URLS } from "@/constants/api";
import { JobPostCard as JobPostCardType } from "@/types/job";

// 상수 분리
const DEFAULT_VALUES = {
  SKELETON_COUNT: 6,
  INTERSECTION_THRESHOLD: 0.1,
  INTERSECTION_ROOT_MARGIN: "100px",
} as const;

function SeekerBookmarksPage() {
  const router = useRouter();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const { bookmarkedJobs, loading, error, hasMore, loadMore, refresh, isLoadMoreLoading } =
    useSeekerBookmarks({
      limit: 20,
      autoFetch: true,
    });

  const filteredBookmarkedJobs = useMemo(() => {
    if (!bookmarkedJobs || bookmarkedJobs.length === 0) {
      return [];
    }

    // JobPostCard 형태로 변환
    return bookmarkedJobs.map(JobPostMapper.convertJobPostDataToCard);
  }, [bookmarkedJobs]);

  const handleViewJob = useCallback(
    (id: string) => {
      const currentScrollY = window.scrollY;
      sessionStorage.setItem("scroll-bookmarked-jobs-window", currentScrollY.toString());
      // 상세 페이지로 이동할 때 플래그 설정
      sessionStorage.setItem("from-detail-page", "true");
      router.push(PAGE_URLS.SEEKER.POST.DETAIL(id));
    },
    [router]
  );

  const handleRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  const handleBrowseJobs = useCallback(() => {
    router.push(PAGE_URLS.SEEKER.ROOT);
  }, [router]);

  // 스크롤 위치 복원 함수
  const restoreScrollPosition = useCallback(() => {
    if (typeof window === "undefined") return;
    const savedPosition = sessionStorage.getItem("scroll-bookmarked-jobs-window");
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
    }
  }, []);

  // 페이지 로드 시 스크롤 위치 복원
  useEffect(() => {
    if (isHydrated) {
      const savedPosition = sessionStorage.getItem("scroll-bookmarked-jobs-window");
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
    if (isHydrated && !loading && bookmarkedJobs.length > 0) {
      const timer = setTimeout(() => {
        restoreScrollPosition();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isHydrated, loading, bookmarkedJobs.length, restoreScrollPosition]);

  // 브라우저 내장 뒤로가기 버튼 감지
  useEffect(() => {
    const handlePopState = () => {
      // 즉시 스크롤을 맨 위로 이동
      window.scrollTo(0, 0);
      // 뒤로가기로 페이지를 벗어날 때 스크롤 초기화
      sessionStorage.removeItem("scroll-bookmarked-jobs-window");
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
      window.location.href.includes(PAGE_URLS.SEEKER.MYPAGE.BOOKMARKS);

    if (isBackFromDetailPage) {
      // 상세 페이지에서 뒤로가기로 돌아온 경우 스크롤 초기화
      sessionStorage.removeItem("scroll-bookmarked-jobs-window");
    }
  }, []);

  // Intersection Observer 콜백
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loading && !isLoadingRef.current) {
        isLoadingRef.current = true;
        loadMore();
        // React Query의 isLoadMoreLoading 상태를 사용하므로 별도로 false 설정할 필요 없음
      }
    },
    [hasMore, loading, loadMore]
  );

  // Intersection Observer 설정
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (loadingRef.current && hasMore && !loading && !isLoadingRef.current) {
      observerRef.current = new IntersectionObserver(handleIntersection, {
        root: null,
        rootMargin: DEFAULT_VALUES.INTERSECTION_ROOT_MARGIN,
        threshold: DEFAULT_VALUES.INTERSECTION_THRESHOLD,
      });
      observerRef.current.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [hasMore, loading, handleIntersection]);

  const showSkeleton = loading && bookmarkedJobs.length === 0;

  // 로딩 상태
  if (showSkeleton) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BackHeader title="My Bookmarks" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">My Bookmarks</h1>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Array.from({ length: DEFAULT_VALUES.SKELETON_COUNT }).map((_, index) => (
              <JobPostCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BackHeader title="My Bookmarks" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">My Bookmarks</h1>
              </div>
            </div>
          </div>
          <EmptyState
            icon={Bookmark}
            title="Something went wrong"
            description={error.message || "Failed to load your bookmarks. Please try again."}
            primaryAction={{
              label: "Try Again",
              onClick: handleRefresh,
              variant: "secondary",
            }}
            size="md"
            className="bg-red-50 rounded-lg"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BackHeader title="My Bookmarks" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">My Bookmarks</h1>
              {bookmarkedJobs && bookmarkedJobs.length > 0 && (
                <p className="text-slate-600 mt-1">you can check your bookmarks here</p>
              )}
            </div>
          </div>
        </div>

        {/* 데이터가 있는 경우 */}
        {filteredBookmarkedJobs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredBookmarkedJobs.map((job: JobPostCardType, index) => (
                <JobPostCard
                  key={`bookmarked-${job.id}-${index}`}
                  job={job}
                  onView={() => handleViewJob(job.id)}
                />
              ))}
            </div>
            {/* 무한 스크롤 로딩 인디케이터 */}
            {isLoadMoreLoading && <InfiniteScrollLoader />}
            {/* 무한 스크롤 트리거 요소 */}
            {hasMore && bookmarkedJobs.length > 0 && <div ref={loadingRef} className="h-10" />}
          </>
        ) : (
          /* 데이터가 없는 경우 (빈 상태) */
          <EmptyState
            icon={Bookmark}
            title="No bookmarks yet"
            description="You haven't bookmarked any jobs yet. Start exploring opportunities!"
            primaryAction={{
              label: "Browse Jobs",
              onClick: handleBrowseJobs,
            }}
            size="md"
          />
        )}
      </div>
    </div>
  );
}

export default SeekerBookmarksPage;
