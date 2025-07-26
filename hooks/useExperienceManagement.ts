import { useState } from "react";
import { JobType } from "@/constants/jobTypes";

export interface ExperienceForm {
  company: string;
  jobType: string;
  startYear: string;
  workedPeriod: string;
  description: string;
}

export const useExperienceManagement = () => {
  const [experienceForm, setExperienceForm] = useState<ExperienceForm>({
    company: "",
    jobType: "",
    startYear: "",
    workedPeriod: "",
    description: "",
  });

  const [editingExperienceIndex, setEditingExperienceIndex] = useState<number>(-1);
  const [showExperienceDialog, setShowExperienceDialog] = useState(false);
  const [showJobTypesDialog, setShowJobTypesDialog] = useState(false);

  const handleAddExperience = () => {
    setExperienceForm({
      company: "",
      jobType: "",
      startYear: "",
      workedPeriod: "",
      description: "",
    });
    setEditingExperienceIndex(-1);
    setShowExperienceDialog(true);
  };

  const handleEditExperience = (index: number, experience: any) => {
    setExperienceForm({
      company: experience.company || "",
      jobType: experience.jobType || "",
      startYear: experience.startYear || "",
      workedPeriod: experience.workedPeriod || "",
      description: experience.description || "",
    });
    setEditingExperienceIndex(index);
    setShowExperienceDialog(true);
  };

  const handleSaveExperience = (experiences: any[], callback: () => void) => {
    if (editingExperienceIndex >= 0) {
      // 편집 모드
      const updatedExperiences = [...experiences];
      updatedExperiences[editingExperienceIndex] = {
        title: experienceForm.jobType,
        company: experienceForm.company,
        duration: `${experienceForm.startYear} - ${experienceForm.workedPeriod}`,
        description: experienceForm.description,
      };
      callback();
    } else {
      // 추가 모드
      const newExperience = {
        title: experienceForm.jobType,
        company: experienceForm.company,
        duration: `${experienceForm.startYear} - ${experienceForm.workedPeriod}`,
        description: experienceForm.description,
      };
      callback();
    }
    setShowExperienceDialog(false);
    setEditingExperienceIndex(-1);
    resetExperienceForm();
  };

  const resetExperienceForm = () => {
    setExperienceForm({
      company: "",
      jobType: "",
      startYear: "",
      workedPeriod: "",
      description: "",
    });
  };

  const handleJobTypeSelect = () => {
    setShowJobTypesDialog(true);
  };

  const handleJobTypeConfirm = (selectedJobTypes: JobType[]) => {
    if (selectedJobTypes.length > 0) {
      setExperienceForm((prev) => ({ ...prev, jobType: selectedJobTypes[0] }));
    }
    setShowJobTypesDialog(false);
  };

  return {
    experienceForm,
    editingExperienceIndex,
    showExperienceDialog,
    showJobTypesDialog,
    setExperienceForm,
    setEditingExperienceIndex,
    setShowExperienceDialog,
    setShowJobTypesDialog,
    handleAddExperience,
    handleEditExperience,
    handleSaveExperience,
    handleJobTypeSelect,
    handleJobTypeConfirm,
    resetExperienceForm,
  };
};
