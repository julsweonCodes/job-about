"use client";
import React, { useEffect, useState } from "react";
import PostHeader from "@/components/common/PostHeader";
import BaseDialog from "@/components/common/BaseDialog";
import TextArea from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import JobPostView from "@/components/common/JobPostView";
import { JobPostData } from "@/types/jobPost";
import { JobStatus, LanguageLevel } from "@/constants/enums";
import { JobType } from "@/constants/jobTypes";
import { useSearchParams } from "next/navigation";
import LoadingScreen from "@/components/common/LoadingScreen";

interface Props {
  postId: string;
}

const JobPreviewEditPage: React.FC<Props> = ({ postId }) => {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const useAI = searchParams.get("useAI") === "true";
  const [jobPostData, setJobPostData] = useState<JobPostData>();
  const [geminiRes, setGeminiRes] = useState<string>();
  const [tempEditData, setTempEditData] = useState<any>({});
  const [loadingStates, setLoadingStates] = useState({
    jobPostPreview: false,
    geminiRes: false,
  });

  const initializeData = async () => {
    try {
      // 로딩 시작
      setLoadingStates({
        jobPostPreview: true,
        geminiRes: true,
      });

      // 모든 API 호출을 병렬로 실행
      await Promise.all([
        fetchPreviewJobPost()
        // 추가 API 호출들을 여기에 추가
      ]);
    } catch (error) {
      console.error("Error initializing dashboard:", error);
    } finally {
      // 로딩 완료
      setLoadingStates({
        jobPostPreview: false,
        geminiRes: false
      });
    }
  };

  useEffect(() => {
    initializeData();
  }, []);

  // 전체 로딩 상태 계산
  const isLoading = Object.values(loadingStates).some((state) => state);
  const fetchPreviewJobPost = async() => {
    try {
      const res = await fetch(`/api/employer/post/preview/${postId}`);
      const data = await res.json();
      if (res.ok) {
        setJobPostData(data.data.postData);
        setGeminiRes(data.data.geminiRes);
        console.log("PREVIEW PAGE: ", jobPostData);
        console.log(geminiRes);
      } else {
        console.log("Failed to fetch DRAFT job post");
      }
    } catch (e) {
      console.log("Error fetching DRAFT job post", e);
    }
  };

  const handleEdit = (section: string, initialData?: any) => {
    setTempEditData(initialData || {});
    setEditingSection(section);
  };

  const handleSave = (section: string, data: any) => {
    setJobPostData((prev: any) => ({ ...prev, ...data }));
    setEditingSection(null);
    setTempEditData({});
  };

  const handlePublish = () => {
    console.log("Publishing job post:", jobPostData);
  };

  // 로딩 중일 때 LoadingScreen 표시
  if (isLoading) {
    return <LoadingScreen />;
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
        showEditButtons
        showPublishButton
        editableSections={["description"]}
      /> )}
      <BaseDialog
        type="bottomSheet"
        open={editingSection === "description"}
        onClose={() => setEditingSection(null)}
        title="Edit Job Description"
        actions={
          <Button onClick={() => handleSave("description", tempEditData)} size="lg">
            Save
          </Button>
        }
      >
        <div className="flex flex-col gap-1 sm:gap-2">
          <span className="text-sm md:text-base text-gray-500">
            You can edit the job description here
          </span>
          <TextArea
            rows={6}
            value={tempEditData.description || jobPostData?.jobDescription}
            onChange={(e) =>
              setTempEditData((prev: any) => ({ ...prev, description: e.target.value }))
            }
            className="w-full pt-3 pb-1 scrollbar-none"
            placeholder="Describe the role, responsibilities, and what makes this opportunity special..."
          />
        </div>
      </BaseDialog>
    </div>
  );
};

export default JobPreviewEditPage;
