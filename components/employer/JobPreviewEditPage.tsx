"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import PostHeader from "@/components/common/PostHeader";
import BaseDialog from "@/components/common/BaseDialog";
import TextArea from "@/components/ui/TextArea";
import JobPostView, { JobPostViewSkeleton } from "@/components/common/JobPostView";
import { JobPostData } from "@/types/jobPost";
import { useSearchParams } from "next/navigation";
import LoadingScreen from "@/components/common/LoadingScreen";
import { API_URLS, PAGE_URLS } from "@/constants/api";
import { showErrorToast, showSuccessToast } from "@/utils/client/toastUtils";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { EMPLOYER_QUERY_KEYS } from "@/constants/queryKeys";
import { apiGetData, apiPatchData } from "@/utils/client/API";
import { Button } from "../ui/Button";

// Types
type DescriptionVersion = "manual" | "struct1" | "struct2";

interface Props {
  postId: string;
}

interface LoadingStates {
  jobDetails: boolean;
  publish: boolean;
}

interface TempEditData {
  manual: string;
  struct1: string;
  struct2: string;
}

interface EditDialogData {
  selectedVersion: DescriptionVersion;
  description: string;
}

// Constants
const DESCRIPTION_LABELS: Record<DescriptionVersion, string> = {
  manual: "Manual Description",
  struct1: "AI Structure 1",
  struct2: "AI Structure 2",
};

const JobPreviewEditPage: React.FC<Props> = ({ postId }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const useAI = searchParams.get("useAI") === "true";

  // Core state
  const [jobPostData, setJobPostData] = useState<JobPostData>();
  const [geminiRes, setGeminiRes] = useState<string[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<DescriptionVersion>("manual");
  const [newJobDesc, setNewJobDesc] = useState<string>();

  // Loading states
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    jobDetails: true,
    publish: false,
  });

  // Edit dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVersion, setEditingVersion] = useState<DescriptionVersion>("manual");
  const [dialogContent, setDialogContent] = useState("");

  // Temp edit data - stores edited versions of descriptions
  const [tempEditData, setTempEditData] = useState<TempEditData>({
    manual: "",
    struct1: "",
    struct2: "",
  });

  // Initialization flag to prevent duplicate calls
  const [isInitialized, setIsInitialized] = useState(false);
  const isInitializingRef = useRef(false);

  // Utility functions
  const handlePageError = useCallback(
    (errorMessage: string) => {
      console.error(`JobPreviewEditPage Error: ${errorMessage}`);
      showErrorToast("This page is no longer accessible.");
      router.replace(PAGE_URLS.EMPLOYER.POST.DETAIL(postId));
    },
    [postId, router]
  );

  const processGeminiResponse = useCallback((rawGemini: string): string[] => {
    try {
      const gemTmp = JSON.parse(rawGemini);

      const struct1Combined = [
        "[Main Responsibilities]",
        ...(gemTmp.struct1?.["Main Responsibilities"] ?? []),
        "[Preferred Qualifications and Benefits]",
        ...(gemTmp.struct1?.["Preferred Qualifications and Benefits"] ?? []),
      ].join("\n");

      const struct2 = gemTmp.struct2 ?? "";

      return [struct1Combined, struct2];
    } catch (error) {
      console.error("Error processing Gemini response:", error);
      return ["", ""];
    }
  }, []);

  const initializeTempEditData = useCallback((jobData: JobPostData, gemini: string[]) => {
    const newTempEditData: TempEditData = {
      manual: jobData.jobDescription || "",
      struct1: gemini[0] || "",
      struct2: gemini[1] || "",
    };
    setTempEditData(newTempEditData);
  }, []);

  // Data fetching
  const fetchPreviewJobPost = useCallback(async () => {
    try {
      const data = await apiGetData(`${API_URLS.EMPLOYER.POST.PUBLISH(postId)}`);

      // Handle string response (e.g., "no data")
      if (typeof data === "string") {
        handlePageError("Invalid job post status");
        return;
      }

      // Handle object response
      if (data?.postData?.status !== "draft") {
        handlePageError("Invalid job post status");
        return;
      }

      const postData = data.postData;
      setJobPostData(postData);
      setNewJobDesc(postData.jobDescription);

      const rawGemini = data.geminiRes;
      if (rawGemini) {
        const processedGemini = processGeminiResponse(rawGemini);
        setGeminiRes(processedGemini);
      }
    } catch (error) {
      console.error("Failed to fetch job post:", error);
      handlePageError("Failed to fetch job post");
    } finally {
      setIsInitialized(true);
    }
  }, [postId, handlePageError, processGeminiResponse]);

  const initializeData = useCallback(async () => {
    if (isInitialized || isInitializingRef.current) return;

    isInitializingRef.current = true;

    try {
      setLoadingStates((prev) => ({ ...prev, jobDetails: true }));
      await fetchPreviewJobPost();
    } catch (error) {
      console.error("Error initializing data:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, jobDetails: false }));
      isInitializingRef.current = false;
    }
  }, [fetchPreviewJobPost, isInitialized]);

  // Initialize tempEditData when data is available
  useEffect(() => {
    if (jobPostData && geminiRes && !isInitialized) {
      initializeTempEditData(jobPostData, geminiRes);
    }
  }, [jobPostData, geminiRes, isInitialized, initializeTempEditData]);

  // Initialize data on mount
  useEffect(() => {
    if (postId && !isInitialized) {
      initializeData();
    }
  }, [postId, initializeData, isInitialized]);

  // Edit handlers
  const handleEdit = useCallback((section: string, data: EditDialogData) => {
    if (section === "description") {
      const { selectedVersion: version, description: content } = data;

      setEditingVersion(version);
      setDialogContent(content);
      setIsDialogOpen(true);
    }
  }, []);

  const handleSave = useCallback(() => {
    // Update tempEditData with edited content
    setTempEditData((prev) => ({
      ...prev,
      [editingVersion]: dialogContent,
    }));

    // Update newJobDesc with selected version content
    const updatedTempData = {
      ...tempEditData,
      [editingVersion]: dialogContent,
    };

    if (selectedVersion) {
      setNewJobDesc(updatedTempData[selectedVersion]);
    }

    setIsDialogOpen(false);
  }, [editingVersion, dialogContent, tempEditData, selectedVersion]);

  const handlePublish = useCallback(async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, publish: true }));

      await apiPatchData(API_URLS.EMPLOYER.POST.PUBLISH(postId), {
        postId,
        newJobDesc,
      });

      // Job posts 캐시 무효화 (job post가 publish되었으므로)
      queryClient.invalidateQueries({ queryKey: EMPLOYER_QUERY_KEYS.ACTIVE_JOB_POSTS });
      queryClient.invalidateQueries({ queryKey: EMPLOYER_QUERY_KEYS.DRAFT_JOB_POSTS });
      queryClient.invalidateQueries({ queryKey: EMPLOYER_QUERY_KEYS.DASHBOARD });

      showSuccessToast("Job post published successfully");
      router.replace(PAGE_URLS.EMPLOYER.POST.DETAIL(postId));
    } catch (error) {
      console.error("Publish error:", error);
      showErrorToast(error instanceof Error ? error.message : "Failed to publish job post");
    } finally {
      setLoadingStates((prev) => ({ ...prev, publish: false }));
    }
  }, [postId, newJobDesc, router, queryClient]);

  const getDialogTitle = useCallback((version: DescriptionVersion): string => {
    return `Edit ${DESCRIPTION_LABELS[version]}`;
  }, []);

  // Loading state
  if (loadingStates.jobDetails) {
    return (
      <div className="min-h-screen bg-gray-50 font-pretendard">
        <PostHeader previewMode />
        <JobPostViewSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-pretendard">
      <PostHeader previewMode />

      {jobPostData && (
        <JobPostView
          jobData={jobPostData}
          mode="preview"
          onEdit={handleEdit}
          onPublish={handlePublish}
          showEditButtons={true}
          showPublishButton
          editableSections={["description"]}
          useAI={useAI}
          geminiRes={geminiRes}
          selectedVersion={selectedVersion}
          onSelectVersion={setSelectedVersion}
          jobDescriptions={tempEditData}
        />
      )}

      {/* Publish loading overlay */}
      {loadingStates.publish && (
        <LoadingScreen overlay={true} opacity="light" message="Publishing..." />
      )}

      {/* Edit dialog */}
      <BaseDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={getDialogTitle(editingVersion)}
        size="lg"
        actions={
          <>
            <Button onClick={handleSave} size="lg">
              Save
            </Button>
          </>
        }
      >
        <TextArea
          rows={6}
          value={dialogContent}
          onChange={(e) => setDialogContent(e.target.value)}
          className="w-full pt-3 pb-1 scrollbar-none"
          placeholder="Describe the role, responsibilities, and what makes this opportunity special..."
        />
      </BaseDialog>
    </div>
  );
};

export default JobPreviewEditPage;
