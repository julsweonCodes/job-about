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
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { SCROLL_IDS } from "@/constants/scrollIds";

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

  // 스크롤 복원 훅 사용
  const { restoreScrollPosition, handleNavigateToDetail } = useScrollRestoration({
    pageId: SCROLL_IDS.SEEKER.BOOKMARKS,
    enabled: true,
    delay: 100,
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
      // 상세 페이지로 이동할 때 스크롤 위치 저장
      handleNavigateToDetail();
      router.push(PAGE_URLS.SEEKER.POST.DETAIL(id));
    },
    [router, handleNavigateToDetail]
  );

  const handleRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  const handleBrowseJobs = useCallback(() => {
    router.push(PAGE_URLS.SEEKER.ROOT);
  }, [router]);

  // 클라이언트 사이드 렌더링 확인
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsHydrated(true);
    }
  }, []);

  // 데이터 로딩 완료 후 스크롤 위치 복원
  useEffect(() => {
    if (isHydrated && !loading && bookmarkedJobs.length > 0) {
      const timer = setTimeout(() => {
        restoreScrollPosition();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isHydrated, loading, bookmarkedJobs.length, restoreScrollPosition]);

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
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Check My Bookmarks</h1>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
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
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Check My Bookmarks</h1>
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
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Check My Bookmarks</h1>
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
