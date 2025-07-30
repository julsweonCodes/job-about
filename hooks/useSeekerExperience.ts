import { useState } from "react";
import { JobType } from "@/constants/jobTypes";
import { WorkType, WorkPeriod } from "@/constants/enums";

export interface ExperienceForm {
  company: string;
  jobType?: JobType;
  startYear: string;
  workedPeriod?: WorkPeriod;
  workType?: WorkType;
  description: string;
}

export const useSeekerExperience = () => {
  const [experienceForm, setExperienceForm] = useState<ExperienceForm>({
    company: "",
    jobType: undefined,
    startYear: "",
    workedPeriod: undefined,
    workType: undefined,
    description: "",
  });

  const [editingExperienceIndex, setEditingExperienceIndex] = useState<number>(-1);
  const [showExperienceDialog, setShowExperienceDialog] = useState(false);
  const [showJobTypesDialog, setShowJobTypesDialog] = useState(false);

  const handleAddExperience = () => {
    setExperienceForm({
      company: "",
      jobType: undefined,
      startYear: "",
      workedPeriod: undefined,
      workType: undefined,
      description: "",
    });
    setEditingExperienceIndex(-1);
    setShowExperienceDialog(true);
  };

  const handleEditExperience = (index: number, experience: any) => {
    const formData = {
      company: experience.company || "",
      jobType: experience.jobType || "",
      startYear: experience.startYear || "",
      workedPeriod: experience.workedPeriod || "",
      workType: experience.workType || "remote",
      description: experience.description || "",
    };

    setExperienceForm(formData);
    setEditingExperienceIndex(index);
    setShowExperienceDialog(true);
  };

  const handleSaveExperience = (
    experiences: any[],
    callback: (updatedExperiences: any[]) => void
  ) => {
    if (editingExperienceIndex >= 0) {
      // 편집 모드
      const updatedExperiences = [...experiences];
      updatedExperiences[editingExperienceIndex] = {
        company: experienceForm.company,
        jobType: experienceForm.jobType,
        startYear: experienceForm.startYear,
        workedPeriod: experienceForm.workedPeriod,
        workType: experienceForm.workType,
        description: experienceForm.description,
      };
      callback(updatedExperiences);
    } else {
      // 추가 모드
      const newExperience = {
        company: experienceForm.company,
        jobType: experienceForm.jobType,
        startYear: experienceForm.startYear,
        workedPeriod: experienceForm.workedPeriod,
        workType: experienceForm.workType,
        description: experienceForm.description,
      };
      const updatedExperiences = [...experiences, newExperience];
      callback(updatedExperiences);
    }
    setShowExperienceDialog(false);
    setEditingExperienceIndex(-1);
    resetExperienceForm();
  };

  const resetExperienceForm = () => {
    setExperienceForm({
      company: "",
      jobType: undefined,
      startYear: "",
      workedPeriod: undefined,
      workType: undefined,
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
