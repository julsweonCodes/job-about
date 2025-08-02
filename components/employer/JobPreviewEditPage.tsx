"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import PostHeader from "@/components/common/PostHeader";
import BaseDialog from "@/components/common/BaseDialog";
import TextArea from "@/components/ui/TextArea";
import JobPostView from "@/components/common/JobPostView";
import { JobPostData } from "@/types/jobPost";
import { useSearchParams } from "next/navigation";
import LoadingScreen from "@/components/common/LoadingScreen";
import { API_URLS, PAGE_URLS } from "@/constants/api";
import { showErrorToast, showSuccessToast } from "@/utils/client/toastUtils";
import { useRouter } from "next/navigation";
import { apiPatchData } from "@/utils/client/API";
import { SUCCESS_STATUS } from "@/app/lib/server/commonResponse";

type DescriptionVersion = "manual" | "struct1" | "struct2";

interface Props {
  postId: string;
}

const JobPreviewEditPage: React.FC<Props> = ({ postId }) => {
  const router = useRouter();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const useAI = searchParams.get("useAI") === "true";
  const [jobPostData, setJobPostData] = useState<JobPostData>();
  const [geminiRes, setGeminiRes] = useState<string[]>([]);
  const [loadingStates, setLoadingStates] = useState({
    jobPostPreview: false,
    geminiRes: false,
    publish: false,
  });
  const [selectedVersion, setSelectedVersion] = useState<DescriptionVersion>("manual");
  const [newJobDesc, setNewJobDesc] = useState<string>();
  const [tempEditData, setTempEditData] = useState<Record<DescriptionVersion, string>>({
    manual: jobPostData?.jobDescription || "",
    struct1: geminiRes[0] || "",
    struct2: geminiRes[1] || "",
  });

  // 다이얼로그에서 편집할 때 사용할 임시 상태
  const [dialogEditData, setDialogEditData] = useState<Record<DescriptionVersion, string>>({
    manual: "",
    struct1: "",
    struct2: "",
  });

  // 중복 호출 방지를 위한 ref
  const isInitializing = useRef(false);

  // 페이지 내부 함수들
  const handlePageError = useCallback(
    (errorMessage: string) => {
      console.error(`Error: ${errorMessage}`);
      showErrorToast(`This page is no longer accessible.`);
      router.replace(PAGE_URLS.EMPLOYER.POST.DETAIL(postId));
    },
    [postId]
  );

  const processGeminiResponse = useCallback((rawGemini: string) => {
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

  const fetchPreviewJobPost = useCallback(async () => {
    // 이미 초기화 중이면 중복 호출 방지
    if (isInitializing.current) {
      console.log("Already initializing, skipping duplicate call");
      return;
    }

    isInitializing.current = true;

    try {
      const res = await fetch(`${API_URLS.EMPLOYER.POST.PUBLISH(postId)}`);
      const data = await res.json();

      if (!res.ok || data?.data.postData.status !== "draft") {
        handlePageError("Invalid job post status");
        return;
      }

      setJobPostData(data.data.postData);
      // 초기 로드 시에는 manual description을 기본값으로 설정
      setNewJobDesc(data.data.postData.jobDescription);

      const rawGemini = data.data.geminiRes;
      if (rawGemini) {
        const processedGemini = processGeminiResponse(rawGemini);
        setGeminiRes(processedGemini);
      }
    } catch (e) {
      handlePageError("Failed to fetch job post");
    } finally {
      isInitializing.current = false;
    }
  }, [postId, handlePageError, processGeminiResponse]);

  const initializeData = useCallback(async () => {
    // 이미 초기화 중이면 중복 호출 방지
    if (isInitializing.current) {
      console.log("Already initializing, skipping duplicate call");
      return;
    }

    try {
      // 로딩 시작
      setLoadingStates({
        jobPostPreview: true,
        geminiRes: true,
        publish: false,
      });

      // 모든 API 호출을 병렬로 실행
      await Promise.all([
        fetchPreviewJobPost(),
        // 추가 API 호출들을 여기에 추가
      ]);
    } catch (error) {
      console.error("Error initializing dashboard:", error);
    } finally {
      // 로딩 완료
      setLoadingStates({
        jobPostPreview: false,
        geminiRes: false,
        publish: false,
      });
    }
  }, [fetchPreviewJobPost]);

  useEffect(() => {
    if (postId) {
      initializeData();
    }
  }, [postId, initializeData]);

  useEffect(() => {
    console.log("Updated geminiRes:", geminiRes);
    const newTempEditData = {
      manual: jobPostData?.jobDescription || "",
      struct1: geminiRes[0] || "",
      struct2: geminiRes[1] || "",
    };
    console.log("Setting tempEditData from geminiRes:", newTempEditData);
    setTempEditData(newTempEditData);
  }, [geminiRes, jobPostData?.jobDescription]);

  // selectedVersion이 변경되어도 newJobDesc는 자동으로 업데이트하지 않음
  // newJobDesc는 오직 저장할 때만 업데이트됨

  // 전체 로딩 상태 계산
  const isLoading = Object.values(loadingStates).some((state) => state);

  // publish 로딩 상태
  const isPublishing = loadingStates.publish;

  const handleEdit = useCallback(
    (section: string, initialData?: any) => {
      if (section === "description") {
        // initialData가 있으면 해당 버전의 데이터만 업데이트하고, 없으면 전체 초기화
        let currentData;
        if (initialData && initialData.description) {
          // 특정 버전에서 편집 버튼을 눌렀을 때
          currentData = {
            manual: jobPostData?.jobDescription || "",
            struct1: geminiRes[0] || "",
            struct2: geminiRes[1] || "",
            [selectedVersion]: initialData.description, // 선택된 버전의 내용으로 업데이트
          };
        } else {
          // 전체 초기화
          currentData = {
            manual: jobPostData?.jobDescription || "",
            struct1: geminiRes[0] || "",
            struct2: geminiRes[1] || "",
          };
        }
        console.log("handleEdit - initialData:", initialData);
        console.log("handleEdit - currentData:", currentData);
        console.log("handleEdit - selectedVersion:", selectedVersion);
        setDialogEditData(currentData); // 다이얼로그 편집용 데이터 설정
      }
      setEditingSection(section);
    },
    [jobPostData?.jobDescription, geminiRes, selectedVersion]
  );

  const handleSave = useCallback(
    (section: string, data: Record<DescriptionVersion, string>) => {
      if (section === "description") {
        const selectedDescription = data[selectedVersion] ?? "";
        console.log("Saving version:", selectedVersion, "with data:", selectedDescription);

        // Save 버튼을 눌렀을 때만 실제 데이터 업데이트
        setJobPostData((prev: any) => ({
          ...prev,
          jobDescriptions: {
            ...prev.jobDescriptions,
            ...data,
          },
          jobDescription: selectedDescription, // 선택된 버전의 내용을 메인 설명으로 설정
        }));

        // newJobDesc도 선택된 버전의 내용으로 업데이트
        setNewJobDesc(selectedDescription);
        setTempEditData(data); // tempEditData도 업데이트
        setDialogEditData(data); // dialogEditData도 동기화
        setEditingSection(null);
      }
    },
    [selectedVersion]
  );

  const handlePublish = useCallback(async () => {
    try {
      console.log("Publishing job post:", newJobDesc);

      // 로딩 시작
      setLoadingStates((prev) => ({ ...prev, publish: true }));

      // apiPatchData 사용 - 성공 시에만 data 반환, 실패 시 자동으로 에러 throw
      const result = await apiPatchData(API_URLS.EMPLOYER.POST.PUBLISH(postId), {
        postId,
        newJobDesc,
      });

      console.log("Publish response:", result);

      // apiPatchData는 성공 시에만 data를 반환하므로, 여기서는 성공 처리만 하면 됨
      showSuccessToast("Job post published successfully");
      router.replace(PAGE_URLS.EMPLOYER.POST.DETAIL(postId));
    } catch (error) {
      console.error("Publish error:", error);
      showErrorToast(error instanceof Error ? error.message : "Failed to publish job post");
    } finally {
      // 로딩 완료
      setLoadingStates((prev) => ({ ...prev, publish: false }));
    }
  }, [postId, newJobDesc, router]);

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
          showEditButtons={useAI}
          showPublishButton
          editableSections={["description"]}
          useAI={useAI}
          geminiRes={geminiRes}
          selectedVersion={selectedVersion}
          onSelectVersion={setSelectedVersion}
          jobDescriptions={tempEditData}
        />
      )}

      {/* Publish 로딩 오버레이 */}
      {isPublishing && <LoadingScreen overlay={true} opacity="light" message="Publishing..." />}
      <BaseDialog
        open={editingSection === "description"}
        onClose={() => {
          setEditingSection(null);
          // 다이얼로그 닫을 때 편집 내용 취소 (원래 상태로 복원)
          setDialogEditData({
            manual: jobPostData?.jobDescription || "",
            struct1: geminiRes[0] || "",
            struct2: geminiRes[1] || "",
          });
        }}
        title="Edit Job Description"
        actions={
          <div className="flex justify-end w-full">
            <button
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              onClick={() => handleSave("description", dialogEditData)}
            >
              Save
            </button>
          </div>
        }
        size="xl"
      >
        {useAI ? (
          (() => {
            const labelMap = {
              manual: "Manual Description",
              struct1: "AI Structure 1",
              struct2: "AI Structure 2",
            };

            const valueMap: Record<"manual" | "struct1" | "struct2", string | undefined> = {
              manual: dialogEditData.manual ?? jobPostData?.jobDescription,
              struct1: dialogEditData.struct1 ?? geminiRes[0],
              struct2: dialogEditData.struct2 ?? geminiRes[1],
            };

            return (
              <div className="p-3 border border-purple-500 bg-purple-50 rounded-xl">
                <p className="text-sm text-gray-500 font-medium mb-2">
                  {labelMap[selectedVersion]}
                </p>
                <TextArea
                  rows={6}
                  value={valueMap[selectedVersion] || ""}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    console.log(`Updating ${selectedVersion} in dialog:`, newValue);
                    setDialogEditData((prev) => {
                      const updated = {
                        ...prev,
                        [selectedVersion]: newValue,
                      };
                      console.log("Updated dialogEditData:", updated);
                      return updated;
                    });
                  }}
                  className="w-full pt-2 pb-1 scrollbar-none"
                />
              </div>
            );
          })()
        ) : (
          <TextArea
            rows={6}
            value={dialogEditData.manual || ""}
            onChange={(e) => {
              const newValue = e.target.value;
              console.log("Updating manual in dialog:", newValue);
              setDialogEditData((prev) => ({
                ...prev,
                manual: newValue,
              }));
            }}
            className="w-full pt-3 pb-1 scrollbar-none"
            placeholder="Describe the role, responsibilities, and what makes this opportunity special..."
          />
        )}
      </BaseDialog>
    </div>
  );
};

export default JobPreviewEditPage;
