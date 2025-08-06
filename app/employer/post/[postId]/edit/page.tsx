"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
import LanguageLevelSelector from "@/components/ui/LanguageLevelSelector";
import { API_URLS } from "@/constants/api";
import { apiGetData } from "@/utils/client/API";
import { showErrorToast } from "@/utils/client/toastUtils";

const JobPostEditPage: React.FC = () => {
  const router = useRouter();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [tempEditData, setTempEditData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Job data state
  const [jobData, setJobData] = useState<any>(null);
  const [jobStatus, setJobStatus] = useState<string>("published");

  // 중복 실행 방지를 위한 ref
  const isInitializingRef = useRef(false);

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
  }, []);

  const handleEdit = (section: string, initialData?: any) => {
    console.log("Edit section:", section, "Data:", initialData);

    // 섹션과 항목을 분리 (예: "jobDetails.hourlyWage")
    const [mainSection, subItem] = section.split(".");

    if (subItem) {
      // 개별 항목 수정
      setTempEditData({ [subItem]: initialData[subItem] });
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
            updatedData = {
              ...updatedData,
              jobDescription: data.jobDescription,
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

  // TODO: api call to server
  const handleSaveEdit = async () => {
    console.log("save changes to server", jobData);
  };

  // TODO: api call to server (DRAFT -> PUBLISHED)
  const handlePublish = async () => {
    console.log("publish job post");
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
      />

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
                value={tempEditData.jobDescription || jobData?.jobDescription || ""}
                onChange={(e) =>
                  setTempEditData((prev: any) => ({ ...prev, jobDescription: e.target.value }))
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
            onClose={() => setEditingSection(null)}
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
                  value={tempEditData.hourlyWage || jobData?.hourlyWage || ""}
                  onChange={(e) =>
                    setTempEditData((prev: any) => ({ ...prev, hourlyWage: e.target.value }))
                  }
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
            onClose={() => setEditingSection(null)}
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
                  value={tempEditData.workSchedule || jobData?.workSchedule || ""}
                  onChange={(e) =>
                    setTempEditData((prev: any) => ({ ...prev, workSchedule: e.target.value }))
                  }
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
            onClose={() => setEditingSection(null)}
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
              <LanguageLevelSelector
                value={tempEditData.languageLevel || jobData?.languageLevel}
                onChange={(level) => {
                  setTempEditData((prev: any) => ({ ...prev, languageLevel: level }));
                }}
              />
            </div>
          </BaseDialog>

          {/* Application Deadline DatePicker Dialog */}
          <DatePickerDialog
            open={editingSection === "jobDetails.deadline"}
            onClose={() => setEditingSection(null)}
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
            onClose={() => setEditingSection(null)}
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
