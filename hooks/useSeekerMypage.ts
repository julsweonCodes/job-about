import { useState, useEffect, useCallback } from "react";
import { API_URLS } from "@/constants/api";
import { showErrorToast, showSuccessToast } from "@/utils/client/toastUtils";
import { useAuthStore } from "@/stores/useAuthStore";
import { applicantProfile, ApplicantProfileMapper, Skill } from "@/types/profile";
import { convertLocationKeyToValue } from "@/constants/location";
import { apiGet, apiPatch } from "@/utils/client/API";

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
}

export interface EditingStates {
  basicInfo: boolean;
  contact: boolean;
  location: boolean;
  skills: boolean;
  workType: boolean;
  jobTypes: boolean;
  availability: boolean;
  languages: boolean;
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
  fetchSkills: () => Promise<void>;
  fetchLocations: () => Promise<void>;
}

// Constants
const INITIAL_LOADING_STATES: LoadingStates = {
  skills: false,
  locations: false,
  profile: false,
};

const INITIAL_EDITING_STATES: EditingStates = {
  basicInfo: false,
  contact: false,
  location: false,
  skills: false,
  workType: false,
  jobTypes: false,
  availability: false,
  languages: false,
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

export const useSeekerMypage = (): UseSeekerMypageReturn => {
  // Auth Store
  const { supabaseUser: authUser, appUser, updateProfileImage } = useAuthStore();

  // State
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [seekerPersonality, setSeekerPersonality] = useState<Personality | null>(null);
  const [seekerProfile, setSeekerProfile] = useState<applicantProfile | null>(null);
  const [applicantProfile, setApplicantProfile] =
    useState<ApplicantProfile>(INITIAL_APPLICANT_PROFILE);
  const [tempData, setTempData] = useState<ApplicantProfile>(INITIAL_APPLICANT_PROFILE);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [loadingStates, setLoadingStates] = useState<LoadingStates>(INITIAL_LOADING_STATES);
  const [isEditing, setIsEditingState] = useState<EditingStates>(INITIAL_EDITING_STATES);

  // API Functions
  const fetchSkills = useCallback(async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, skills: true }));
      const data = await apiGet(API_URLS.UTILS);

      if (data.status === "success") {
        setAvailableSkills(data.data.skills);
      } else {
        console.error("Failed to fetch skills:", data.error);
        showErrorToast("Failed to load skills");
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
      showErrorToast("Failed to load skills");
    } finally {
      setLoadingStates((prev) => ({ ...prev, skills: false }));
    }
  }, []);

  const fetchLocations = useCallback(async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, locations: true }));
      const data = await apiGet(API_URLS.ENUM.BY_NAME("Location"));

      if (data.status === "success") {
        const locationsData = data.data?.values || data.values || [];
        if (Array.isArray(locationsData)) {
          const convertedCities = locationsData.map(convertLocationKeyToValue);
          setAvailableLocations(convertedCities);
        } else {
          setAvailableLocations([]);
        }
      } else {
        console.error("Failed to fetch locations:", data.error);
        setAvailableLocations([]);
        showErrorToast("Failed to load locations");
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      showErrorToast("Failed to load locations");
    } finally {
      setLoadingStates((prev) => ({ ...prev, locations: false }));
    }
  }, []);

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
        const userData = await apiGet(API_URLS.USER.ME);
        if (userData.status === "success" && userData.data) {
          setUserInfo(userData.data.user);
        }
      }

      // Personality Data
      const personalityData = await apiGet(API_URLS.QUIZ.MY_PROFILE);
      if (personalityData.status === "success" && personalityData.data) {
        setSeekerPersonality(personalityData.data);
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

      // Profile Data
      const profileData = await apiGet(API_URLS.SEEKER.PROFILES);
      if (profileData.status === "success" && profileData.data) {
        setSeekerProfile(profileData.data);
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
      showErrorToast("Failed to load profile data");
    } finally {
      setIsLoading(false);
      setLoadingStates((prev) => ({ ...prev, profile: false }));
    }
  }, [authUser, appUser]);

  // Effects
  useEffect(() => {
    fetchSkills();
    fetchLocations();
  }, [fetchSkills, fetchLocations]);

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
        console.log("🔍 Seeker Profile Data:", seekerProfile);
        console.log("🔍 Mapped Form Data:", formData);
        console.log("🔍 Skill IDs:", formData.skillIds);

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

      const response = await apiPatch(API_URLS.USER.UPDATE, formData);

      if (response.status === "success") {
        setApplicantProfile(tempData);
        showSuccessToast("Profile updated successfully!");
      } else {
        showErrorToast("Failed to update profile");
      }
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

        const result = await apiPatch(API_URLS.USER.UPDATE, formData);

        if (result.data && result.data.img_url !== undefined) {
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

  return {
    // State
    userInfo,
    seekerProfile,
    applicantProfile,
    tempData,
    isInitialized,
    isLoading,
    availableSkills,
    availableLocations,
    loadingStates,
    isEditing,

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
    fetchSkills,
    fetchLocations,
  };
};
