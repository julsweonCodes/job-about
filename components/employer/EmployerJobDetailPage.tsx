"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import JobPostView, { JobPostViewSkeleton } from "@/components/common/JobPostView";
import PostHeader from "@/components/common/PostHeader";
import { JobPostData, JobPostMapper, ApiJobPostDetailData } from "@/types/jobPost";
import { JobStatus } from "@/constants/enums";
import { API_URLS, PAGE_URLS } from "@/constants/api";
import { EllipsisVertical } from "lucide-react";
import { apiGetData } from "@/utils/client/API";

interface Props {
  postId: string;
  status?: "active" | "draft";
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

  // Handlers
  const handleDropdownToggle = useCallback(() => {
    setShowActionsDropdown((prev) => !prev);
  }, []);

  const handleEdit = useCallback(() => {
    router.push(`${PAGE_URLS.EMPLOYER.POST.EDIT(postId)}?status=${status}`);
  }, [router, postId, status]);

  const handleStatusChange = useCallback((newStatus: JobStatus) => {
    // TODO: API call to update job post status @jeongyoun
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
    setLoadingStates((prev) => ({ ...prev, jobDetails: true }));

    try {
      // 상태에 따라 다른 API 엔드포인트 호출
      const data = await apiGetData(API_URLS.EMPLOYER.POST.DETAIL(postId, status));
      if (!data) {
        throw new Error("No data received from API");
      }
      const jobPostData = JobPostMapper.fromDetailJobPost(data as ApiJobPostDetailData);
      setJobDetails(jobPostData);
    } catch (error) {
      console.error("Error fetching job details:", error);
      router.push(PAGE_URLS.EMPLOYER.ROOT);
    } finally {
      setLoadingStates((prev) => ({ ...prev, jobDetails: false }));
    }
  }, [postId, status, router]);

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
