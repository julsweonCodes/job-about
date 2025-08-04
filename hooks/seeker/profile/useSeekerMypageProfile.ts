import { useCallback } from "react";
import { convertLocationKeyToValue } from "@/constants/location";
import { useCommonData } from "@/hooks/useCommonData";
import { useSeekerProfileData } from "./useSeekerProfileData";
import { useSeekerProfileState, EditingStates } from "./useSeekerProfileState";
import { useSeekerProfileActions } from "./useSeekerProfileActions";
import { ApplicantProfile } from "@/hooks/seeker/useSeekerProfileQueries";

export interface UseSeekerMypageProfileImprovedReturn {
  // State
  userInfo: any;
  seekerProfile: any;
  applicantProfile: ApplicantProfile;
  tempData: ApplicantProfile;
  isInitialized: boolean;
  isLoading: boolean;
  availableSkills: any[];
  availableLocations: string[];
  loadingStates: any;
  isEditing: EditingStates;
  selectedSkills: any[];
  selectedJobTypes: any[];
  dialogStates: any;
  originalExperiences: ApplicantProfile["experiences"];

  // Actions
  setUserInfo: (userInfo: any) => void;
  setSeekerProfile: (profile: any) => void;
  setApplicantProfile: (profile: ApplicantProfile) => void;
  setTempData: (data: ApplicantProfile) => void;
  setIsEditing: (section: keyof EditingStates, value: boolean) => void;
  handleEdit: (section: keyof EditingStates) => void;
  handleCancel: (section: keyof EditingStates) => void;
  handleTempInputChange: (field: keyof ApplicantProfile, value: any) => void;
  updateUserProfile: () => Promise<void>;
  updateProfileImageFile: (file: File) => Promise<void>;

  // Profile Section Actions
  updateProfileSection: (section: string, payload: any, showToast?: boolean) => Promise<boolean>;
  handleOptionsSave: (section: any) => Promise<void>;

  // Skills Actions
  setSelectedSkills: (skills: any[]) => void;
  handleSkillsEdit: () => void;
  handleSkillsConfirm: (skills: any[]) => Promise<void>;
  handleSkillsCancel: () => void;

  // Job Types Actions
  setSelectedJobTypes: (jobTypes: any[]) => void;
  handleJobTypesEdit: () => void;
  handleJobTypesConfirm: (jobTypes: any[]) => Promise<void>;

  // Experience Actions
  deleteExperience: (index: number) => void;
  confirmDeleteExperience: () => void;
  cancelDeleteExperience: () => void;

  // Utility Actions
  setDialogStates: (states: any) => void;
  hasExperiencesChanged: () => boolean;
}

export const useSeekerMypageProfileImproved = (): UseSeekerMypageProfileImprovedReturn => {
  // Data fetching
  const {
    userInfo,
    seekerProfile,
    applicantProfile,
    isInitialized,
    isLoading,
    loadingStates: dataLoadingStates,
    setUserInfo,
    setSeekerProfile,
    setApplicantProfile,
  } = useSeekerProfileData();

  // Common data
  const { skills: availableSkills, locations: availableLocations } = useCommonData();

  // State management
  const {
    tempData,
    isEditing,
    loadingStates: stateLoadingStates,
    selectedSkills,
    selectedJobTypes,
    dialogStates,
    originalExperiences,
    setTempData,
    setIsEditing,
    setLoadingStates,
    setSelectedSkills,
    setSelectedJobTypes,
    setDialogStates,
    hasExperiencesChanged,
  } = useSeekerProfileState(applicantProfile || null);

  // Utility functions
  const handleTempInputChange = useCallback(
    (field: string | number | symbol, value: any) => {
      setTempData((prev: ApplicantProfile) => ({ ...prev, [field]: value }) as ApplicantProfile);
    },
    [setTempData]
  );

  const handleEdit = useCallback(
    (section: keyof EditingStates) => {
      setTempData(applicantProfile);
      setIsEditing(section, true);
    },
    [applicantProfile, setTempData, setIsEditing]
  );

  const handleCancel = useCallback(
    (section: keyof EditingStates) => {
      setTempData(applicantProfile);
      setIsEditing(section, false);
    },
    [applicantProfile, setTempData, setIsEditing]
  );

  // Actions
  const {
    updateProfileSection,
    handleOptionsSave,
    handleSkillsEdit,
    handleSkillsConfirm,
    handleSkillsCancel,
    handleJobTypesEdit,
    handleJobTypesConfirm,
    deleteExperience,
    confirmDeleteExperience,
    cancelDeleteExperience,
    updateUserProfile,
    updateProfileImageFile,
  } = useSeekerProfileActions(
    tempData,
    applicantProfile,
    availableSkills,
    setApplicantProfile,
    setTempData,
    setSelectedSkills,
    setSelectedJobTypes,
    setDialogStates,
    setLoadingStates,
    handleTempInputChange,
    handleCancel,
    dialogStates
  );

  // Combined loading states
  const loadingStates = {
    ...dataLoadingStates,
    ...stateLoadingStates,
  };

  return {
    // State
    userInfo,
    seekerProfile,
    applicantProfile,
    tempData,
    isInitialized,
    isLoading,
    availableSkills,
    availableLocations: availableLocations.map(convertLocationKeyToValue),
    loadingStates,
    isEditing,
    selectedSkills,
    selectedJobTypes,
    dialogStates,
    originalExperiences,

    // Actions
    setUserInfo,
    setSeekerProfile,
    setApplicantProfile,
    setTempData,
    setIsEditing,
    handleEdit,
    handleCancel,
    handleTempInputChange,
    updateUserProfile,
    updateProfileImageFile,

    // Profile Section Actions
    updateProfileSection,
    handleOptionsSave,

    // Skills Actions
    setSelectedSkills,
    handleSkillsEdit,
    handleSkillsConfirm,
    handleSkillsCancel,

    // Job Types Actions
    setSelectedJobTypes,
    handleJobTypesEdit,
    handleJobTypesConfirm,

    // Experience Actions
    deleteExperience,
    confirmDeleteExperience,
    cancelDeleteExperience,

    // Utility Actions
    setDialogStates,
    hasExperiencesChanged,
  };
};
