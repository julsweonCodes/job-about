"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import PostHeader from "@/components/common/PostHeader";
import BaseDialog from "@/components/common/BaseDialog";
import TextArea from "@/components/ui/TextArea";
import JobPostView, { JobPostViewSkeleton } from "@/components/common/JobPostView";
import { JobPostData } from "@/types/client/jobPost";
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

interface TempEditData {
  manual: string;
  struct1: string;
  struct2: string;
}

interface EditDialogData {
  selectedVersion: DescriptionVersion;
  description: string;
}

interface PreviewJobPostResponse {
  postData: JobPostData;
  geminiRes?: string;
}

// Constants
const DESCRIPTION_LABELS: Record<DescriptionVersion, string> = {
  manual: "Manual Description",
  struct1: "AI Structure 1",
  struct2: "AI Structure 2",
};

// Custom Hooks
const usePreviewJobPost = (postId: string) => {
  const [jobPostData, setJobPostData] = useState<JobPostData | null>(null);
  const [geminiRes, setGeminiRes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isInitializingRef = useRef(false);

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

  const fetchData = useCallback(async () => {
    if (isInitializingRef.current) return;
    isInitializingRef.current = true;

    try {
      setLoading(true);
      setError(null);

      const data = await apiGetData<PreviewJobPostResponse>(
        `${API_URLS.EMPLOYER.POST.PUBLISH(postId)}`
      );

      // Handle string response (e.g., "no data")
      if (typeof data === "string") {
        throw new Error("Invalid job post status");
      }

      // Handle object response
      if (data?.postData?.status !== "draft") {
        throw new Error("Invalid job post status");
      }

      setJobPostData(data.postData);

      if (data.geminiRes) {
        const processedGemini = processGeminiResponse(data.geminiRes);
        setGeminiRes(processedGemini);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch job post";
      setError(errorMessage);
      console.error("Failed to fetch job post:", error);
    } finally {
      setLoading(false);
      isInitializingRef.current = false;
    }
  }, [postId, processGeminiResponse]);

  useEffect(() => {
    if (postId) {
      fetchData();
    }
  }, [postId, fetchData]);

  return {
    jobPostData,
    geminiRes,
    loading,
    error,
    refetch: fetchData,
  };
};

const useDescriptionManagement = (jobPostData: JobPostData | null, geminiRes: string[]) => {
  const [selectedVersion, setSelectedVersion] = useState<DescriptionVersion>("manual");
  const [tempEditData, setTempEditData] = useState<TempEditData>({
    manual: "",
    struct1: "",
    struct2: "",
  });

  const initializeTempEditData = useCallback((jobData: JobPostData, gemini: string[]) => {
    const newTempEditData: TempEditData = {
      manual: String(jobData.jobDescription || ""),
      struct1: gemini[0] || "",
      struct2: gemini[1] || "",
    };
    setTempEditData(newTempEditData);
  }, []);

  useEffect(() => {
    if (jobPostData) {
      initializeTempEditData(jobPostData, geminiRes);
    }
  }, [jobPostData, geminiRes, initializeTempEditData]);

  const updateTempEditData = useCallback((version: DescriptionVersion, content: string) => {
    setTempEditData((prev) => ({
      ...prev,
      [version]: content,
    }));
  }, []);

  const getSelectedDescription = useCallback(() => {
    return tempEditData[selectedVersion] || "";
  }, [tempEditData, selectedVersion]);

  return {
    selectedVersion,
    setSelectedVersion,
    tempEditData,
    updateTempEditData,
    getSelectedDescription,
  };
};

const useEditDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVersion, setEditingVersion] = useState<DescriptionVersion>("manual");
  const [dialogContent, setDialogContent] = useState("");

  const openDialog = useCallback((version: DescriptionVersion, content: string) => {
    setEditingVersion(version);
    setDialogContent(content);
    setIsDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  const updateDialogContent = useCallback((content: string) => {
    setDialogContent(content);
  }, []);

  return {
    isDialogOpen,
    editingVersion,
    dialogContent,
    openDialog,
    closeDialog,
    updateDialogContent,
  };
};

const JobPreviewEditPage: React.FC<Props> = ({ postId }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const useAI = searchParams.get("useAI") === "true";

  // Custom hooks
  const { jobPostData, geminiRes, loading, error } = usePreviewJobPost(postId);
  const {
    selectedVersion,
    setSelectedVersion,
    tempEditData,
    updateTempEditData,
    getSelectedDescription,
  } = useDescriptionManagement(jobPostData, geminiRes);
  const {
    isDialogOpen,
    editingVersion,
    dialogContent,
    openDialog,
    closeDialog,
    updateDialogContent,
  } = useEditDialog();

  // Loading states
  const [publishLoading, setPublishLoading] = useState(false);

  // Error handling
  const handlePageError = useCallback(
    (errorMessage: string) => {
      console.error(`JobPreviewEditPage Error: ${errorMessage}`);

      if (errorMessage.includes("Unauthorized")) {
        showErrorToast("Please log in again to access this page.");
        window.location.href = "/auth/signin";
      } else if (errorMessage.includes("not found") || errorMessage.includes("access denied")) {
        showErrorToast("Job post not found or access denied.");
        router.replace(PAGE_URLS.EMPLOYER.ROOT);
      } else {
        showErrorToast("This page is no longer accessible.");
        router.replace(PAGE_URLS.EMPLOYER.POST.DETAIL(postId));
      }
    },
    [postId, router]
  );

  // Handle error from custom hook
  useEffect(() => {
    if (error) {
      handlePageError(error);
    }
  }, [error, handlePageError]);

  // Edit handlers
  const handleEdit = useCallback(
    (section: string, data: EditDialogData) => {
      if (section === "description") {
        const { selectedVersion: version, description: content } = data;

        // useAI 조건에 따른 수정 가능 여부 확인
        if (!useAI && version !== "manual") {
          showErrorToast("AI descriptions are not available in this mode.");
          return;
        }

        openDialog(version, content);
      }
    },
    [useAI, openDialog]
  );

  const handleSave = useCallback(() => {
    updateTempEditData(editingVersion, dialogContent);
    closeDialog();
  }, [editingVersion, dialogContent, updateTempEditData, closeDialog]);

  const handlePublish = useCallback(async () => {
    try {
      setPublishLoading(true);

      const descriptionToPublish = getSelectedDescription();

      await apiPatchData(API_URLS.EMPLOYER.POST.PUBLISH(postId), {
        postId,
        newJobDesc: descriptionToPublish,
      });

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: EMPLOYER_QUERY_KEYS.ACTIVE_JOB_POSTS });
      queryClient.invalidateQueries({ queryKey: EMPLOYER_QUERY_KEYS.DRAFT_JOB_POSTS });
      queryClient.invalidateQueries({ queryKey: EMPLOYER_QUERY_KEYS.DASHBOARD });

      showSuccessToast("Job post published successfully");
      router.replace(PAGE_URLS.EMPLOYER.POST.DETAIL(postId));
    } catch (error) {
      console.error("Publish error:", error);
      showErrorToast(error instanceof Error ? error.message : "Failed to publish job post");
    } finally {
      setPublishLoading(false);
    }
  }, [postId, getSelectedDescription, router, queryClient]);

  const getDialogTitle = useCallback((version: DescriptionVersion): string => {
    return `Edit ${DESCRIPTION_LABELS[version]}`;
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-pretendard">
        <PostHeader previewMode />
        <JobPostViewSkeleton />
      </div>
    );
  }

  // Error state
  if (error || !jobPostData) {
    return (
      <div className="min-h-screen bg-gray-50 font-pretendard">
        <PostHeader previewMode />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to load job post</h2>
            <p className="text-gray-600">Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-pretendard">
      <PostHeader previewMode />

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

      {/* Publish loading overlay */}
      {publishLoading && <LoadingScreen overlay={true} opacity="light" message="Publishing..." />}

      {/* Edit dialog */}
      <BaseDialog
        open={isDialogOpen}
        onClose={closeDialog}
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
          onChange={(e) => updateDialogContent(e.target.value)}
          className="w-full pt-3 pb-1 scrollbar-none"
          placeholder="Describe the role, responsibilities, and what makes this opportunity special..."
        />
      </BaseDialog>
    </div>
  );
};

export default JobPreviewEditPage;
