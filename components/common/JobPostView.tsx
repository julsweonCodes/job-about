"use client";
import React from "react";
import { JobPostData } from "@/types/jobPost";
import SeekerJobPostView from "./JobPostView/SeekerJobPostView";
import EmployerJobPostView from "./JobPostView/EmployerJobPostView";
import EmployerJobPostEditView from "./JobPostView/EmployerJobPostEditView";
import JobPostViewSkeleton from "./JobPostView/JobPostViewSkeleton";

// Types
interface JobPostViewProps {
  jobData: JobPostData | null;
  mode?: "employer" | "seeker" | "preview" | "edit";
  onEdit?: (section: string, data: any) => void;
  onApply?: () => void;
  onBookmark?: () => void;
  onPublish?: () => void;
  onSaveEdit?: () => void;
  isBookmarked?: boolean;
  showEditButtons?: boolean;
  showApplyButton?: boolean;
  showPublishButton?: boolean;
  showSaveEditButton?: boolean;
  editableSections?: string[];
  useAI?: boolean;
  geminiRes?: string[];
  jobDescriptions?: {
    manual: string;
    struct1: string;
    struct2: string;
  };
  selectedVersion?: "manual" | "struct1" | "struct2";
  onSelectVersion?: (v: "manual" | "struct1" | "struct2") => void;
  isDraft?: boolean;
  onGeminiClicked?: () => void;
}

// Main component
const JobPostView: React.FC<JobPostViewProps> = ({
  jobData,
  mode = "seeker",
  onEdit,
  onApply,
  onBookmark,
  onPublish,
  onSaveEdit,
  showEditButtons = false,
  showPublishButton = false,
  showSaveEditButton = false,
  editableSections = ["header", "description", "business", "jobDetails", "skillsAndStyles"],
  useAI,
  geminiRes,
  jobDescriptions,
  selectedVersion,
  onSelectVersion,
  isDraft = false,
  onGeminiClicked,
  isBookmarked,
}) => {
  // jobData가 없으면 skeleton 표시
  if (!jobData) {
    return <JobPostViewSkeleton />;
  }

  // Seeker mode
  if (mode === "seeker") {
    return (
      <SeekerJobPostView
        jobData={jobData}
        onApply={onApply}
        onBookmark={onBookmark}
        isBookmarked={isBookmarked}
      />
    );
  }

  // Edit mode - 새로운 edit 전용 컴포넌트 사용
  if (mode === "edit") {
    return (
      <EmployerJobPostEditView
        jobData={jobData}
        onEdit={onEdit}
        onPublish={onPublish}
        onSaveEdit={onSaveEdit}
        showEditButtons={showEditButtons}
        showPublishButton={showPublishButton}
        showSaveEditButton={showSaveEditButton}
        editableSections={editableSections}
        useAI={useAI}
        geminiRes={geminiRes}
        jobDescriptions={jobDescriptions}
        selectedVersion={selectedVersion}
        onSelectVersion={onSelectVersion}
        isDraft={isDraft}
        onGeminiClicked={onGeminiClicked}
      />
    );
  }

  // Employer mode (preview)
  if (mode === "employer" || mode === "preview") {
    return (
      <EmployerJobPostView
        jobData={jobData}
        onEdit={onEdit}
        onPublish={onPublish}
        onSaveEdit={onSaveEdit}
        showEditButtons={showEditButtons}
        showPublishButton={showPublishButton}
        showSaveEditButton={showSaveEditButton}
        editableSections={editableSections}
        useAI={useAI}
        geminiRes={geminiRes}
        jobDescriptions={jobDescriptions}
        selectedVersion={selectedVersion}
        onSelectVersion={onSelectVersion}
        isDraft={isDraft}
        onGeminiClicked={onGeminiClicked}
      />
    );
  }

  // Default fallback
  return <JobPostViewSkeleton />;
};

export { JobPostViewSkeleton };
export default JobPostView;
