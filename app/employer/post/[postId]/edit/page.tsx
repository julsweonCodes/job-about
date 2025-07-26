"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PostHeader from "@/components/common/PostHeader";
import BaseDialog from "@/components/common/BaseDialog";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import JobPostView from "@/components/common/JobPostView";
import { JobStatus, LanguageLevel } from "@/constants/enums";
import { JobType } from "@/constants/jobTypes";
import { JobPostData } from "@/types/jobPost";

const JobPostEditPage: React.FC = () => {
  const router = useRouter();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [tempEditData, setTempEditData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  // Job data state
  const [jobData, setJobData] = useState<JobPostData>({
    id: "1",
    title: "Cashier",
    jobType: JobType.ACCOUNTANT,
    status: JobStatus.DRAFT,
    business: {
      id: "1",
      name: "Fresh Market Grocery",
      description:
        "Café Luna is a locally-owned coffee shop that's been serving the Vancouver community for over 8 years. We pride ourselves on creating a warm, inclusive environment where both customers and staff feel at home. Our team is like a family, and we believe in supporting each other's growth and goals.",
      photos: [
        "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2",
        "https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2",
        "https://images.pexels.com/photos/2292837/pexels-photo-2292837.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2",
        "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2",
        "https://images.pexels.com/photos/1797428/pexels-photo-1797428.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2",
      ],
      location: "123 Main St, Anytown",
      tags: ["Family-friendly", "No experience required", "Quick hiring"],
    },
    deadline: "August 15",
    schedule: "Flexible, 10–20 hrs/week",
    requiredSkills: ["Cash handling", "Customer service", "Teamwork"],
    requiredPersonality: ["Friendly", "Patient", "Team-oriented"],
    languageLevel: LanguageLevel.INTERMEDIATE,
    hourlyWage: "$15/hr",
    description:
      "Join our team as a friendly cashier! You'll handle transactions, assist customers, and keep the store tidy. No experience needed, just a positive attitude and willingness to learn. Perfect for students or those seeking a flexible schedule.",
  });

  const handleEdit = (section: string, initialData?: any) => {
    setTempEditData(initialData || {});
    setEditingSection(section);
  };

  const handleSave = async (section: string, data: any) => {
    setIsSaving(true);
    try {
      const updatedData = { ...jobData, ...data };
      setJobData(updatedData);

      console.log("Saving section:", section, data);
      // API 호출하여 저장
      // await saveJobPost(updatedData);

      setEditingSection(null);
      setTempEditData({});
      alert(`${section} saved successfully!`);
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    router.push(`/employer/post/preview/${jobData.id}`);
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel? Unsaved changes will be lost.")) {
      router.push(`/employer/post/${jobData.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-pretendard">
      {/* Header */}
      <PostHeader onClickLeft={handleCancel} editMode />

      <JobPostView jobData={jobData} mode="preview" onEdit={handleEdit} showEditButtons={true} />

      {/* Edit Modals */}
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
            value={tempEditData.title || jobData.title}
            onChange={(e) => setTempEditData((prev: any) => ({ ...prev, title: e.target.value }))}
            className="w-full pt-3 pb-1"
          />
        </div>
      </BaseDialog>

      <BaseDialog
        type="bottomSheet"
        open={editingSection === "description"}
        onClose={() => setEditingSection(null)}
        title="Edit Job Description"
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
            value={tempEditData.description || jobData.description}
            onChange={(e) =>
              setTempEditData((prev: any) => ({ ...prev, description: e.target.value }))
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
              value={tempEditData.business?.name || jobData.business.name}
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
              value={tempEditData.business?.location || jobData.business.location}
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
              value={tempEditData.business?.description || jobData.business.description}
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
    </div>
  );
};

export default JobPostEditPage;
