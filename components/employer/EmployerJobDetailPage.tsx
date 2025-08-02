"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import JobPostView from "@/components/common/JobPostView";
import PostHeader from "@/components/common/PostHeader";
import { JobPostData } from "@/types/jobPost";
import { JobStatus } from "@/constants/enums";
import { API_URLS, PAGE_URLS } from "@/constants/api";
import { EllipsisVertical } from "lucide-react";

interface Props {
  postId: string;
}

const EmployerJobDetailPage: React.FC<Props> = ({ postId }) => {
  const router = useRouter();
  const [jobDetails, setJobDetails] = useState<JobPostData | null>(null);
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  const [loadingStates, setLoadingStates] = useState({
    jobDetails: false,
  });

  const handleDropdownToggle = () => {
    setShowActionsDropdown(!showActionsDropdown);
  };

  const handleEdit = () => {
    router.push(PAGE_URLS.EMPLOYER.POST.EDIT(postId));
  };

  const handleStatusChange = (newStatus: JobStatus) => {
    // TODO: API call to update job post status
    console.log("Status changed to:", newStatus);
    setShowActionsDropdown(false);
  };

  const dropdownItems = [
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

  const isLoading = loadingStates.jobDetails;
  const fetchJobDetails = async () => {
    setLoadingStates((prev) => ({ ...prev, jobDetails: true }));
    try {
      const response = await fetch(`${API_URLS.JOB_POSTS.DETAIL(postId, "published")}`);
      if (!response.ok) {
        throw new Error("Failed to fetch job details");
      }
      const data = await response.json();
      setJobDetails(data.data);
    } catch (error) {
      console.error("Error fetching job details:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, jobDetails: false }));
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [postId]);

  return (
    <div className="min-h-screen bg-gray-50 font-pretendard">
      <PostHeader
        showDropdown={showActionsDropdown}
        dropdownItems={dropdownItems}
        onDropdownToggle={handleDropdownToggle}
        rightIcon={<EllipsisVertical className="w-5 h-5 text-gray-700" />}
      />

      {jobDetails && <JobPostView jobData={jobDetails} mode="employer" showEditButtons={false} />}
    </div>
  );
};

export default EmployerJobDetailPage;
