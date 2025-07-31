import { useState, useCallback, useEffect } from "react";
import { API_URLS } from "@/constants/api";
import { showErrorToast, showSuccessToast } from "@/utils/client/toastUtils";
import { useAuthStore } from "@/stores/useAuthStore";
import { applicantProfile, ApplicantProfileMapper, Skill } from "@/types/profile";
import { convertLocationKeyToValue } from "@/constants/location";
import { apiGetData, apiPatchData } from "@/utils/client/API";
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

// Types
export interface UserInfo {
  name: string;
  description: string;
  phone_number: string;
  img_url?: string;
  created_at: Date;
}

export interface Personality {
  id?: number;
  name_ko: string;
  name_en: string;
  description_ko: string;
  description_en: string;
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

export interface LoadingStates {
  skills: boolean;
  locations: boolean;
  profile: boolean;
  profileUpdate: boolean;
  imageUpload: boolean;
  skillsUpdate: boolean;
  jobTypesUpdate: boolean;
  experienceSave: boolean;
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

interface UseSeekerMypageReturn {
  // State
  userInfo: UserInfo | null;
  seekerProfile: applicantProfile | null;
  applicantProfile: ApplicantProfile;
  tempData: ApplicantProfile;
  isInitialized: boolean;
  isLoading: boolean;
  availableSkills: Skill[];
  availableLocations: string[];
  loadingStates: LoadingStates;
  isEditing: EditingStates;
  selectedSkills: Skill[];
  selectedJobTypes: JobType[];
  dialogStates: {
    profile: boolean;
    imageUpload: boolean;
    skills: boolean;
    preferredJobTypes: boolean;
    deleteConfirm: {
      isOpen: boolean;
      experienceIndex: number | null;
    };
  };

  // Actions
  setUserInfo: (userInfo: UserInfo | null) => void;
  setSeekerProfile: (profile: applicantProfile | null) => void;
  setApplicantProfile: (profile: ApplicantProfile) => void;
  setTempData: (data: ApplicantProfile) => void;
  setIsEditing: (section: keyof EditingStates, value: boolean) => void;
  handleEdit: (section: keyof EditingStates) => void;
  handleCancel: (section: keyof EditingStates) => void;
  handleTempInputChange: (field: keyof ApplicantProfile, value: any) => void;
  updateUserProfile: () => Promise<void>;
  updateProfileImageFile: (file: File) => Promise<void>;

  // Profile Section Actions
  updateProfileSection: (
    section: string,
    payload: Partial<applicantProfile>,
    showToast?: boolean
  ) => Promise<boolean>;
  handleOptionsSave: (section: keyof typeof SECTION_MAPPINGS) => Promise<void>;

  // Skills Actions
  setSelectedSkills: (skills: Skill[]) => void;
  handleSkillsEdit: () => void;
  handleSkillsConfirm: (skills: Skill[]) => Promise<void>;
  handleSkillsCancel: () => void;

  // Job Types Actions
  setSelectedJobTypes: (jobTypes: JobType[]) => void;
  handleJobTypesEdit: () => void;
  handleJobTypesConfirm: (jobTypes: JobType[]) => Promise<void>;

  // Experience Actions
  deleteExperience: (index: number) => void;
  confirmDeleteExperience: () => void;
  cancelDeleteExperience: () => void;

  // Utility Actions
  toggleAvailabilityDay: (day: string) => void;
  toggleAvailabilityTime: (time: string) => void;
  updateEnglishLevel: (level: LanguageLevel) => void;
  setDialogStates: (states: any) => void;
  hasExperiencesChanged: () => boolean;
}

// Constants
const INITIAL_LOADING_STATES: LoadingStates = {
  skills: false,
  locations: false,
  profile: false,
  profileUpdate: false,
  imageUpload: false,
  skillsUpdate: false,
  jobTypesUpdate: false,
  experienceSave: false,
};

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

const INITIAL_APPLICANT_PROFILE: ApplicantProfile = {
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

export const useSeekerMypageProfile = (): UseSeekerMypageReturn => {
  // Auth Store
  const { supabaseUser: authUser, appUser, updateProfileImage } = useAuthStore();
  const {
    skills: availableSkills,
    locations: availableLocations,
    isLoading: isCommonDataLoading,
  } = useCommonData();

  // State
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [seekerPersonality, setSeekerPersonality] = useState<Personality | null>(null);
  const [seekerProfile, setSeekerProfile] = useState<applicantProfile | null>(null);
  const [applicantProfile, setApplicantProfile] =
    useState<ApplicantProfile>(INITIAL_APPLICANT_PROFILE);
  const [tempData, setTempData] = useState<ApplicantProfile>(INITIAL_APPLICANT_PROFILE);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState<LoadingStates>(INITIAL_LOADING_STATES);
  const [isEditing, setIsEditingState] = useState<EditingStates>(INITIAL_EDITING_STATES);

  // Additional state for profile page
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<JobType[]>([]);
  const [dialogStates, setDialogStates] = useState({
    profile: false,
    imageUpload: false,
    skills: false,
    preferredJobTypes: false,
    deleteConfirm: { isOpen: false, experienceIndex: null as number | null },
  });

  // Track original experiences for comparison
  const [originalExperiences, setOriginalExperiences] = useState<ApplicantProfile["experiences"]>(
    []
  );

  // API Functions - fetchSkills와 fetchLocations 제거
  const fetchInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadingStates((prev) => ({ ...prev, profile: true }));

      // User Info
      if (authUser && appUser) {
        const userInfoData: UserInfo = {
          name: appUser.name || authUser.email || "",
          description: "",
          phone_number: "",
          img_url: appUser.img_url || undefined,
          created_at: new Date(appUser.created_at || Date.now()),
        };
        setUserInfo(userInfoData);
      } else {
        const userData = await apiGetData(API_URLS.USER.ME);
        setUserInfo(userData.user);
      }

      // Personality Data
      try {
        const personalityData = await apiGetData(API_URLS.QUIZ.MY_PROFILE);
        if (personalityData) {
          setSeekerPersonality(personalityData);
        } else {
          // Fallback to dummy data
          setSeekerPersonality({
            id: 3,
            name_ko: "공감형 코디네이터",
            name_en: "Empathetic Coordinator",
            description_ko:
              "사람들과의 협업과 소통에서 에너지를 얻습니다. 특히 고객의 감정을 잘 파악하고 긍정적인 관계를 맺는 데 강점이 있습니다.",
            description_en:
              "Gains energy from collaboration and communication. Excellent at understanding customer emotions and building positive relationships.",
          });
        }
      } catch (error) {
        // Fallback to dummy data
        setSeekerPersonality({
          id: 3,
          name_ko: "공감형 코디네이터",
          name_en: "Empathetic Coordinator",
          description_ko:
            "사람들과의 협업과 소통에서 에너지를 얻습니다. 특히 고객의 감정을 잘 파악하고 긍정적인 관계를 맺는 데 강점이 있습니다.",
          description_en:
            "Gains energy from collaboration and communication. Excellent at understanding customer emotions and building positive relationships.",
        });
      }

      // Profile Data
      const profileData = await apiGetData(API_URLS.SEEKER.PROFILES);
      setSeekerProfile(profileData);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      showErrorToast("Failed to load profile data");
    } finally {
      setIsLoading(false);
      setLoadingStates((prev) => ({ ...prev, profile: false }));
    }
  }, [authUser, appUser]);

  // Effects - fetchSkills와 fetchLocations 제거
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Transform and initialize data
  useEffect(() => {
    if (!userInfo || !seekerPersonality) return;

    const profile: ApplicantProfile = {
      name: userInfo.name || "",
      description: userInfo.description || "",
      joinDate: new Date(userInfo.created_at).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      personalityName: seekerPersonality.name_en,
      personalityDesc: seekerPersonality.description_en,
      location: "",
      phone: userInfo.phone_number || "",
      skillIds: [],
      workType: "",
      jobTypes: [],
      availabilityDay: "",
      availabilityTime: "",
      englishLevel: "",
      experiences: [],
    };

    if (seekerProfile) {
      try {
        const formData = ApplicantProfileMapper.fromApi(seekerProfile);

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
      }
    }

    setApplicantProfile(profile);
    setTempData(profile);
    setIsInitialized(true);
  }, [userInfo, seekerPersonality, seekerProfile]);

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

  const handleEdit = useCallback(
    (section: keyof EditingStates) => {
      setTempData(applicantProfile);
      setIsEditing(section, true);
    },
    [applicantProfile, setIsEditing]
  );

  const handleCancel = useCallback(
    (section: keyof EditingStates) => {
      setTempData(applicantProfile);
      setIsEditing(section, false);
    },
    [applicantProfile, setIsEditing]
  );

  const handleTempInputChange = useCallback((field: keyof ApplicantProfile, value: any) => {
    setTempData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateUserProfile = useCallback(async () => {
    try {
      const formData = new FormData();
      formData.append("name", tempData.name);
      formData.append("description", tempData.description);

      await apiPatchData(API_URLS.USER.UPDATE, formData);
      setApplicantProfile(tempData);
      showSuccessToast("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      showErrorToast("Failed to update profile");
    }
  }, [tempData]);

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
        console.error("Error updating profile image:", error);
        showErrorToast("Failed to update profile image");
      }
    },
    [updateProfileImage]
  );

  // Profile Section Actions
  const updateProfileSection = useCallback(
    async (section: string, payload: Partial<applicantProfile>, showToast: boolean = true) => {
      try {
        setLoadingStates((prev) => ({ ...prev, profileUpdate: true }));
        console.log("🔍 updateProfileSection payload:", payload);
        await apiPatchData(API_URLS.SEEKER.PROFILES, payload);

        if (showToast) {
          showSuccessToast(`${section} updated successfully`);
        }
        setApplicantProfile(tempData);
        return true;
      } catch (error) {
        console.error(`Failed to save ${section}:`, error);
        showErrorToast(`Failed to update ${section}: ${(error as Error).message}`);
        return false;
      } finally {
        setLoadingStates((prev) => ({ ...prev, profileUpdate: false }));
      }
    },
    [tempData, setApplicantProfile]
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
        console.error(`Error updating ${section}:`, error);
        showErrorToast(`Failed to update ${section}`);
      }
    },
    [tempData, updateProfileSection, handleCancel]
  );

  // Skills Actions
  const handleSkillsEdit = useCallback(() => {
    const currentSkills = applicantProfile.skillIds
      .map((skillId) => availableSkills.find((skill) => skill.id === skillId))
      .filter(Boolean) as Skill[];
    setSelectedSkills(currentSkills);
    setDialogStates((prev) => ({ ...prev, skills: true }));
  }, [applicantProfile.skillIds, availableSkills]);

  const handleSkillsConfirm = useCallback(
    async (skills: Skill[]) => {
      try {
        setLoadingStates((prev) => ({ ...prev, skillsUpdate: true }));
        const skillIds = skills.map((skill) => skill.id);
        handleTempInputChange("skillIds", skillIds);
        setDialogStates((prev) => ({ ...prev, skills: false }));

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
        setLoadingStates((prev) => ({ ...prev, skillsUpdate: false }));
      }
    },
    [handleTempInputChange, updateProfileSection, applicantProfile, setApplicantProfile]
  );

  const handleSkillsCancel = useCallback(() => {
    setDialogStates((prev) => ({ ...prev, skills: false }));
  }, []);

  // Job Types Actions
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
        setTempData({ ...tempData, jobTypes: jobTypeStrings });
        setDialogStates((prev) => ({ ...prev, preferredJobTypes: false }));

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
          console.error("Failed to save job types:", error);
          showErrorToast(`Failed to update job types: ${(error as Error).message}`);
        }
      } finally {
        setLoadingStates((prev) => ({ ...prev, jobTypesUpdate: false }));
      }
    },
    [tempData, setTempData, setApplicantProfile, applicantProfile]
  );

  // Experience Actions
  const deleteExperience = useCallback((index: number) => {
    setDialogStates((prev) => ({
      ...prev,
      deleteConfirm: { isOpen: true, experienceIndex: index },
    }));
  }, []);

  const confirmDeleteExperience = useCallback(() => {
    const { experienceIndex } = dialogStates.deleteConfirm;
    if (experienceIndex !== null) {
      const experience = tempData.experiences[experienceIndex];
      const updatedExperiences = tempData.experiences.filter((_, i) => i !== experienceIndex);
      setTempData({ ...tempData, experiences: updatedExperiences });
      showSuccessToast("Experience deleted successfully!");
    }
    setDialogStates((prev) => ({
      ...prev,
      deleteConfirm: { isOpen: false, experienceIndex: null },
    }));
  }, [dialogStates.deleteConfirm, tempData, setTempData]);

  const cancelDeleteExperience = useCallback(() => {
    setDialogStates((prev) => ({
      ...prev,
      deleteConfirm: { isOpen: false, experienceIndex: null },
    }));
  }, []);

  // Utility Actions
  const toggleAvailabilityDay = useCallback(
    (day: string) => {
      handleTempInputChange("availabilityDay", day);
    },
    [handleTempInputChange]
  );

  const toggleAvailabilityTime = useCallback(
    (time: string) => {
      handleTempInputChange("availabilityTime", time);
    },
    [handleTempInputChange]
  );

  const updateEnglishLevel = useCallback(
    (level: LanguageLevel) => {
      handleTempInputChange("englishLevel", level);
    },
    [handleTempInputChange]
  );

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

  // Combined loading state
  const combinedIsLoading = isLoading || isCommonDataLoading;

  return {
    // State
    userInfo,
    seekerProfile,
    applicantProfile,
    tempData,
    isInitialized,
    isLoading: combinedIsLoading,
    availableSkills,
    availableLocations: availableLocations.map(convertLocationKeyToValue),
    loadingStates,
    isEditing,
    selectedSkills,
    selectedJobTypes,
    dialogStates,

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
    toggleAvailabilityDay,
    toggleAvailabilityTime,
    updateEnglishLevel,
    setDialogStates,
    hasExperiencesChanged,
  };
};
