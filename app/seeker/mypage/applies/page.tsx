"use client";

import React, { useMemo, useCallback, useEffect, useRef, useState } from "react";
import { Briefcase } from "lucide-react";
import BackHeader from "@/components/common/BackHeader";
import { JobPostCard, JobPostCardSkeleton } from "@/app/seeker/components/JobPostCard";
import { EmptyState } from "@/components/common/EmptyState";
import { InfiniteScrollLoader } from "@/components/common/InfiniteScrollLoader";
import { useRouter } from "next/navigation";
import { useSeekerAppliedJobs } from "@/hooks/seeker/useSeekerAppliedJobs";
import { JobPostCardMapper } from "@/types/client/jobPost";
import { PAGE_URLS } from "@/constants/api";
import { ApplicantStatus, JobPostCard as JobPostCardType } from "@/types/job";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { SCROLL_IDS } from "@/constants/scrollIds";
import { Chip } from "@/components/ui/Chip";
import { applicantStatusFilter } from "@/constants/filterOptions";
import { useAppliedFilterStore } from "@/stores/useAppliedFilterStore";

// getApplicationStatusConfig와 동일한 스타일 함수
const getStatusFilterStyle = (status: string) => {
  switch (status) {
    case ApplicantStatus.APPLIED:
      return "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200";
    case ApplicantStatus.IN_REVIEW:
      return "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200";
    case ApplicantStatus.HIRED:
      return "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200";
    case ApplicantStatus.REJECTED:
      return "bg-red-100 text-red-700 border-red-200 hover:bg-red-200";
    case ApplicantStatus.WITHDRAWN:
      return "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200";
  }
};

function SeekerAppliedPage() {
  const router = useRouter();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // 필터링 상태 (Zustand store 사용)
  const selectedStatus = useAppliedFilterStore((s) => s.status);
  const setSelectedStatus = useAppliedFilterStore((s) => s.setStatus);

  const { appliedJobs, loading, error, hasMore, loadMore, refresh, isLoadMoreLoading } =
    useSeekerAppliedJobs({
      limit: 10,
      autoFetch: true,
      status: selectedStatus === "all" ? undefined : (selectedStatus as ApplicantStatus),
    });

  // 스크롤 복원 훅 사용
  const { restoreScrollPosition, handleNavigateToDetail } = useScrollRestoration({
    pageId: SCROLL_IDS.SEEKER.APPLIES,
    enabled: true,
    delay: 100,
  });

  const convertedJobs = useMemo(() => {
    if (!appliedJobs || appliedJobs.length === 0) return [];

    // JobPostCard로 변환
    return appliedJobs.map(JobPostCardMapper.fromJobPostData);
  }, [appliedJobs]);

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

  // 필터 클릭 시 상태 저장(스토어)
  const handleStatusFilterChange = useCallback(
    (status: string) => {
      setSelectedStatus(status);
    },
    [setSelectedStatus]
  );

  // 클라이언트 사이드 렌더링 확인
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsHydrated(true);
    }
  }, []);

  // 데이터 로딩 완료 후 스크롤 위치 복원
  useEffect(() => {
    if (isHydrated && !loading && appliedJobs.length > 0) {
      const timer = setTimeout(() => {
        restoreScrollPosition();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isHydrated, loading, appliedJobs.length, restoreScrollPosition]);

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

  const showSkeleton = loading && appliedJobs.length === 0;

  // 로딩 상태
  if (showSkeleton) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BackHeader title="My Applications" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Check My Applications
                </h1>
              </div>
            </div>
          </div>

          {/* 필터 섹션 - 스켈레톤 상태에서는 비활성화 */}
          <div className="mt-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {applicantStatusFilter.map((option) => (
                <Chip
                  key={option.key}
                  size="md"
                  className={`transition-all duration-200 opacity-50 ${
                    selectedStatus === option.key
                      ? option.key === "all"
                        ? "bg-blue-100 text-blue-700 border-blue-200"
                        : getStatusFilterStyle(option.key)
                      : "bg-gray-100 text-gray-700 border-gray-200"
                  }`}
                  disabled
                >
                  {option.label}
                </Chip>
              ))}
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
        <BackHeader title="My Applications" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Check My Applications
                </h1>
              </div>
            </div>
          </div>
          <EmptyState
            icon={Briefcase}
            title="Something went wrong"
            description={error.message || "Failed to load your applications. Please try again."}
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
      <BackHeader title="My Applications" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Check My Applications
              </h1>
            </div>
          </div>
        </div>

        {/* 필터 섹션 - 항상 표시 */}
        <div className="mt-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {applicantStatusFilter.map((option) => (
              <Chip
                key={option.key}
                size="md"
                className={`cursor-pointer transition-all duration-200 ${
                  selectedStatus === option.key
                    ? option.key === "all"
                      ? "bg-blue-100 text-blue-700 border-blue-200"
                      : getStatusFilterStyle(option.key)
                    : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                }`}
                onClick={() => handleStatusFilterChange(option.key)}
              >
                {option.label}
              </Chip>
            ))}
          </div>
        </div>

        {/* 데이터가 있는 경우 */}
        {convertedJobs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {convertedJobs.map((job: JobPostCardType, index) => (
                <JobPostCard
                  key={`applied-${job.id}-${index}`}
                  job={job}
                  onView={() => handleViewJob(job.id)}
                />
              ))}
            </div>
            {/* 무한 스크롤 로딩 인디케이터 */}
            {isLoadMoreLoading && <InfiniteScrollLoader />}
            {/* 무한 스크롤 트리거 요소 */}
            {hasMore && appliedJobs.length > 0 && <div ref={loadingRef} className="h-10" />}
          </>
        ) : selectedStatus !== "all" ? (
          /* 필터링된 결과가 없는 경우 */
          <EmptyState
            icon={Briefcase}
            title={`No ${selectedStatus.replace("_", " ")} applications`}
            description={`You don't have any ${selectedStatus.replace("_", " ")} applications. Try selecting a different filter.`}
            primaryAction={{
              label: "Show All",
              onClick: () => handleStatusFilterChange("all"),
            }}
            size="md"
          />
        ) : (
          /* 데이터가 없는 경우 (빈 상태) */
          <EmptyState
            icon={Briefcase}
            title="No applications yet"
            description="You haven't applied to any jobs yet. Start exploring opportunities!"
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

export default SeekerAppliedPage;
