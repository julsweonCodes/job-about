import { useState, useCallback, useEffect } from "react";
import { API_URLS } from "@/constants/api";
import { showErrorToast } from "@/utils/client/toastUtils";
import { useAuthStore } from "@/stores/useAuthStore";
import { applicantProfile, ApplicantProfileMapper } from "@/types/profile";
import { apiGetData } from "@/utils/client/API";
import { useCommonData } from "@/hooks/useCommonData";

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

// Constants
const INITIAL_LOADING_STATES: LoadingStates = {
  skills: false,
  locations: false,
  profile: false,
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

interface UseProfileDataReturn {
  // State
  userInfo: UserInfo | null;
  seekerProfile: applicantProfile | null;
  applicantProfile: ApplicantProfile;
  isInitialized: boolean;
  isLoading: boolean;
  loadingStates: LoadingStates;

  // Actions
  setUserInfo: (userInfo: UserInfo | null) => void;
  setSeekerProfile: (profile: applicantProfile | null) => void;
  setApplicantProfile: (profile: ApplicantProfile) => void;
}

export const useSeekerProfileData = (): UseProfileDataReturn => {
  // Auth Store
  const { supabaseUser: authUser, appUser } = useAuthStore();
  const { isLoading: isCommonDataLoading } = useCommonData();

  // State
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [seekerPersonality, setSeekerPersonality] = useState<Personality | null>(null);
  const [seekerProfile, setSeekerProfile] = useState<applicantProfile | null>(null);
  const [applicantProfile, setApplicantProfile] =
    useState<ApplicantProfile>(INITIAL_APPLICANT_PROFILE);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState<LoadingStates>(INITIAL_LOADING_STATES);

  // Centralized error handler
  const handleApiError = useCallback((error: Error, context: string) => {
    console.error(`Error in ${context}:`, error);
    showErrorToast(`Failed to ${context}`);
  }, []);

  // API Functions
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
        handleApiError(error as Error, "load personality data");
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
      handleApiError(error as Error, "load profile data");
    } finally {
      setIsLoading(false);
      setLoadingStates((prev) => ({ ...prev, profile: false }));
    }
  }, [authUser, appUser, handleApiError]);

  // Effects
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
        handleApiError(error as Error, "parse seeker profile");
      }
    }

    setApplicantProfile(profile);
    setIsInitialized(true);
  }, [userInfo, seekerPersonality, seekerProfile, handleApiError]);

  // Combined loading state
  const combinedIsLoading = isLoading || isCommonDataLoading;

  return {
    // State
    userInfo,
    seekerProfile,
    applicantProfile,
    isInitialized,
    isLoading: combinedIsLoading,
    loadingStates,

    // Actions
    setUserInfo,
    setSeekerProfile,
    setApplicantProfile,
  };
};
