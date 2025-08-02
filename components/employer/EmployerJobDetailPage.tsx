"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import JobPostView, { JobPostViewSkeleton } from "@/components/common/JobPostView";
import PostHeader from "@/components/common/PostHeader";
import { JobPostData } from "@/types/jobPost";
import { JobStatus } from "@/constants/enums";
import { API_URLS, PAGE_URLS } from "@/constants/api";
import { EllipsisVertical } from "lucide-react";

interface Props {
  postId: string;
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

const EmployerJobDetailPage: React.FC<Props> = ({ postId }) => {
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
    router.push(PAGE_URLS.EMPLOYER.POST.EDIT(postId));
  }, [router, postId]);

  const handleStatusChange = useCallback((newStatus: JobStatus) => {
    // TODO: API call to update job post status
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
      const response = await fetch(`${API_URLS.JOB_POSTS.DETAIL(postId, "published")}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch job details: ${response.status}`);
      }

      const data = await response.json();
      setJobDetails(data.data);
    } catch (error) {
      console.error("Error fetching job details:", error);
      // TODO: Show error toast to user
    } finally {
      setLoadingStates((prev) => ({ ...prev, jobDetails: false }));
    }
  }, [postId]);

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
