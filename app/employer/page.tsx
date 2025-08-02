"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StatsCard, StatsCardSkeleton } from "./components/StatsCard";
import { JobPostCard, JobPostCardSkeleton } from "./components/JobPostCard";
import { AlertBanner } from "./components/AlertBanner";
import { TabComponent } from "./components/TabComponent";
import { ProfileHeader } from "../../components/common/ProfileHeader";
import { Plus } from "lucide-react";
import { Dashboard, JobPost } from "@/types/employer";
import { API_URLS, PAGE_URLS } from "@/constants/api";

type TabType = "active" | "drafts";

export default function EmployerDashboard() {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(true);
  const [dashboard, setDashboard] = useState<Dashboard>();
  const [activeJobPostList, setActiveJobPostList] = useState<JobPost[]>([]);
  const [draftJobPostList, setDraftJobPostList] = useState<JobPost[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("active");

  // 각 API 호출의 개별 상태
  const [loadingStates, setLoadingStates] = useState({
    dashboard: true,
    activeJobPostList: true,
    draftJobPostList: true,
  });

  const fetchDashboard = async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, dashboard: true }));
      const res = await fetch(API_URLS.EMPLOYER.DASHBOARD.ROOT);
      const data = await res.json();
      if (res.ok) {
        setDashboard(data.data);
      } else {
        console.error("Failed to fetch employer dashboard", data.error);
        setDashboard(undefined);
      }
    } catch (e) {
      console.error("Error fetching dashboard:", e);
      setDashboard(undefined);
    } finally {
      setLoadingStates((prev) => ({ ...prev, dashboard: false }));
    }
  };

  const fetchActiveJobPostList = async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, activeJobPostList: true }));
      const res = await fetch(API_URLS.EMPLOYER.DASHBOARD.JOBPOSTS);
      const data = await res.json();
      if (res.ok) {
        setActiveJobPostList(data.data || []);
      } else {
        console.error("Failed to fetch active job posts in dashboard page", data.error);
        setActiveJobPostList([]);
      }
    } catch (e) {
      console.error("Error fetching active job posts:", e);
      setActiveJobPostList([]);
    } finally {
      setLoadingStates((prev) => ({ ...prev, activeJobPostList: false }));
    }
  };

  // TODO: draft API 엔드포인트가 구현되면 수정 필요
  const fetchDraftJobPostList = async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, draftJobPostList: true }));
      // 임시로 active와 동일한 API 사용 (draft API가 구현되면 변경)
      const res = await fetch(API_URLS.EMPLOYER.DASHBOARD.JOBPOSTS);
      const data = await res.json();
      if (res.ok) {
        // 임시로 빈 배열 설정 (draft 데이터가 없으므로)
        setDraftJobPostList([]);
      } else {
        console.error("Failed to fetch draft job posts in dashboard page", data.error);
        setDraftJobPostList([]);
      }
    } catch (e) {
      console.error("Error fetching draft job posts:", e);
      setDraftJobPostList([]);
    } finally {
      setLoadingStates((prev) => ({ ...prev, draftJobPostList: false }));
    }
  };

  const initializeData = async () => {
    try {
      // 초기 로딩 상태 설정
      setLoadingStates({
        dashboard: true,
        activeJobPostList: true,
        draftJobPostList: true,
      });

      // 각 API 호출을 개별적으로 실행하여 하나가 실패해도 다른 것들이 영향을 받지 않도록 함
      await Promise.allSettled([
        fetchDashboard(),
        fetchActiveJobPostList(),
        fetchDraftJobPostList(),
      ]);
    } catch (error) {
      console.error("Error initializing dashboard:", error);
    }
  };

  useEffect(() => {
    initializeData();
  }, []);

  const handleViewJob = (id: string) => {
    // 상세 페이지 이동 등 구현
    router.push(PAGE_URLS.EMPLOYER.POST.DETAIL(id));
  };

  const handleViewApplicants = (id: string) => {
    // 지원자 목록 페이지 이동 등 구현
    router.push(PAGE_URLS.EMPLOYER.APPLICANTS(id));
  };

  // Empty State 컴포넌트
  const EmptyState = ({
    type,
    title,
    description,
    buttonText,
  }: {
    type: "active" | "draft";
    title: string;
    description: string;
    buttonText: string;
  }) => (
    <div className="text-center py-16 px-4">
      <div className="max-w-md mx-auto">
        {/* 아이콘 */}
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>

        {/* 텍스트 */}
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">{description}</p>

        {/* 버튼 */}
        <button
          onClick={() => router.push(PAGE_URLS.EMPLOYER.POST.CREATE)}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span>{buttonText}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <ProfileHeader />
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 relative">
        {/* Page Title */}
        <div className="pt-6 lg:pt-8 pb-6 lg:pb-8">
          <div className="text-center lg:text-left">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
            <p className="text-base lg:text-lg text-gray-600">
              Manage your job posts and track applications
            </p>
          </div>
        </div>

        {/* Alert Banner */}
        {showAlert && dashboard && dashboard.needsUpdateCnt > 0 && (
          <div className="mb-8">
            <AlertBanner
              message={`${dashboard.needsUpdateCnt} job posts need status updates`}
              onClick={() => {
                router.push(PAGE_URLS.EMPLOYER.PENDING_UPDATES);
              }}
            />
          </div>
        )}

        {/* Stats */}
        {loadingStates.dashboard ? (
          <div className="mb-10">
            <StatsCardSkeleton />
          </div>
        ) : dashboard ? (
          <div className="mb-10">
            <StatsCard
              activeJobs={dashboard.activeJobPostsCnt}
              activeApplicants={dashboard.allAppsCnt}
              statusUpdateNeeded={dashboard.needsUpdateCnt}
            />
          </div>
        ) : null}

        {/* Job Posts Section */}
        <div className="space-y-6 lg:space-y-8 pb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Your Job Posts</h2>
          </div>

          {/* Tabs */}
          <TabComponent
            tabs={[
              {
                id: "active",
                label: "Active Jobs",
                count: activeJobPostList.length,
              },
              {
                id: "drafts",
                label: "Drafts",
                count: draftJobPostList.length,
              },
            ]}
            activeTab={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId as TabType)}
          />

          {/* Active Jobs Tab */}
          {activeTab === "active" && (
            <>
              {loadingStates.activeJobPostList ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <JobPostCardSkeleton key={index} />
                  ))}
                </div>
              ) : activeJobPostList && activeJobPostList.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
                  {activeJobPostList.map((job) => (
                    <JobPostCard
                      key={job.id}
                      job={job}
                      onView={handleViewJob}
                      onViewApplicants={handleViewApplicants}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  type="active"
                  title="No active job posts"
                  description="Create your first job post to start finding great talent."
                  buttonText="Create your job post"
                />
              )}
            </>
          )}

          {/* Drafts Tab */}
          {activeTab === "drafts" && (
            <>
              {loadingStates.draftJobPostList ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <JobPostCardSkeleton key={index} />
                  ))}
                </div>
              ) : draftJobPostList && draftJobPostList.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
                  {draftJobPostList.map((job) => (
                    <JobPostCard
                      key={job.id}
                      job={job}
                      onView={handleViewJob}
                      onViewApplicants={handleViewApplicants}
                      isDraft={true}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  type="draft"
                  title="No draft job posts"
                  description="Create your job post to find the right talent."
                  buttonText="Create your job post"
                />
              )}
            </>
          )}
        </div>
        {/* Bottom Safe Area */}
        <div className="h-8 lg:h-12"></div>
      </div>
      {/* Floating Action Button */}
      <button
        className="fixed bottom-6 z-50 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl text-white shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200 flex items-center justify-center p-3 md:p-4"
        style={{ right: "max(calc((100vw - 1536px) / 2 + 1.5rem), 1.5rem)" }}
        onClick={() => router.push(PAGE_URLS.EMPLOYER.POST.CREATE)}
        aria-label="Create Job Post"
      >
        <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </div>
  );
}
