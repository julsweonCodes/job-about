import { useState, useCallback, useEffect } from "react";
import { Skill } from "@/types/profile";
import { JobType } from "@/constants/jobTypes";
import { ApplicantProfile } from "./useSeekerProfileData";

export interface EditingStates {
  basicInfo: boolean;
  contact: boolean;
  location: boolean;
  description: boolean;
  skills: boolean;
  workType: boolean;
  jobTypes: boolean;
  availability: boolean;
  languages: boolean;
  workExperience: boolean;
}

export interface DeleteConfirmDialogState {
  isOpen: boolean;
  experienceIndex: number | null;
}

export interface DialogStates {
  profile: boolean;
  imageUpload: boolean;
  skills: boolean;
  preferredJobTypes: boolean;
  deleteConfirm: DeleteConfirmDialogState;
}

export interface LoadingStates {
  profileUpdate: boolean;
  imageUpload: boolean;
  skillsUpdate: boolean;
  jobTypesUpdate: boolean;
  experienceSave: boolean;
}

// Constants
const INITIAL_EDITING_STATES: EditingStates = {
  basicInfo: false,
  contact: false,
  location: false,
  description: false,
  skills: false,
  workType: false,
  jobTypes: false,
  availability: false,
  languages: false,
  workExperience: false,
};

const INITIAL_LOADING_STATES: LoadingStates = {
  profileUpdate: false,
  imageUpload: false,
  skillsUpdate: false,
  jobTypesUpdate: false,
  experienceSave: false,
};

const INITIAL_DIALOG_STATES: DialogStates = {
  profile: false,
  imageUpload: false,
  skills: false,
  preferredJobTypes: false,
  deleteConfirm: { isOpen: false, experienceIndex: null },
};

interface UseProfileStateReturn {
  // State
  tempData: ApplicantProfile;
  isEditing: EditingStates;
  loadingStates: LoadingStates;
  selectedSkills: Skill[];
  selectedJobTypes: JobType[];
  dialogStates: DialogStates;
  originalExperiences: ApplicantProfile["experiences"];

  // Actions
  setTempData: (data: ApplicantProfile | ((prev: ApplicantProfile) => ApplicantProfile)) => void;
  setIsEditing: (section: keyof EditingStates, value: boolean) => void;
  setLoadingStates: (states: Partial<LoadingStates>) => void;
  setSelectedSkills: (skills: Skill[]) => void;
  setSelectedJobTypes: (jobTypes: JobType[]) => void;
  setDialogStates: (states: Partial<DialogStates>) => void;
  setOriginalExperiences: (experiences: ApplicantProfile["experiences"]) => void;

  // Computed
  hasExperiencesChanged: () => boolean;
}

export const useSeekerProfileState = (
  applicantProfile: ApplicantProfile | null
): UseProfileStateReturn => {
  // Default profile when applicantProfile is null
  const defaultProfile: ApplicantProfile = {
    name: "",
    description: "",
    joinDate: "",
    personalityName: "",
    personalityDesc: "",
    location: "",
    phone: "",
    skillIds: [],
    workType: "",
    jobTypes: [],
    availabilityDay: "",
    availabilityTime: "",
    englishLevel: "",
    experiences: [],
  };

  // State
  const [tempData, setTempData] = useState<ApplicantProfile>(applicantProfile || defaultProfile);
  const [isEditing, setIsEditingState] = useState<EditingStates>(INITIAL_EDITING_STATES);
  const [loadingStates, setLoadingStatesState] = useState<LoadingStates>(INITIAL_LOADING_STATES);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<JobType[]>([]);
  const [dialogStates, setDialogStatesState] = useState<DialogStates>(INITIAL_DIALOG_STATES);
  const [originalExperiences, setOriginalExperiences] = useState<ApplicantProfile["experiences"]>(
    []
  );

  // Sync tempData with applicantProfile
  useEffect(() => {
    if (applicantProfile) {
      setTempData(applicantProfile);
      setOriginalExperiences(applicantProfile.experiences);
    }
  }, [applicantProfile]);

  // Actions
  const setIsEditing = useCallback((section: keyof EditingStates, value: boolean) => {
    setIsEditingState((prev) => ({ ...prev, [section]: value }));
  }, []);

  const setLoadingStates = useCallback((states: Partial<LoadingStates>) => {
    setLoadingStatesState((prev) => ({ ...prev, ...states }));
  }, []);

  const setDialogStates = useCallback((states: Partial<DialogStates>) => {
    setDialogStatesState((prev) => ({ ...prev, ...states }));
  }, []);

  // Check if experiences have changed
  const hasExperiencesChanged = useCallback(() => {
    if (originalExperiences.length !== tempData.experiences.length) {
      return true;
    }

    return tempData.experiences.some((exp, index) => {
      const original = originalExperiences[index];
      if (!original) return true;

      return (
        exp.company !== original.company ||
        exp.jobType !== original.jobType ||
        exp.startYear !== original.startYear ||
        exp.workedPeriod !== original.workedPeriod ||
        exp.workType !== original.workType ||
        exp.description !== original.description
      );
    });
  }, [tempData.experiences, originalExperiences]);

  return {
    // State
    tempData,
    isEditing,
    loadingStates,
    selectedSkills,
    selectedJobTypes,
    dialogStates,
    originalExperiences,

    // Actions
    setTempData,
    setIsEditing,
    setLoadingStates,
    setSelectedSkills,
    setSelectedJobTypes,
    setDialogStates,
    setOriginalExperiences,

    // Computed
    hasExperiencesChanged,
  };
};
