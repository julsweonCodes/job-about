import { useCallback } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCommonData } from "@/hooks/useCommonData";
import { useSeekerProfileQueries } from "@/hooks/seeker/useSeekerProfileQueries";

// Types
export interface LoadingStates {
  skills: boolean;
  locations: boolean;
  profile: boolean;
}

interface UseProfileDataReturn {
  // State
  userInfo: any;
  seekerProfile: any;
  applicantProfile: any;
  isInitialized: boolean;
  isLoading: boolean;
  loadingStates: LoadingStates;

  // Actions
  setUserInfo: (userInfo: any) => void;
  setSeekerProfile: (profile: any) => void;
  setApplicantProfile: (profile: any) => void;
}

export const useSeekerProfileData = (): UseProfileDataReturn => {
  // Auth Store
  const { isLoading: isCommonDataLoading } = useCommonData();

  // React Query hooks
  const {
    userInfo,
    profile: seekerProfile,
    transformedProfile: applicantProfile,
    isLoading,
    isError,
    error,
    userInfoLoading,
    profileLoading,
  } = useSeekerProfileQueries();

  // Dummy setter functions for backward compatibility
  const setUserInfo = useCallback((userInfo: any) => {
    console.warn("setUserInfo is deprecated - use React Query mutations instead");
  }, []);

  const setSeekerProfile = useCallback((profile: any) => {
    console.warn("setSeekerProfile is deprecated - use React Query mutations instead");
  }, []);

  const setApplicantProfile = useCallback((profile: any) => {
    console.warn("setApplicantProfile is deprecated - use React Query mutations instead");
  }, []);

  // Loading states
  const loadingStates: LoadingStates = {
    skills: false, // Skills are handled by useCommonData
    locations: false, // Locations are handled by useCommonData
    profile: profileLoading,
  };

  // Combined loading state
  const combinedIsLoading = isLoading || isCommonDataLoading;

  return {
    // State
    userInfo,
    seekerProfile,
    applicantProfile: applicantProfile || {
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
    },
    isInitialized: !isLoading && !isError,
    isLoading: combinedIsLoading,
    loadingStates,

    // Actions (deprecated but kept for backward compatibility)
    setUserInfo,
    setSeekerProfile,
    setApplicantProfile,
  };
};
