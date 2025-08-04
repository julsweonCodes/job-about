import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGetData, apiPatchData } from "@/utils/client/API";
import { API_URLS } from "@/constants/api";
import { SEEKER_QUERY_KEYS, USER_QUERY_KEYS } from "@/constants/queryKeys";
import { showErrorToast, showSuccessToast } from "@/utils/client/toastUtils";
import { useCommonData } from "@/hooks/useCommonData";
import { Skill } from "@/types/profile";
import { JobType } from "@/constants/jobTypes";
import { convertLocationKeyToValue } from "@/constants/location";
import {
  toPrismaWorkType,
  toPrismaJobType,
  toPrismaLanguageLevel,
  toPrismaAvailableDay,
  toPrismaAvailableHour,
  toPrismaLocation,
  toPrismaWorkPeriod,
} from "@/types/enumMapper";
import { applicantProfile, ApplicantProfileMapper } from "@/types/profile";

// Types
export interface UserInfo {
  name: string;
  description: string;
  phone_number: string;
  img_url?: string;
  created_at: Date;
}

export interface ApplicantProfile {
  name: string;
  description: string;
  joinDate: string;
  personalityName: string;
  personalityDesc: string;
  location: string;
  phone: string;
  skillIds: number[];
  workType: string;
  jobTypes: string[];
  availabilityDay: string;
  availabilityTime: string;
  englishLevel: string;
  experiences: {
    company: string;
    jobType: string;
    startYear: string;
    workedPeriod: string;
    workType: string;
    description: string;
  }[];
}

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

export interface LoadingStates {
  profileUpdate: boolean;
  imageUpload: boolean;
  skillsUpdate: boolean;
  jobTypesUpdate: boolean;
  experienceSave: boolean;
}

export interface DialogStates {
  profile: boolean;
  imageUpload: boolean;
  skills: boolean;
  preferredJobTypes: boolean;
  deleteConfirm: {
    isOpen: boolean;
    experienceIndex: number | null;
  };
}

// API Functions
const fetchUserInfo = async (): Promise<UserInfo> => {
  try {
    const userData = await apiGetData(API_URLS.USER.ME);
    return userData.user;
  } catch (error) {
    console.error("Error fetching user info:", error);
    showErrorToast("Failed to load user information");
    throw error;
  }
};

const fetchProfileData = async (): Promise<applicantProfile> => {
  try {
    const profileData = await apiGetData(API_URLS.SEEKER.PROFILES);
    return profileData;
  } catch (error) {
    console.error("Error fetching profile data:", error);
    showErrorToast("Failed to load profile data");
    throw error;
  }
};

// Section mappings for API updates
const SECTION_MAPPINGS = {
  contact: (data: ApplicantProfile) => ({
    phone: data.phone,
  }),
  location: (data: ApplicantProfile) => ({
    location: toPrismaLocation(data.location as any),
  }),
  description: (data: ApplicantProfile) => ({
    description: data.description,
  }),
  skills: (data: ApplicantProfile) => ({
    profile_practical_skills: data.skillIds.map((skillId: number) => ({
      practical_skill_id: skillId,
    })),
  }),
  workType: (data: ApplicantProfile) => ({
    work_type: toPrismaWorkType(data.workType as any),
  }),
  jobTypes: (data: ApplicantProfile) => ({
    job_type1: data.jobTypes[0] ? toPrismaJobType(data.jobTypes[0] as any) : null,
    ...(data.jobTypes[1] && { job_type2: toPrismaJobType(data.jobTypes[1] as any) }),
    ...(data.jobTypes[2] && { job_type3: toPrismaJobType(data.jobTypes[2] as any) }),
  }),
  availability: (data: ApplicantProfile) => ({
    available_day: toPrismaAvailableDay(data.availabilityDay as any),
    available_hour: toPrismaAvailableHour(data.availabilityTime as any),
  }),
  languages: (data: ApplicantProfile) => ({
    language_level: toPrismaLanguageLevel(data.englishLevel as any),
  }),
  workExperience: (data: ApplicantProfile) => ({
    work_experiences: data.experiences.map((exp) => ({
      company_name: exp.company,
      job_type: toPrismaJobType(exp.jobType as any),
      start_year: exp.startYear,
      work_period: toPrismaWorkPeriod(exp.workedPeriod as any),
      work_type: toPrismaWorkType(exp.workType as any),
      description: exp.description,
    })),
  }),
} as const;

// Main hook
export const useSeekerMypageProfile = () => {
  const queryClient = useQueryClient();
  const { skills: availableSkills, locations: availableLocations } = useCommonData();

  // React Query hooks
  const userInfoQuery = useQuery({
    queryKey: USER_QUERY_KEYS.INFO,
    queryFn: fetchUserInfo,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const profileQuery = useQuery({
    queryKey: SEEKER_QUERY_KEYS.PROFILES,
    queryFn: fetchProfileData,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: any) => {
      return await apiPatchData(API_URLS.SEEKER.PROFILES, profileData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SEEKER_QUERY_KEYS.PROFILES });
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      showErrorToast("Failed to update profile");
    },
  });

  const updateUserInfoMutation = useMutation({
    mutationFn: async (userData: any) => {
      return await apiPatchData(API_URLS.USER.ME, userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.INFO });
    },
    onError: (error) => {
      console.error("Error updating user info:", error);
      showErrorToast("Failed to update user information");
    },
  });

  // Transform data into ApplicantProfile format
  const transformedProfile = useMemo(() => {
    if (!userInfoQuery.data) {
      return {
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
    }

    const profile: ApplicantProfile = {
      name: userInfoQuery.data.name || "",
      description: userInfoQuery.data.description || "",
      joinDate: new Date(userInfoQuery.data.created_at).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      personalityName: "",
      personalityDesc: "",
      location: "",
      phone: userInfoQuery.data.phone_number || "",
      skillIds: [],
      workType: "",
      jobTypes: [],
      availabilityDay: "",
      availabilityTime: "",
      englishLevel: "",
      experiences: [],
    };

    if (profileQuery.data) {
      try {
        const formData = ApplicantProfileMapper.fromApi(profileQuery.data);

        Object.assign(profile, {
          location: formData.location,
          skillIds: formData.skillIds,
          workType: formData.workType,
          jobTypes: formData.preferredJobTypes,
          availabilityDay: formData.availableDay,
          availabilityTime: formData.availableHour,
          englishLevel: formData.englishLevel,
          description: formData.description,
          experiences: formData.experiences.map((exp: any) => ({
            company: exp.company,
            jobType: exp.jobType,
            startYear: exp.startYear,
            workedPeriod: exp.workPeriod,
            workType: exp.workType,
            description: exp.description,
          })),
        });
      } catch (error) {
        console.error("Error parsing seeker profile:", error);
        showErrorToast("Failed to parse profile data");
      }
    }

    return profile;
  }, [userInfoQuery.data, profileQuery.data]);

  // State management
  const [tempData, setTempData] = useState<ApplicantProfile>(transformedProfile);
  const [isEditing, setIsEditing] = useState<EditingStates>({
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
  });
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    profileUpdate: false,
    imageUpload: false,
    skillsUpdate: false,
    jobTypesUpdate: false,
    experienceSave: false,
  });
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<JobType[]>([]);
  const [dialogStates, setDialogStates] = useState<DialogStates>({
    profile: false,
    imageUpload: false,
    skills: false,
    preferredJobTypes: false,
    deleteConfirm: { isOpen: false, experienceIndex: null },
  });
  const [originalExperiences, setOriginalExperiences] = useState<ApplicantProfile["experiences"]>(
    []
  );

  // Sync tempData with transformedProfile
  useMemo(() => {
    if (transformedProfile) {
      setTempData(transformedProfile);
      setOriginalExperiences(transformedProfile.experiences);
    }
  }, [transformedProfile]);

  // Actions
  const handleTempInputChange = useCallback((field: keyof ApplicantProfile, value: any) => {
    setTempData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleEdit = useCallback(
    (section: keyof EditingStates) => {
      setTempData(transformedProfile);
      setIsEditing((prev) => ({ ...prev, [section]: true }));
    },
    [transformedProfile]
  );

  const handleCancel = useCallback(
    (section: keyof EditingStates) => {
      setTempData(transformedProfile);
      setIsEditing((prev) => ({ ...prev, [section]: false }));
    },
    [transformedProfile]
  );

  const updateProfileSection = useCallback(
    async (section: keyof typeof SECTION_MAPPINGS, showToast: boolean = true) => {
      try {
        setLoadingStates((prev) => ({ ...prev, profileUpdate: true }));

        const mapper = SECTION_MAPPINGS[section];
        if (!mapper) {
          showErrorToast(`Unknown section: ${section}`);
          return false;
        }

        const payload = mapper(tempData);
        await updateProfileMutation.mutateAsync(payload);

        if (showToast) {
          showSuccessToast(`${section} updated successfully`);
        }
        handleCancel(section as keyof EditingStates);
        return true;
      } catch (error) {
        console.error(`Error updating ${section}:`, error);
        showErrorToast(`Failed to update ${section}`);
        return false;
      } finally {
        setLoadingStates((prev) => ({ ...prev, profileUpdate: false }));
      }
    },
    [tempData, updateProfileMutation, handleCancel]
  );

  // Skills actions
  const handleSkillsEdit = useCallback(() => {
    const currentSkills = transformedProfile.skillIds
      .map((skillId) => availableSkills.find((skill) => skill.id === skillId))
      .filter(Boolean) as Skill[];
    setSelectedSkills(currentSkills);
    setDialogStates((prev) => ({ ...prev, skills: true }));
  }, [transformedProfile.skillIds, availableSkills]);

  const handleSkillsConfirm = useCallback(
    async (skills: Skill[]) => {
      try {
        setLoadingStates((prev) => ({ ...prev, skillsUpdate: true }));
        const skillIds = skills.map((skill) => skill.id);
        handleTempInputChange("skillIds", skillIds);
        setDialogStates((prev) => ({ ...prev, skills: false }));

        const payload = {
          profile_practical_skills: skillIds.map((skillId: number) => ({
            practical_skill_id: skillId,
          })),
        };

        await updateProfileMutation.mutateAsync(payload);
        showSuccessToast("Skills updated successfully!");
      } finally {
        setLoadingStates((prev) => ({ ...prev, skillsUpdate: false }));
      }
    },
    [handleTempInputChange, updateProfileMutation]
  );

  const handleSkillsCancel = useCallback(() => {
    setDialogStates((prev) => ({ ...prev, skills: false }));
  }, []);

  // Job types actions
  const handleJobTypesEdit = useCallback(() => {
    const currentJobTypes = tempData.jobTypes.map((type: string) => type as JobType);
    setSelectedJobTypes(currentJobTypes);
    setDialogStates((prev) => ({ ...prev, preferredJobTypes: true }));
  }, [tempData.jobTypes]);

  const handleJobTypesConfirm = useCallback(
    async (jobTypes: JobType[]) => {
      try {
        setLoadingStates((prev) => ({ ...prev, jobTypesUpdate: true }));
        const jobTypeStrings = jobTypes.map((type) => type);
        setTempData((prev) => ({ ...prev, jobTypes: jobTypeStrings }));
        setDialogStates((prev) => ({ ...prev, preferredJobTypes: false }));

        const payload = {
          job_type1: jobTypeStrings[0] ? toPrismaJobType(jobTypeStrings[0]) : null,
          job_type2: jobTypeStrings[1] ? toPrismaJobType(jobTypeStrings[1]) : null,
          job_type3: jobTypeStrings[2] ? toPrismaJobType(jobTypeStrings[2]) : null,
        };

        await updateProfileMutation.mutateAsync(payload);
        showSuccessToast("Job types updated successfully!");
      } finally {
        setLoadingStates((prev) => ({ ...prev, jobTypesUpdate: false }));
      }
    },
    [updateProfileMutation]
  );

  // Experience actions
  const deleteExperience = useCallback((index: number) => {
    setDialogStates((prev) => ({
      ...prev,
      deleteConfirm: { isOpen: true, experienceIndex: index },
    }));
  }, []);

  const confirmDeleteExperience = useCallback(async () => {
    const { experienceIndex } = dialogStates.deleteConfirm;
    if (experienceIndex !== null) {
      try {
        const updatedExperiences = tempData.experiences.filter((_, i) => i !== experienceIndex);
        setTempData((prev) => ({ ...prev, experiences: updatedExperiences }));

        const payload = {
          work_experiences: updatedExperiences.map((exp) => ({
            company_name: exp.company,
            job_type: toPrismaJobType(exp.jobType as any),
            start_year: exp.startYear,
            work_period: toPrismaWorkPeriod(exp.workedPeriod as any),
            work_type: toPrismaWorkType(exp.workType as any),
            description: exp.description,
          })),
        };

        await updateProfileMutation.mutateAsync(payload);
        showSuccessToast("Experience deleted successfully!");
      } catch (error) {
        console.error("Error deleting experience:", error);
        showErrorToast("Failed to delete experience");
      }
    }
    setDialogStates((prev) => ({
      ...prev,
      deleteConfirm: { isOpen: false, experienceIndex: null },
    }));
  }, [dialogStates.deleteConfirm, tempData.experiences, updateProfileMutation]);

  const cancelDeleteExperience = useCallback(() => {
    setDialogStates((prev) => ({
      ...prev,
      deleteConfirm: { isOpen: false, experienceIndex: null },
    }));
  }, []);

  // User profile actions
  const updateUserProfile = useCallback(async () => {
    try {
      const formData = new FormData();
      formData.append("name", tempData.name);
      formData.append("description", tempData.description);

      await updateUserInfoMutation.mutateAsync(formData);
      showSuccessToast("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      showErrorToast("Failed to update profile");
    }
  }, [tempData.name, tempData.description, updateUserInfoMutation]);

  const updateProfileImageFile = useCallback(
    async (file: File) => {
      try {
        const formData = new FormData();
        formData.append("img", file);

        const result = await updateUserInfoMutation.mutateAsync(formData);

        if (result && result.img_url !== undefined) {
          showSuccessToast("Profile image updated!");
        } else {
          showErrorToast("Failed to update profile image");
        }
      } catch (error) {
        console.error("Error updating profile image:", error);
        showErrorToast("Failed to update profile image");
      }
    },
    [updateUserInfoMutation]
  );

  // Check if experiences have changed
  const hasExperiencesChanged = useCallback(() => {
    if (originalExperiences.length !== tempData.experiences.length) {
      return true;
    }

    return tempData.experiences.some((exp: ApplicantProfile["experiences"][0], index: number) => {
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
    // Data
    userInfo: userInfoQuery.data,
    applicantProfile: transformedProfile,
    tempData,
    availableSkills,
    availableLocations: availableLocations.map(convertLocationKeyToValue),

    // Loading states
    isLoading: userInfoQuery.isLoading || profileQuery.isLoading,
    isError: userInfoQuery.isError || profileQuery.isError,
    error: userInfoQuery.error || profileQuery.error,
    loadingStates,

    // State
    isEditing,
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
    handleTempInputChange,
    handleEdit,
    handleCancel,
    updateProfileSection,
    updateUserProfile,
    updateProfileImageFile,

    // Skills actions
    handleSkillsEdit,
    handleSkillsConfirm,
    handleSkillsCancel,

    // Job types actions
    handleJobTypesEdit,
    handleJobTypesConfirm,

    // Experience actions
    deleteExperience,
    confirmDeleteExperience,
    cancelDeleteExperience,

    // Utility
    hasExperiencesChanged,
  };
};
