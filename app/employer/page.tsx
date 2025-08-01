"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StatsCard, StatsCardSkeleton } from "./components/StatsCard";
import { JobPostCard, JobPostCardSkeleton } from "./components/JobPostCard";
import { AlertBanner } from "./components/AlertBanner";
import { ProfileHeader } from "../../components/common/ProfileHeader";
import { Plus } from "lucide-react";
import { Simulate } from "react-dom/test-utils";
import { Dashboard, JobPost } from "@/types/employer";
import error = Simulate.error;
import { PAGE_URLS } from "@/constants/api";

export default function EmployerDashboard() {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(true);
  const [dashboard, setDashboard] = useState<Dashboard>();
  const [jobPostList, setJobPostList] = useState<JobPost[]>([]);
  // 각 API 호출의 개별 상태
  const [loadingStates, setLoadingStates] = useState({
    dashboard: false,
    jobPostList: false,
  });

  // 전체 로딩 상태 계산
  const isLoading = Object.values(loadingStates).some((state) => state);

  const fetchDash = async () => {
    try {
      const res = await fetch("/api/employer/dashboard");
      const data = await res.json();
      if (res.ok) {
        setDashboard(data.data);
      } else {
        console.error("Failed to fetch employer dashboard", data.error);
      }
    } catch (e) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchJobPostList = async () => {
    try {
      const res = await fetch("/api/employer/dashboard/jobposts");
      const data = await res.json();
      if (res.ok) {
        setJobPostList(data.data);
      } else {
        console.error("Failed to fetch active job posts in dashboard page", data.error);
      }
    } catch (e) {
      console.error("Error fetching data:", error);
    }
  };

  const initializeData = async () => {
    try {
      // 로딩 시작
      setLoadingStates({
        dashboard: true,
        jobPostList: true,
      });

      // 모든 API 호출을 병렬로 실행
      await Promise.all([
        fetchDash(),
        fetchJobPostList(),
        // 추가 API 호출들을 여기에 추가
      ]);
    } catch (error) {
      console.error("Error initializing dashboard:", error);
    } finally {
      // 로딩 완료
      setLoadingStates({
        dashboard: false,
        jobPostList: false,
      });
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
        {showAlert && (
          <div className="mb-8">
            <AlertBanner
              message={`${dashboard?.needsUpdateCnt} job posts need status updates`}
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
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Your Active Job Posts</h2>
          </div>
          {loadingStates.jobPostList ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
              {Array.from({ length: 4 }).map((_, index) => (
                <JobPostCardSkeleton key={index} />
              ))}
            </div>
          ) : jobPostList && jobPostList.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
              {jobPostList.map((job) => (
                <JobPostCard
                  key={job.id}
                  job={job}
                  onView={handleViewJob}
                  onViewApplicants={handleViewApplicants}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No active job posts found.</p>
            </div>
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
