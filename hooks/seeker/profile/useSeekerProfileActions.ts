import { useCallback } from "react";
import { API_URLS } from "@/constants/api";
import { showErrorToast, showSuccessToast } from "@/utils/client/toastUtils";
import { useAuthStore } from "@/stores/useAuthStore";
import { applicantProfile, Skill } from "@/types/profile";
import { apiPatchData } from "@/utils/client/API";
import { useCommonData } from "@/hooks/useCommonData";
import { JobType } from "@/constants/jobTypes";
import { LanguageLevel } from "@/constants/enums";
import {
  toPrismaWorkType,
  toPrismaJobType,
  toPrismaLanguageLevel,
  toPrismaAvailableDay,
  toPrismaAvailableHour,
  toPrismaLocation,
  toPrismaWorkPeriod,
} from "@/types/enumMapper";
import { ApplicantProfile } from "./useSeekerProfileData";
import { EditingStates, LoadingStates, DialogStates } from "./useSeekerProfileState";

const SECTION_MAPPINGS = {
  contact: (data: any) => ({
    phone: data.phone,
  }),
  location: (data: any) => ({
    location: toPrismaLocation(data.location),
  }),
  description: (data: any) => ({
    description: data.description,
  }),
  skills: (data: any) => ({
    profile_practical_skills: data.skillIds.map((i: number) => ({
      practical_skill_id: i,
    })),
  }),
  workType: (data: any) => ({
    work_type: toPrismaWorkType(data.workType),
  }),
  jobTypes: (data: any) => ({
    job_type1: toPrismaJobType(data.jobTypes[0]),
    ...(data.jobTypes[1] && {
      job_type2: toPrismaJobType(data.jobTypes[1]),
    }),
    ...(data.jobTypes[2] && {
      job_type3: toPrismaJobType(data.jobTypes[2]),
    }),
  }),
  availability: (data: any) => ({
    available_day: toPrismaAvailableDay(data.availabilityDay),
    available_hour: toPrismaAvailableHour(data.availabilityTime),
  }),
  languages: (data: any) => ({
    language_level: toPrismaLanguageLevel(data.englishLevel),
  }),
  workExperience: (data: any) => ({
    work_experiences: data.experiences.map((exp: any) => ({
      company_name: exp.company,
      job_type: toPrismaJobType(exp.jobType),
      start_year: exp.startYear,
      work_period: toPrismaWorkPeriod(exp.workedPeriod),
      work_type: toPrismaWorkType(exp.workType),
      description: exp.description,
    })),
  }),
} as const;

interface UseProfileActionsReturn {
  // Profile Section Actions
  updateProfileSection: (
    section: string,
    payload: Partial<applicantProfile>,
    showToast?: boolean
  ) => Promise<boolean>;
  handleOptionsSave: (section: keyof typeof SECTION_MAPPINGS) => Promise<void>;

  // Skills Actions
  handleSkillsEdit: () => void;
  handleSkillsConfirm: (skills: Skill[]) => Promise<void>;
  handleSkillsCancel: () => void;

  // Job Types Actions
  handleJobTypesEdit: () => void;
  handleJobTypesConfirm: (jobTypes: JobType[]) => Promise<void>;

  // Experience Actions
  deleteExperience: (index: number) => void;
  confirmDeleteExperience: () => void;
  cancelDeleteExperience: () => void;

  // User Profile Actions
  updateUserProfile: () => Promise<void>;
  updateProfileImageFile: (file: File) => Promise<void>;
}

export const useSeekerProfileActions = (
  tempData: ApplicantProfile,
  applicantProfile: ApplicantProfile,
  availableSkills: Skill[],
  setApplicantProfile: (profile: ApplicantProfile) => void,
  setTempData: (data: ApplicantProfile) => void,
  setSelectedSkills: (skills: Skill[]) => void,
  setSelectedJobTypes: (jobTypes: JobType[]) => void,
  setDialogStates: (states: Partial<DialogStates>) => void,
  setLoadingStates: (states: Partial<LoadingStates>) => void,
  handleTempInputChange: (field: keyof ApplicantProfile, value: any) => void,
  handleCancel: (section: keyof EditingStates) => void,
  dialogStates: DialogStates
): UseProfileActionsReturn => {
  const { updateProfileImage } = useAuthStore();

  // Centralized error handler
  const handleApiError = useCallback((error: Error, context: string) => {
    console.error(`Error in ${context}:`, error);
    showErrorToast(`Failed to ${context}`);
  }, []);

  // Profile Section Actions
  const updateProfileSection = useCallback(
    async (section: string, payload: Partial<applicantProfile>, showToast: boolean = true) => {
      try {
        setLoadingStates({ profileUpdate: true });
        console.log("🔍 updateProfileSection payload:", payload);
        await apiPatchData(API_URLS.SEEKER.PROFILES, payload);

        if (showToast) {
          showSuccessToast(`${section} updated successfully`);
        }
        setApplicantProfile(tempData);
        return true;
      } catch (error) {
        handleApiError(error as Error, `update ${section}`);
        return false;
      } finally {
        setLoadingStates({ profileUpdate: false });
      }
    },
    [tempData, setApplicantProfile, setLoadingStates, handleApiError]
  );

  const handleOptionsSave = useCallback(
    async (section: keyof typeof SECTION_MAPPINGS) => {
      try {
        const mapper = SECTION_MAPPINGS[section];
        if (!mapper) {
          showErrorToast(`Unknown section: ${section}`);
          return;
        }

        const payload = mapper(tempData);
        const success = await updateProfileSection(section, payload);

        if (success) {
          handleCancel(section);
        }
      } catch (error) {
        handleApiError(error as Error, `update ${section}`);
      }
    },
    [tempData, updateProfileSection, handleCancel, handleApiError]
  );

  // Skills Actions
  const handleSkillsEdit = useCallback(() => {
    const currentSkills = applicantProfile.skillIds
      .map((skillId) => availableSkills.find((skill) => skill.id === skillId))
      .filter(Boolean) as Skill[];
    setSelectedSkills(currentSkills);
    setDialogStates({ skills: true });
  }, [applicantProfile.skillIds, availableSkills, setSelectedSkills, setDialogStates]);

  const handleSkillsConfirm = useCallback(
    async (skills: Skill[]) => {
      try {
        setLoadingStates({ skillsUpdate: true });
        const skillIds = skills.map((skill) => skill.id);
        handleTempInputChange("skillIds", skillIds);
        setDialogStates({ skills: false });

        const payload = {
          profile_practical_skills: skillIds.map((i: number) => ({
            practical_skill_id: i,
          })),
        };

        const success = await updateProfileSection("skills", payload, false);
        if (success) {
          setApplicantProfile({
            ...applicantProfile,
            skillIds: skillIds,
          });
          showSuccessToast("Skills updated successfully!");
        }
      } finally {
        setLoadingStates({ skillsUpdate: false });
      }
    },
    [
      handleTempInputChange,
      updateProfileSection,
      applicantProfile,
      setApplicantProfile,
      setDialogStates,
      setLoadingStates,
    ]
  );

  const handleSkillsCancel = useCallback(() => {
    setDialogStates({ skills: false });
  }, [setDialogStates]);

  // Job Types Actions
  const handleJobTypesEdit = useCallback(() => {
    const currentJobTypes = tempData.jobTypes.map((type: string) => type as JobType);
    setSelectedJobTypes(currentJobTypes);
    setDialogStates({ preferredJobTypes: true });
  }, [tempData.jobTypes, setSelectedJobTypes, setDialogStates]);

  const handleJobTypesConfirm = useCallback(
    async (jobTypes: JobType[]) => {
      try {
        setLoadingStates({ jobTypesUpdate: true });
        const jobTypeStrings = jobTypes.map((type) => type);
        setTempData({ ...tempData, jobTypes: jobTypeStrings });
        setDialogStates({ preferredJobTypes: false });

        const payload = {
          job_type1: jobTypeStrings[0] ? toPrismaJobType(jobTypeStrings[0]) : null,
          job_type2: jobTypeStrings[1] ? toPrismaJobType(jobTypeStrings[1]) : null,
          job_type3: jobTypeStrings[2] ? toPrismaJobType(jobTypeStrings[2]) : null,
        };

        try {
          console.log("🔍 job types payload:", payload);
          await apiPatchData(API_URLS.SEEKER.PROFILES, payload);

          setApplicantProfile({
            ...applicantProfile,
            jobTypes: jobTypeStrings,
          });
          showSuccessToast("Job types updated successfully!");
        } catch (error) {
          handleApiError(error as Error, "update job types");
        }
      } finally {
        setLoadingStates({ jobTypesUpdate: false });
      }
    },
    [
      tempData,
      setTempData,
      setApplicantProfile,
      applicantProfile,
      setDialogStates,
      setLoadingStates,
      handleApiError,
    ]
  );

  // Experience Actions
  const deleteExperience = useCallback(
    (index: number) => {
      setDialogStates({
        deleteConfirm: { isOpen: true, experienceIndex: index },
      });
    },
    [setDialogStates]
  );

  const confirmDeleteExperience = useCallback(() => {
    const { experienceIndex } = dialogStates.deleteConfirm;
    if (experienceIndex !== null) {
      const updatedExperiences = tempData.experiences.filter((_, i) => i !== experienceIndex);
      setTempData({ ...tempData, experiences: updatedExperiences });
      showSuccessToast("Experience deleted successfully!");
    }
    setDialogStates({
      deleteConfirm: { isOpen: false, experienceIndex: null },
    });
  }, [dialogStates.deleteConfirm, tempData, setTempData, setDialogStates]);

  const cancelDeleteExperience = useCallback(() => {
    setDialogStates({
      deleteConfirm: { isOpen: false, experienceIndex: null },
    });
  }, [setDialogStates]);

  // User Profile Actions
  const updateUserProfile = useCallback(async () => {
    try {
      const formData = new FormData();
      formData.append("name", tempData.name);
      formData.append("description", tempData.description);

      await apiPatchData(API_URLS.USER.UPDATE, formData);
      setApplicantProfile(tempData);
      showSuccessToast("Profile updated successfully!");
    } catch (error) {
      handleApiError(error as Error, "update profile");
    }
  }, [tempData, setApplicantProfile, handleApiError]);

  const updateProfileImageFile = useCallback(
    async (file: File) => {
      try {
        const formData = new FormData();
        formData.append("img", file);

        const result = await apiPatchData(API_URLS.USER.UPDATE, formData);

        if (result && result.img_url !== undefined) {
          showSuccessToast("Profile image updated!");
        } else {
          showErrorToast("Failed to update profile image");
        }
      } catch (error) {
        handleApiError(error as Error, "update profile image");
      }
    },
    [updateProfileImage, handleApiError]
  );

  return {
    // Profile Section Actions
    updateProfileSection,
    handleOptionsSave,

    // Skills Actions
    handleSkillsEdit,
    handleSkillsConfirm,
    handleSkillsCancel,

    // Job Types Actions
    handleJobTypesEdit,
    handleJobTypesConfirm,

    // Experience Actions
    deleteExperience,
    confirmDeleteExperience,
    cancelDeleteExperience,

    // User Profile Actions
    updateUserProfile,
    updateProfileImageFile,
  };
};
