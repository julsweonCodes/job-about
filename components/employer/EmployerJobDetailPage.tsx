"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import JobPostView, { JobPostViewSkeleton } from "@/components/common/JobPostView";
import PostHeader from "@/components/common/PostHeader";
import { JobPostData, JobPostMapper, ApiJobPostDetailData } from "@/types/jobPost";
import { JobStatus } from "@/constants/enums";
import { API_URLS, PAGE_URLS } from "@/constants/api";
import { EllipsisVertical } from "lucide-react";
import { apiGetData, ApiError } from "@/utils/client/API";
import { showErrorToast, showSuccessToast } from "@/utils/client/toastUtils";

interface Props {
  postId: string;
  status?: "published" | "draft";
}

interface LoadingStates {
  jobDetails: boolean;
}

interface DropdownItem {
  label: string;
  color?: string;
  onClick: () => void;
  isDestructive?: boolean;
}

const EmployerJobDetailPage: React.FC<Props> = ({ postId, status = "published" }) => {
  const router = useRouter();

  // State
  const [jobDetails, setJobDetails] = useState<JobPostData | null>(null);
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    jobDetails: true,
  });

  // 중복 실행 방지를 위한 ref
  const isInitializingRef = useRef(false);

  // Handlers
  const handleDropdownToggle = useCallback(() => {
    setShowActionsDropdown((prev) => !prev);
  }, []);

  const handleEdit = useCallback(() => {
    console.log("handleEdit", postId, status);
    router.push(`${PAGE_URLS.EMPLOYER.POST.EDIT(postId)}?status=${status}`);
  }, [router, postId, status]);

  const handleStatusChange = useCallback((newStatus: JobStatus) => {
    // TODO: API call to update job post status @jeongyoun
    updateStatus(postId, newStatus);
    console.log("Status changed to:", newStatus);

    setShowActionsDropdown(false);
  }, []);

  // Dropdown items
  const dropdownItems: DropdownItem[] = [
    {
      label: "Edit Job Post",
      onClick: handleEdit,
    },
    {
      label: jobDetails?.status === JobStatus.PUBLISHED ? "Close Job Post" : "Open Job Post",
      color: jobDetails?.status === JobStatus.PUBLISHED ? "text-red-600" : "text-green-600",
      onClick: () => {
        const newStatus =
          jobDetails?.status === JobStatus.PUBLISHED ? JobStatus.CLOSED : JobStatus.PUBLISHED;
        handleStatusChange(newStatus);
      },
    },
  ];

  // Data fetching
  const fetchJobDetails = useCallback(async () => {
    if (isInitializingRef.current) return;
    isInitializingRef.current = true;

    setLoadingStates((prev) => ({ ...prev, jobDetails: true }));

    try {
      // 상태에 따라 다른 API 엔드포인트 호출
      const data = await apiGetData(API_URLS.EMPLOYER.POST.DETAIL(postId, status));

      if (!data) {
        throw new Error("Job post not found or you don't have permission to view it");
      }

      const jobPostData = JobPostMapper.fromDetailJobPost(data as ApiJobPostDetailData);
      setJobDetails(jobPostData);
    } catch (error) {
      console.error("Error fetching job details:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch job details. Please check if the job post exists and you have permission to view it.";

      showErrorToast(errorMessage);

      // 토스트가 보이도록 2초 후에 페이지 이동
      setTimeout(() => {
        router.replace(PAGE_URLS.EMPLOYER.ROOT);
      }, 2000);
    } finally {
      setLoadingStates((prev) => ({ ...prev, jobDetails: false }));
      isInitializingRef.current = false;
    }
  }, [postId, status, router]);

  const updateStatus = async (postId: string, status: JobStatus) => {
    console.log("Let's update job status -",status);
    try {
      const res = await fetch(API_URLS.EMPLOYER.POST.STATUS, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({postId, status}),
      });
      if (res.ok) {
        showSuccessToast("Job Status updated successfully.");
      } else {
        showErrorToast("Error updating job status");
      }
    } catch (e) {
      console.error("Error updating job status", e);
      showErrorToast((e as Error).message || "Error updating job status");
    }
  }
  // Effects
  useEffect(() => {
    if (postId) {
      fetchJobDetails();
    }
  }, [postId, fetchJobDetails]);

  // Loading state
  const isLoading = loadingStates.jobDetails;

  return (
    <div className="min-h-screen bg-gray-50 font-pretendard">
      <PostHeader
        showDropdown={showActionsDropdown}
        dropdownItems={dropdownItems}
        onDropdownToggle={handleDropdownToggle}
        rightIcon={<EllipsisVertical className="w-5 h-5 text-gray-700" />}
      />

      {isLoading ? (
        <JobPostViewSkeleton />
      ) : (
        jobDetails && <JobPostView jobData={jobDetails} mode="employer" showEditButtons={false} />
      )}
    </div>
  );
};

export default EmployerJobDetailPage;
