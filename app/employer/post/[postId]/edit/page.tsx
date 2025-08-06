"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import PostHeader from "@/components/common/PostHeader";
import BaseDialog from "@/components/common/BaseDialog";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import JobPostView from "@/components/common/JobPostView";
import DatePickerDialog from "@/app/employer/components/DatePickerDialog";
import JobTypesDialog from "@/components/common/JobTypesDialog";
import RequiredSkillsDialog from "@/app/employer/components/RequiredSkillsDialog";
import RequiredPersonalitiesDialog from "@/app/employer/components/RequiredPersonalitiesDialog";
import OptionSelector from "@/components/ui/OptionSelector";
import { API_URLS } from "@/constants/api";
import { JobPostPayload } from "@/types/employer";
import { LANGUAGE_LEVEL_OPTIONS, WORK_TYPE_OPTIONS } from "@/constants/options";
import { apiGetData, apiPostData } from "@/utils/client/API";
import { showErrorToast, showSuccessToast } from "@/utils/client/toastUtils";
import { JobPostData } from "@/types/jobPost";
import LoadingScreen from "@/components/common/LoadingScreen";
import { formatDateYYYYMMDD } from "@/lib/utils";

const JobPostEditPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const postId = params?.postId as string;
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [tempEditData, setTempEditData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Job data state
  const [jobData, setJobData] = useState<any>(null);
  const [jobStatus, setJobStatus] = useState<string>("published");
  const [selectedVersion, setSelectedVersion] = useState<"manual" | "struct1" | "struct2">(
    "manual"
  );

  // Job Data Payload for Gemini and Publishing
  const [jobPostPayload, setJobPostPayload] = useState<JobPostPayload>();
  // 중복 실행 방지를 위한 ref
  const isInitializingRef = useRef(false);

  const mapToFormData = (data: JobPostData): JobPostPayload => {
    const payload: JobPostPayload = {
      jobTitle: data.title,
      selectedJobType: data.jobType,
      deadline: formatDateYYYYMMDD(data.deadline), // 날짜 포맷 확인 필요
      workSchedule: data.workSchedule,
      requiredSkills: data.requiredSkills,
      requiredWorkStyles: data.requiredWorkStyles,
      wage: data.hourlyWage,
      jobDescription: data.jobDescription,
      languageLevel: data.languageLevel,
      selectedWorkType: data.workType,
      useAI: false, // 기본값 또는 URL 쿼리 파라미터에서 추출 가능
    };
    return payload;
  };

  const onGeminiClicked = async (): Promise<void> => {
    if (!jobPostPayload) return;

    try {
      setLoading(true);
      const response = await apiPostData(API_URLS.EMPLOYER.POST.EDIT(postId), jobPostPayload);

      // Gemini 응답을 jobData에 추가하여 화면에 표시 (새로고침 없이)
      setJobData((prev: any) => ({
        ...prev,
        geminiRes: response,
        jobDescriptions: {
          manual: prev?.jobDescription,
          struct1: response[0],
          struct2: response[1],
        },
        useAI: true, // Gemini 응답이 있음을 표시
        selectedVersion: "manual", // 기본값으로 manual 선택
      }));
    } catch (error) {
      console.error("Gemini API failed:", error);
      showErrorToast("Failed to fetch AI-generated descriptions");
    } finally {
      setLoading(false);
    }
  };

  // Fetch job data on component mount
  useEffect(() => {
    const fetchJobData = async () => {
      if (isInitializingRef.current) return;
      isInitializingRef.current = true;

      try {
        setLoading(true);
        // Get postId from URL
        const pathSegments = window.location.pathname.split("/");
        const postId = pathSegments[pathSegments.length - 2]; // /employer/post/[postId]/edit

        // Get status from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const status = urlParams.get("status") || "published"; // 기본값은 published
        setJobStatus(status);

        const data = await apiGetData(API_URLS.EMPLOYER.POST.DETAIL(postId, status));
        setJobData(data);
        setJobPostPayload(mapToFormData(data));
      } catch (error) {
        console.error("Error fetching job data:", error);
        showErrorToast(error instanceof Error ? error.message : "Failed to fetch job data");

        // 토스트가 보이도록 2초 후에 페이지 이동
        setTimeout(() => {
          router.back();
        }, 2000);
      } finally {
        setLoading(false);
        isInitializingRef.current = false;
      }
    };

    fetchJobData();
  }, [router]);

  const handleEdit = (section: string, initialData?: any) => {
    // 섹션과 항목을 분리 (예: "jobDetails.hourlyWage")
    const [mainSection, subItem] = section.split(".");

    if (subItem) {
      // 개별 항목 수정 - tempEditData를 완전히 새로 설정
      const editData = { [subItem]: initialData[subItem] };
      setTempEditData(editData);
      setEditingSection(section);
    } else {
      // 전체 섹션 수정
      setTempEditData(initialData || {});
      setEditingSection(section);
    }
  };

  const handleSave = async (section: string, data: any) => {
    setIsSaving(true);
    try {
      let updatedData = { ...jobData };

      // 섹션과 항목을 분리
      const [mainSection, subItem] = section.split(".");

      if (subItem) {
        // 개별 항목 수정
        switch (mainSection) {
          case "jobDetails":
            updatedData = {
              ...updatedData,
              [subItem]: data[subItem] || updatedData[subItem],
            };
            break;
          case "skillsAndStyles":
            if (subItem === "requiredSkills") {
              updatedData = {
                ...updatedData,
                requiredSkills: data.requiredSkills || updatedData.requiredSkills,
              };
            } else if (subItem === "requiredWorkStyles") {
              updatedData = {
                ...updatedData,
                requiredWorkStyles: data.requiredWorkStyles || updatedData.requiredWorkStyles,
              };
            }
            break;
        }
      } else {
        // 전체 섹션 수정
        switch (section) {
          case "header":
            updatedData = {
              ...updatedData,
              title: data.title,
              businessLocInfo: {
                ...updatedData.businessLocInfo,
                name: data.business?.name || updatedData.businessLocInfo.name,
              },
            };
            break;
          case "description":
            // description 수정 시 jobDescriptions도 함께 업데이트
            const selectedVersion = data.selectedVersion || "manual";
            const updatedJobDescriptions = {
              ...updatedData.jobDescriptions,
              [selectedVersion]: data.description,
            };

            updatedData = {
              ...updatedData,
              jobDescription: data.description,
              jobDescriptions: updatedJobDescriptions,
              selectedVersion: selectedVersion,
            };
            break;
          case "business":
            updatedData = {
              ...updatedData,
              businessLocInfo: {
                ...updatedData.businessLocInfo,
                name: data.business?.name || updatedData.businessLocInfo.name,
                address: data.business?.location || updatedData.businessLocInfo.address,
                bizDescription:
                  data.business?.description || updatedData.businessLocInfo.bizDescription,
              },
            };
            break;
          case "jobDetails":
            updatedData = {
              ...updatedData,
              hourlyWage: data.hourlyWage || updatedData.hourlyWage,
              workSchedule: data.workSchedule || updatedData.workSchedule,
              languageLevel: data.languageLevel || updatedData.languageLevel,
              deadline: data.deadline || updatedData.deadline,
              jobType: data.jobType || updatedData.jobType,
              workType: data.workType || updatedData.workType,
            };
            break;
          case "skillsAndStyles":
            updatedData = {
              ...updatedData,
              requiredSkills: data.requiredSkills || updatedData.requiredSkills,
              requiredWorkStyles: data.requiredWorkStyles || updatedData.requiredWorkStyles,
            };
            break;
        }
      }

      setJobData(updatedData);
      setEditingSection(null);
      setTempEditData({});
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Save Edit
  const handleSaveEdit = async () => {
    if (!jobData) {
      showErrorToast("No job data to save");
      return;
    }

    setIsSaving(true);
    try {
      const payload = mapToFormData(jobData);
      console.log(payload);
      const response = await apiPostData(API_URLS.EMPLOYER.POST.UPDATE(postId), payload);

      if (response) {
        showSuccessToast("Job post updated successfully");
        // 업데이트된 데이터로 상태 갱신
        setJobData((prev: any) => ({
          ...prev,
          ...response,
        }));
      }
    } catch (error) {
      console.error("Error saving job post:", error);
      showErrorToast("Failed to save job post changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!jobData) {
      showErrorToast("No job data to publish");
      return;
    }

    setIsSaving(true);
    try {
      const payload = mapToFormData(jobData);
      const response = await apiPostData(API_URLS.EMPLOYER.POST.DETAIL(postId), payload);

      if (response && response.status === "PUBLISHED") {
        showSuccessToast("Job Post published successfully");
        setJobStatus("published");
        // 업데이트된 데이터로 상태 갱신
        setJobData((prev: any) => ({
          ...prev,
          ...response,
        }));
      } else {
        showErrorToast("Something went wrong publishing job post");
      }
    } catch (error) {
      console.error("Error publishing job post:", error);
      showErrorToast("Failed to publish job post");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setShowCancelDialog(true);
  };

  const handleConfirmCancel = () => {
    router.back();
  };

  const handleCloseCancelDialog = () => {
    setShowCancelDialog(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-pretendard">
      {/* Header */}
      <PostHeader onClickLeft={handleCancel} editMode />

      <JobPostView
        jobData={loading ? null : jobData}
        mode="edit"
        onEdit={handleEdit}
        showEditButtons={true}
        onSaveEdit={handleSaveEdit}
        onPublish={handlePublish}
        showSaveEditButton={jobStatus === "published"}
        showPublishButton={jobStatus === "draft"}
        isDraft={jobStatus === "draft"}
        editableSections={["header", "description", "business", "jobDetails", "skillsAndStyles"]}
        onGeminiClicked={onGeminiClicked}
        useAI={jobData?.useAI}
        geminiRes={jobData?.geminiRes}
        jobDescriptions={jobData?.jobDescriptions}
        selectedVersion={selectedVersion}
        onSelectVersion={(version) => {
          setSelectedVersion(version);
          setJobData((prev: any) => ({
            ...prev,
            selectedVersion: version,
          }));
        }}
      />

      {/* Saving Screen - Only show when updating */}
      {isSaving && (
        <LoadingScreen
          message="Saving changes..."
          overlay={true}
          spinnerSize="lg"
          spinnerColor="purple-circle"
          opacity="medium"
        />
      )}

      {/* Cancel Confirmation Dialog */}
      <BaseDialog
        open={showCancelDialog}
        onClose={handleCloseCancelDialog}
        title="Cancel Editing"
        type="bottomSheet"
        size="sm"
        actions={
          <div className="flex gap-3 w-full">
            <Button
              onClick={handleCloseCancelDialog}
              variant="secondary"
              size="lg"
              className="w-full"
            >
              Continue
            </Button>
            <Button onClick={handleConfirmCancel} variant="red" size="lg" className="w-full">
              Cancel
            </Button>
          </div>
        }
      >
        <div className="text-center py-6">
          <p className="text-sm text-gray-600 leading-relaxed text-sm sm:text-base">
            Are you sure you want to cancel editing?
            <br /> All <span className="font-semibold text-gray-900">unsaved changes</span> will be
            lost and cannot be recovered.
          </p>
        </div>
      </BaseDialog>

      {/* Edit Modals - Only show when jobData is available */}
      {jobData && (
        <>
          <BaseDialog
            type="bottomSheet"
            open={editingSection === "header"}
            onClose={() => setEditingSection(null)}
            title="Edit Job Title"
            actions={
              <>
                <Button
                  onClick={() => handleSave("header", tempEditData)}
                  size="lg"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </>
            }
          >
            <div className="flex flex-col gap-1 sm:gap-2">
              <span className="text-sm md:text-base text-gray-500">
                You can edit the job title here
              </span>
              <Input
                value={tempEditData.title || jobData?.title || ""}
                onChange={(e) =>
                  setTempEditData((prev: any) => ({ ...prev, title: e.target.value }))
                }
                className="w-full pt-3 pb-1"
              />
            </div>
          </BaseDialog>

          <BaseDialog
            type="bottomSheet"
            open={editingSection === "description"}
            onClose={() => setEditingSection(null)}
            title="Edit Job Description"
            size="lg"
            actions={
              <>
                <Button
                  onClick={() => handleSave("description", tempEditData)}
                  size="lg"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </>
            }
          >
            <div className="flex flex-col gap-1 sm:gap-2">
              <span className="text-sm md:text-base text-gray-500">
                You can edit the job description here
              </span>
              <TextArea
                rows={6}
                value={
                  tempEditData.description ||
                  (jobData?.selectedVersion &&
                    jobData?.jobDescriptions?.[jobData.selectedVersion]) ||
                  jobData?.jobDescription ||
                  ""
                }
                onChange={(e) =>
                  setTempEditData((prev: any) => ({
                    ...prev,
                    description: e.target.value,
                    selectedVersion: jobData?.selectedVersion || "manual",
                  }))
                }
                className="w-full pt-3 pb-1 scrollbar-none"
                placeholder="Describe the role, responsibilities, and what makes this opportunity special..."
              />
            </div>
          </BaseDialog>

          <BaseDialog
            type="bottomSheet"
            open={editingSection === "business"}
            onClose={() => setEditingSection(null)}
            title="Edit Business Information"
            actions={
              <>
                <Button
                  onClick={() => handleSave("business", tempEditData)}
                  size="lg"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </>
            }
          >
            <div className="flex flex-col gap-4">
              <div>
                <span className="text-sm md:text-base text-gray-500 mb-2 block">Business Name</span>
                <Input
                  value={tempEditData.business?.name || jobData?.businessLocInfo?.name || ""}
                  onChange={(e) =>
                    setTempEditData((prev: any) => ({
                      ...prev,
                      business: { ...prev.business, name: e.target.value },
                    }))
                  }
                  className="w-full"
                />
              </div>
              <div>
                <span className="text-sm md:text-base text-gray-500 mb-2 block">Location</span>
                <Input
                  value={tempEditData.business?.location || jobData?.businessLocInfo?.address || ""}
                  onChange={(e) =>
                    setTempEditData((prev: any) => ({
                      ...prev,
                      business: { ...prev.business, location: e.target.value },
                    }))
                  }
                  className="w-full"
                />
              </div>
              <div>
                <span className="text-sm md:text-base text-gray-500 mb-2 block">
                  Business Description
                </span>
                <TextArea
                  rows={4}
                  value={
                    tempEditData.business?.description ||
                    jobData?.businessLocInfo?.bizDescription ||
                    ""
                  }
                  onChange={(e) =>
                    setTempEditData((prev: any) => ({
                      ...prev,
                      business: { ...prev.business, description: e.target.value },
                    }))
                  }
                  className="w-full"
                  placeholder="Describe your business..."
                />
              </div>
            </div>
          </BaseDialog>

          {/* Individual Job Details Edit Dialogs */}

          {/* Hourly Wage Edit Dialog */}
          <BaseDialog
            type="bottomSheet"
            open={editingSection === "jobDetails.hourlyWage"}
            onClose={() => {
              setEditingSection(null);
              setTempEditData({});
            }}
            title="Edit Hourly Wage"
            actions={
              <>
                <Button
                  onClick={() => handleSave("jobDetails.hourlyWage", tempEditData)}
                  size="lg"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </>
            }
          >
            <div className="flex flex-col gap-4">
              <div>
                <span className="text-sm md:text-base text-gray-500 mb-2 block">Hourly Wage</span>
                <Input
                  value={tempEditData.hourlyWage ?? jobData?.hourlyWage ?? ""}
                  onChange={(e) => {
                    setTempEditData((prev: any) => ({ ...prev, hourlyWage: e.target.value }));
                  }}
                  className="w-full"
                  placeholder="e.g., 25"
                />
              </div>
            </div>
          </BaseDialog>

          {/* Work Schedule Edit Dialog */}
          <BaseDialog
            type="bottomSheet"
            open={editingSection === "jobDetails.workSchedule"}
            onClose={() => {
              setEditingSection(null);
              setTempEditData({});
            }}
            title="Edit Work Schedule"
            actions={
              <>
                <Button
                  onClick={() => handleSave("jobDetails.workSchedule", tempEditData)}
                  size="lg"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </>
            }
          >
            <div className="flex flex-col gap-4">
              <div>
                <span className="text-sm md:text-base text-gray-500 mb-2 block">Work Schedule</span>
                <Input
                  value={tempEditData.workSchedule ?? jobData?.workSchedule ?? ""}
                  onChange={(e) => {
                    setTempEditData((prev: any) => ({ ...prev, workSchedule: e.target.value }));
                  }}
                  className="w-full"
                  placeholder="e.g., Monday to Friday, 9 AM - 5 PM"
                />
              </div>
            </div>
          </BaseDialog>

          {/* Language Level Edit Dialog */}
          <BaseDialog
            type="bottomSheet"
            open={editingSection === "jobDetails.languageLevel"}
            onClose={() => {
              setEditingSection(null);
              setTempEditData({});
            }}
            title="Select Language Level"
            actions={
              <>
                <Button
                  onClick={() => handleSave("jobDetails.languageLevel", tempEditData)}
                  size="lg"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </>
            }
          >
            <div className="flex flex-col gap-4 py-5">
              <OptionSelector
                options={LANGUAGE_LEVEL_OPTIONS}
                value={tempEditData.languageLevel ?? jobData?.languageLevel}
                onChange={(level) => {
                  setTempEditData((prev: any) => ({ ...prev, languageLevel: level }));
                }}
              />
            </div>
          </BaseDialog>

          {/* Application Deadline DatePicker Dialog */}
          <DatePickerDialog
            open={editingSection === "jobDetails.deadline"}
            onClose={() => {
              setEditingSection(null);
              setTempEditData({});
            }}
            value={
              tempEditData.deadline
                ? new Date(tempEditData.deadline)
                : jobData?.deadline
                  ? new Date(jobData.deadline)
                  : null
            }
            onChange={(date) => {
              if (date) {
                const formattedDate = date.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
                setTempEditData((prev: any) => ({ ...prev, deadline: formattedDate }));
                handleSave("jobDetails.deadline", { deadline: formattedDate });
              }
            }}
            confirmLabel="Save"
          />

          {/* Job Type Dialog */}
          <JobTypesDialog
            title="Select Job Type"
            open={editingSection === "jobDetails.jobType"}
            onClose={() => {
              setEditingSection(null);
              setTempEditData({});
            }}
            selectedJobTypes={
              tempEditData.jobType
                ? [tempEditData.jobType]
                : jobData?.jobType
                  ? [jobData.jobType]
                  : []
            }
            onConfirm={(jobTypes) => {
              if (jobTypes.length > 0) {
                setTempEditData((prev: any) => ({ ...prev, jobType: jobTypes[0] }));
                handleSave("jobDetails.jobType", { jobType: jobTypes[0] });
              }
            }}
            maxSelected={1}
          />

          {/* Work Type Dialog */}
          <BaseDialog
            type="bottomSheet"
            open={editingSection === "jobDetails.workType"}
            onClose={() => {
              setEditingSection(null);
              setTempEditData({});
            }}
            title="Select Work Type"
            actions={
              <>
                <Button
                  onClick={() => handleSave("jobDetails.workType", tempEditData)}
                  size="lg"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </>
            }
          >
            <div className="flex flex-col gap-4 py-5">
              <OptionSelector
                options={WORK_TYPE_OPTIONS}
                value={tempEditData.workType ?? jobData?.workType ?? ""}
                onChange={(workType) => {
                  setTempEditData((prev: any) => ({ ...prev, workType: workType }));
                }}
              />
            </div>
          </BaseDialog>

          {/* Individual Skills & Work Styles Edit Dialogs */}

          {/* Required Skills Dialog */}
          <RequiredSkillsDialog
            open={editingSection === "skillsAndStyles.requiredSkills"}
            onClose={() => setEditingSection(null)}
            selectedSkills={tempEditData.requiredSkills || jobData?.requiredSkills || []}
            onConfirm={(skills) => {
              setTempEditData((prev: any) => ({ ...prev, requiredSkills: skills }));
              handleSave("skillsAndStyles.requiredSkills", { requiredSkills: skills });
            }}
          />

          {/* Required Work Styles Dialog */}
          <RequiredPersonalitiesDialog
            open={editingSection === "skillsAndStyles.requiredWorkStyles"}
            onClose={() => setEditingSection(null)}
            selectedTraits={tempEditData.requiredWorkStyles || jobData?.requiredWorkStyles || []}
            onConfirm={(workStyles) => {
              setTempEditData((prev: any) => ({ ...prev, requiredWorkStyles: workStyles }));
              handleSave("skillsAndStyles.requiredWorkStyles", { requiredWorkStyles: workStyles });
            }}
          />
        </>
      )}
    </div>
  );
};

export default JobPostEditPage;
