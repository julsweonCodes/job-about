"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PostHeader from "@/components/common/PostHeader";
import BaseDialog from "@/components/common/BaseDialog";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import JobPostView from "@/components/common/JobPostView";
import { API_URLS } from "@/constants/api";

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

  // Fetch job data on component mount
  useEffect(() => {
    const fetchJobData = async () => {
      try {
        setLoading(true);
        // Get postId from URL
        const pathSegments = window.location.pathname.split("/");
        const postId = pathSegments[pathSegments.length - 2]; // /employer/post/[postId]/edit

        // Get status from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const status = urlParams.get("status") || "published"; // 기본값은 published
        setJobStatus(status);

        const response = await fetch(API_URLS.EMPLOYER.POST.DETAIL(postId, status));

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.data) {
          setJobData(result.data);
        } else {
          console.error("No data in response");
          setJobData(null);
        }
      } catch (error) {
        console.error("Error fetching job data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, []);

  const handleEdit = (section: string, initialData?: any) => {
    setTempEditData(initialData || {});
    setEditingSection(section);
  };

  const handleSave = async (section: string, data: any) => {
    setIsSaving(true);
    try {
      const updatedData = { ...jobData, ...data };
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
    console.log("save changes to server");
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
                  value={tempEditData.business?.name || jobData?.business?.name || ""}
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
                  value={tempEditData.business?.location || jobData?.business?.location || ""}
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
                  value={tempEditData.business?.description || jobData?.business?.description || ""}
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
        </>
      )}
    </div>
  );
};

export default JobPostEditPage;
