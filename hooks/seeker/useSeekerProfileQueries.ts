import { useQuery } from "@tanstack/react-query";
import { apiGetData } from "@/utils/client/API";
import { API_URLS } from "@/constants/api";
import { showErrorToast } from "@/utils/client/toastUtils";
import { applicantProfile, ApplicantProfileMapper } from "@/types/profile";
import React from "react";

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

// React Query Hooks
export const useUserInfo = () => {
  return useQuery({
    queryKey: ["user-info"],
    queryFn: fetchUserInfo,
    staleTime: 5 * 60 * 1000, // 5분간 신선한 데이터
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useProfileData = () => {
  return useQuery({
    queryKey: ["seeker-profile"],
    queryFn: fetchProfileData,
    staleTime: 5 * 60 * 1000, // 5분간 신선한 데이터
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Combined hook for all profile data
export const useSeekerProfileQueries = () => {
  const userInfoQuery = useUserInfo();
  const profileQuery = useProfileData();

  // Transform data into ApplicantProfile format
  const transformedProfile = React.useMemo(() => {
    if (!userInfoQuery.data) {
      // Return default profile when data is not available
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

  const isLoading = userInfoQuery.isLoading || profileQuery.isLoading;
  const isError = userInfoQuery.isError || profileQuery.isError;
  const error = userInfoQuery.error || profileQuery.error;

  return {
    // Data
    userInfo: userInfoQuery.data,
    profile: profileQuery.data,
    transformedProfile,

    // Loading states
    isLoading,
    isError,
    error,

    // Individual loading states
    userInfoLoading: userInfoQuery.isLoading,
    profileLoading: profileQuery.isLoading,

    // Refetch functions
    refetchUserInfo: userInfoQuery.refetch,
    refetchProfile: profileQuery.refetch,
  };
};
