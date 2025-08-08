"use client";

import React, { useState } from "react";
import { Users } from "lucide-react";
import BackHeader from "@/components/common/BackHeader";
import { useRouter } from "next/navigation";
import { ApplicantStatus } from "@/constants/enums";
import ApplicantCard from "@/app/employer/components/ApplicantCard";
import ApplicantStatusDialog from "@/app/employer/components/ApplicantStatusDialog";
import ApplicantFilterTabs from "@/components/employer/ApplicantFilterTabs";
import ApplicantCardSkeleton from "@/components/employer/ApplicantCardSkeleton";
import { useParams } from "next/navigation";
import {
  useEmployerJobPostAppList,
  updateApplicantStatus,
} from "@/hooks/employer/useEmployerDashboard";
import { PAGE_URLS } from "@/constants/api";
import { EMPLOYER_QUERY_KEYS } from "@/constants/queryKeys";
import { showErrorToast, showSuccessToast } from "@/utils/client/toastUtils";
import { useQueryClient } from "@tanstack/react-query";

function ReviewApplicantsPage() {
  const router = useRouter();
  const params = useParams();
  const singleQueryClient = useQueryClient();
  const postId = params?.postId as string;
  const { jobPostAppList, loadingStates, queryClient } = useEmployerJobPostAppList(postId);
  const [activeTab, setActiveTab] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ApplicantStatus | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleReviewApplicant = (applicantId: string) => {
    setSelectedApplicantId(applicantId);
    setDialogOpen(true);

    // 현재 applicant의 status를 찾아서 초기 선택 상태 설정
    const applicant = jobPostAppList?.find((app) => app.application_id.toString() === applicantId);

    if (applicant) {
      // status에 따른 초기 선택 로직
      switch (applicant.status) {
        case ApplicantStatus.APPLIED:
        case ApplicantStatus.IN_REVIEW:
          setSelectedStatus(ApplicantStatus.IN_REVIEW);
          break;
        case ApplicantStatus.HIRED:
          setSelectedStatus(ApplicantStatus.HIRED);
          break;
        case ApplicantStatus.REJECTED:
          setSelectedStatus(ApplicantStatus.REJECTED);
          break;
        default:
          setSelectedStatus(null);
      }
    } else {
      setSelectedStatus(null);
    }
  };

  // 현재 선택된 applicant의 status 가져오기
  const getCurrentApplicantStatus = (): ApplicantStatus | null => {
    if (!selectedApplicantId || !jobPostAppList) return null;
    const applicant = jobPostAppList.find(
      (app) => app.application_id.toString() === selectedApplicantId
    );
    return applicant?.status || null;
  };

  const handleSaveStatus = async () => {
    if (!selectedApplicantId || !selectedStatus) return;
    setIsUpdatingStatus(true);

    try {
      // PATCH request to update applicant status
      const res = await updateApplicantStatus(postId, selectedApplicantId, selectedStatus);
      if (res) {
        showSuccessToast("Applicant status updated successfully");
        singleQueryClient.invalidateQueries({
          queryKey: EMPLOYER_QUERY_KEYS.APPLICANTS_DETAIL(postId, selectedApplicantId),
        });
      } else {
        showErrorToast("No changes made to applicant status");
      }
    } catch (e) {
      console.log("Error updating applicant status:", e);
      showErrorToast("Failed to update applicant status");
    } finally {
      setIsUpdatingStatus(false);
    }

    // 페이지에서만 상태 업데이트
    if (jobPostAppList && queryClient) {
      const updatedList = jobPostAppList.map((applicant) => {
        if (applicant.application_id.toString() === selectedApplicantId) {
          return {
            ...applicant,
            status: selectedStatus,
          };
        }
        return applicant;
      });

      // React Query 캐시 업데이트
      queryClient.setQueryData(EMPLOYER_QUERY_KEYS.APPLICANTS_LIST(postId), updatedList);

      // 다이얼로그 닫기
      setSelectedApplicantId(null);
      setSelectedStatus(null);
      setIsUpdatingStatus(false);
      setDialogOpen(false);
    }
  };

  const handleViewProfile = (applicantId: string) => {
    router.push(`${PAGE_URLS.EMPLOYER.POST.APPLICANT(postId, applicantId)}`);
  };

  const getStatusCounts = () => {
    const counts = {
      all: jobPostAppList?.length || 0,
      applied: 0,
      in_review: 0,
      hired: 0,
      rejected: 0,
    };

    jobPostAppList?.forEach((applicant) => {
      switch (applicant.status) {
        case ApplicantStatus.APPLIED:
          counts.applied++;
          break;
        case ApplicantStatus.IN_REVIEW:
          counts.in_review++;
          break;
        case ApplicantStatus.HIRED:
          counts.hired++;
          break;
        case ApplicantStatus.REJECTED:
          counts.rejected++;
          break;
      }
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  const filteredApplicants = React.useMemo(() => {
    if (!jobPostAppList) return [];
    if (activeTab === "all") return jobPostAppList;

    // status 매핑
    const statusMap: Record<string, ApplicantStatus> = {
      applied: ApplicantStatus.APPLIED,
      in_review: ApplicantStatus.IN_REVIEW,
      hired: ApplicantStatus.HIRED,
      rejected: ApplicantStatus.REJECTED,
    };

    const targetStatus = statusMap[activeTab];
    return jobPostAppList.filter((applicant) => applicant.status === targetStatus);
  }, [activeTab, jobPostAppList]);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <BackHeader title="Review Applicants" />

      {/* Status Tabs */}
      <ApplicantFilterTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        statusCounts={statusCounts}
      />

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
        {/* Loading State */}
        {loadingStates.jobPostAppList && (
          <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <ApplicantCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Applicant Cards */}
        {!loadingStates.jobPostAppList && (
          <>
            {filteredApplicants && filteredApplicants.length > 0 ? (
              <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-6">
                {filteredApplicants.map((applicant) => (
                  <ApplicantCard
                    key={applicant.application_id}
                    applicant={applicant}
                    onReview={() => handleReviewApplicant(applicant.application_id.toString())}
                    onViewProfile={() => handleViewProfile(applicant.application_id.toString())}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-6"></div>
            )}

            {/* Empty State */}
            {filteredApplicants.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No applicants in this category
                </h3>
                <p className="text-gray-500">
                  {activeTab === "all"
                    ? "No applications have been received yet"
                    : `No applicants are currently ${activeTab.replace("_", " ")}`}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <ApplicantStatusDialog
        open={dialogOpen}
        selectedStatus={selectedStatus}
        currentStatus={getCurrentApplicantStatus()}
        onSelect={(status) => setSelectedStatus(status as ApplicantStatus)}
        onSave={handleSaveStatus}
        onCancel={() => setDialogOpen(false)}
        isLoading={isUpdatingStatus}
      />
    </div>
  );
}

export default ReviewApplicantsPage;
