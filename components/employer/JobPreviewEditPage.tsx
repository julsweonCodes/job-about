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
import { getCache } from "@/utils/cache";
import { geminiTest } from "@/app/services/gemini-services";

type DescriptionVersion = "manual" | "struct1" | "struct2";

interface Props {
  postId: string;
}

const JobPreviewEditPage: React.FC<Props> = ({ postId }) => {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const useAI = searchParams.get("useAI") === "true";
  const [jobPostData, setJobPostData] = useState<JobPostData>();
  const [geminiRes, setGeminiRes] = useState<string[]>([]);
  const [loadingStates, setLoadingStates] = useState({
    jobPostPreview: false,
    geminiRes: false,
  });
  const [selectedVersion, setSelectedVersion] = useState<DescriptionVersion>("manual");
  const [newJobDesc, setNewJobDesc] = useState<string>();
  const [tempEditData, setTempEditData] = useState<Record<DescriptionVersion, string>>({
    manual: jobPostData?.jobDescription || "",
    struct1: geminiRes[0] || "",
    struct2: geminiRes[1] || "",
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

  useEffect(() => {
    console.log("Updated geminiRes:", geminiRes);
    setTempEditData({
      manual: jobPostData?.jobDescription || "",
      struct1: geminiRes[0] || "",
      struct2: geminiRes[1] || "",
    });
  }, [geminiRes]);

  useEffect(() => {
    if (tempEditData[selectedVersion]) {
      console.log(tempEditData[selectedVersion]);
      console.log(selectedVersion);
      setNewJobDesc(tempEditData[selectedVersion]);
    }
  }, [selectedVersion, tempEditData]);

  // 전체 로딩 상태 계산
  const isLoading = Object.values(loadingStates).some((state) => state);
  const fetchPreviewJobPost = async() => {
    try {
      const res = await fetch(`/api/employer/post/preview/${postId}`);
      const data = await res.json();
      if (res.ok) {
        setJobPostData(data.data.postData);
        setNewJobDesc(data.data.postData.jobDescription);
        /*
        const rawGemini = data.data.geminiRes;
        if (rawGemini) {
          const gemTmp = JSON.parse(rawGemini);
          const struct1Combined = [
            "[Main Responsibilities]",
            ...(gemTmp.struct1?.["Main Responsibilities"] ?? []),
            "[Preferred Qualifications and Benefits]",
            ...(gemTmp.struct1?.["Preferred Qualifications and Benefits"] ?? [])
          ].join("\n");
          const struct2 = gemTmp.struct2 ?? "";
          setGeminiRes([struct1Combined, struct2]);
        }*/
        const gemTxt =
          "{\n" +
          '  "struct1": {\n' +
          '    "Main Responsibilities": [\n' +
          '      "Performing general cleaning duties.",\n' +
          '      "Maintaining a consistent and stable work approach, not easily affected by daily ups and downs."\n' +
          "    ],\n" +
          '    "Preferred Qualifications and Benefits": [\n' +
          '      "Ability to work on-site.",\n' +
          '      "Intermediate English language proficiency.",\n' +
          '      "Wage details are not specified."\n' +
          "    ]\n" +
          "  },\n" +
          '  "struct2": "For this cleaning position, main responsibilities include performing general cleaning duties and maintaining a consistent and stable work approach, without being easily affected by daily ups and downs. Preferred qualifications involve the ability to work on-site and intermediate English language proficiency. Please note that specific wage details are not specified for this role."\n' +
          "}\n";
        const gemTmp = JSON.parse(gemTxt);
        // const gemTmp = getCache(`gemini:${postId}`)
        console.log(gemTmp);
        const struct1Combined = [
          "[Main Responsibilities]",
          ...(gemTmp.struct1?.["Main Responsibilities"] ?? []),
          "[Preferred Qualifications and Benefits]",
          ...(gemTmp.struct1?.["Preferred Qualifications and Benefits"] ?? [])
        ].join("\n");
        const struct2 = gemTmp.struct2 ?? "";
        setGeminiRes([struct1Combined, struct2]);
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

  /*
  const handleSave = (section: string, data: any) => {
    setJobPostData((prev: any) => ({ ...prev, ...data }));
    setEditingSection(null);
    setTempEditData({});
  };
  */
  const handleSave = (section: string, data: Record<DescriptionVersion, string>) => {
    if (section === "description") {
      const selectedDescription = data[selectedVersion] ?? "";
      console.log(selectedVersion);

      setJobPostData((prev: any) => ({
        ...prev,
        jobDescriptions: {
          ...prev.jobDescriptions,
          ...data, // 선택된 것만 수정한 전체 구조
        },
        jobDescription: data[selectedVersion], // 저장용 (간단 미리보기용)
      }));

      setNewJobDesc(selectedDescription);
      setTempEditData(data);
      setEditingSection(null);
    }
  };

  const handlePublish = async () => {
    console.log("Publishing job post:", newJobDesc);
    const res = await fetch("/api/employer/post/preview/[postId]", {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({postId, newJobDesc}),
    });

    if (!res.ok) {
      console.error("error");
      return;
    }
    const result = await res.json();
    console.log(result);
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
        showEditButtons = {useAI}
        showPublishButton
        editableSections={["description"]}
        useAI={useAI}
        geminiRes={geminiRes}
        selectedVersion={selectedVersion}
        onSelectVersion={setSelectedVersion}
        jobDescriptions={tempEditData}
      /> )}
      <BaseDialog
        open={editingSection === "description"}
        onClose={() => {
          setEditingSection(null);
          setTempEditData({
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
              onClick={() => handleSave("description",
                { ...tempEditData,
                  [selectedVersion]: tempEditData[selectedVersion],
                })}
            >
              Save
            </button>
          </div>
        }
        size = "xl"
      >
        {useAI ? (
          (() => {
            const labelMap = {
              manual: "Manual Description",
              struct1: "AI Structure 1",
              struct2: "AI Structure 2",
            };

            const valueMap: Record<"manual" | "struct1" | "struct2", string | undefined> = {
              manual: tempEditData.manual ?? jobPostData?.jobDescription,
              struct1: tempEditData.struct1 ?? geminiRes[0],
              struct2: tempEditData.struct2 ?? geminiRes[1],
            };

            return (
              <div className="p-3 border border-purple-500 bg-purple-50 rounded-xl">
                <p className="text-sm text-gray-500 font-medium mb-2">
                  {labelMap[selectedVersion]}
                </p>
                <TextArea
                  rows={6}
                  value={valueMap[selectedVersion]}
                  onChange={(e) =>
                    setTempEditData((prev) => ({
                      ...prev,
                      [selectedVersion]: e.target.value,
                    }))
                  }
                  className="w-full pt-2 pb-1 scrollbar-none"
                />
              </div>
            );
          })()
        ) : (
          <TextArea
            rows={6}
            value={tempEditData.manual}
            onChange={(e) =>
              setTempEditData((prev) => ({
                ...prev,
                manual: e.target.value,
              }))
            }
            className="w-full pt-3 pb-1 scrollbar-none"
            placeholder="Describe the role, responsibilities, and what makes this opportunity special..."
          />
        )}
      </BaseDialog>

    </div>
  );
};

export default JobPreviewEditPage;
