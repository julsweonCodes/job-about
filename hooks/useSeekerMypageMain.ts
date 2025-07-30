import { useState, useEffect, useCallback } from "react";
import { API_URLS } from "@/constants/api";
import { showErrorToast } from "@/utils/client/toastUtils";
import { useAuthStore } from "@/stores/useAuthStore";
import { apiGetData, apiPatchData } from "@/utils/client/API";

// Types
export interface UserInfo {
  name: string;
  description: string;
  phone_number: string;
  img_url?: string;
  created_at: Date;
}

export interface ApplicantProfileMain {
  personalityName: string;
  personalityDesc: string;
}

interface UseSeekerMypageMainReturn {
  // State
  userInfo: UserInfo | null;
  applicantProfile: ApplicantProfileMain;
  isLoading: boolean;
  imageUploadLoading: boolean;

  // Actions
  updateProfileImage: (file: File) => Promise<void>;
}

// Constants
const INITIAL_APPLICANT_PROFILE: ApplicantProfileMain = {
  personalityName: "",
  personalityDesc: "",
};

const DUMMY_PERSONALITY_PROFILE: ApplicantProfileMain = {
  personalityName: "Empathetic Coordinator",
  personalityDesc:
    "Gains energy from collaboration and communication. Excellent at understanding customer emotions and building positive relationships.",
};

export const useSeekerMypageMain = (): UseSeekerMypageMainReturn => {
  const { appUser } = useAuthStore();

  // State
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [applicantProfile, setApplicantProfile] =
    useState<ApplicantProfileMain>(INITIAL_APPLICANT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  const setUserInfoFromAppUser = useCallback(() => {
    if (appUser) {
      setUserInfo({
        name: appUser.name || "",
        description: appUser.description || "",
        phone_number: appUser.phone_number || "",
        img_url: appUser.img_url || undefined,
        created_at: appUser.created_at ? new Date(appUser.created_at) : new Date(),
      });
    }
  }, [appUser]);

  // Fetch personality profile (Work Style)
  const fetchPersonalityProfile = useCallback(async () => {
    if (!appUser?.id) return;

    try {
      const profileData = await apiGetData<{
        id: number;
        name_ko: string;
        name_en: string;
        description_ko: string;
        description_en: string;
      } | null>(API_URLS.QUIZ.MY_PROFILE);

      if (profileData) {
        setApplicantProfile({
          personalityName: profileData.name_ko || "",
          personalityDesc: profileData.description_ko || "",
        });
      } else {
        // data가 null인 경우 더미 데이터 사용
        setApplicantProfile(DUMMY_PERSONALITY_PROFILE);
      }
    } catch (error) {
      console.error("Error fetching personality profile:", error);
      // 에러 발생 시에도 더미 데이터 사용
      setApplicantProfile(DUMMY_PERSONALITY_PROFILE);
    }
  }, [appUser?.id]);

  // Update profile image
  const updateProfileImage = useCallback(async (file: File) => {
    try {
      setImageUploadLoading(true);
      const formData = new FormData();
      formData.append("img", file);

      const result = await apiPatchData(API_URLS.USER.UPDATE, formData);

      if (result && result.img_url !== undefined) {
        // Update user info with new image
        setUserInfo((prev) => (prev ? { ...prev, img_url: result.img_url } : null));

        // Update auth store appUser
        const { setAppUser } = useAuthStore.getState();
        const currentAppUser = useAuthStore.getState().appUser;
        if (currentAppUser) {
          setAppUser({
            ...currentAppUser,
            img_url: result.img_url,
          });
        }
      }
    } catch (error) {
      console.error("Error updating profile image:", error);
      showErrorToast("Failed to update profile image");
      throw error;
    } finally {
      setImageUploadLoading(false);
    }
  }, []);

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        // userInfo는 동기적으로 설정
        setUserInfoFromAppUser();
        // personality profile만 비동기로 가져오기
        await fetchPersonalityProfile();
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (appUser?.id) {
      initializeData();
    }
  }, [appUser?.id, setUserInfoFromAppUser, fetchPersonalityProfile]);

  return {
    userInfo,
    applicantProfile,
    isLoading,
  imageUploadLoading,
    updateProfileImage,
  };
};
