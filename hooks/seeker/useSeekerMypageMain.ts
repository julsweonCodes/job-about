import { useState, useEffect, useCallback } from "react";
import { API_URLS, PAGE_URLS } from "@/constants/api";
import { showErrorToast, showSuccessToast } from "@/utils/client/toastUtils";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSeekerStore, useSeekerWorkStyle } from "@/stores/useSeekerStore";
import { apiGetData, apiPatchData } from "@/utils/client/API";
import { useRouter } from "next/navigation";

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

export interface DialogStates {
  imageUpload: boolean;
  profileEdit: boolean;
}

export interface ProfileEditData {
  name: string;
  phone_number: string;
}

interface UseSeekerMypageMainReturn {
  // State
  userInfo: UserInfo | null;
  applicantProfile: ApplicantProfileMain;
  isLoading: boolean;
  imageUploadLoading: boolean;
  dialogStates: DialogStates;
  profileEditData: ProfileEditData;

  // Actions
  updateProfileImage: (file: File) => Promise<void>;
  handleProfileImageChange: (file: File) => Promise<void>;
  handleImageUploadDialog: () => void;
  handleProfileEditDialog: () => void;
  handleProfileEditClose: () => void;
  handleProfileEditSave: () => Promise<void>;
  handleProfileEditChange: (field: "name" | "phone_number", value: string) => void;
  handleNavigateToProfile: () => void;
  handleNavigateToAppliedJobs: () => void;
  handleNavigateToBookmarks: () => void;
  setDialogStates: React.Dispatch<React.SetStateAction<DialogStates>>;
}

// Constants
const INITIAL_APPLICANT_PROFILE: ApplicantProfileMain = {
  personalityName: "",
  personalityDesc: "",
};

const INITIAL_DIALOG_STATES: DialogStates = {
  imageUpload: false,
  profileEdit: false,
};

const DUMMY_PERSONALITY_PROFILE: ApplicantProfileMain = {
  personalityName: "Empathetic Coordinator",
  personalityDesc:
    "Gains energy from collaboration and communication. Excellent at understanding customer emotions and building positive relationships.",
};

export const useSeekerMypageMain = (): UseSeekerMypageMainReturn => {
  const router = useRouter();
  const { appUser, setAppUser } = useAuthStore();
  const {
    workStyle,
    isLoading: workStyleLoading,
    setWorkStyle,
    setLoading: setWorkStyleLoading,
  } = useSeekerWorkStyle();

  // State
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [applicantProfile, setApplicantProfile] =
    useState<ApplicantProfileMain>(INITIAL_APPLICANT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [dialogStates, setDialogStates] = useState<DialogStates>(INITIAL_DIALOG_STATES);
  const [profileEditData, setProfileEditData] = useState<ProfileEditData>({
    name: appUser?.name || "",
    phone_number: appUser?.phone_number || "",
  });

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

    // Store에 이미 데이터가 있으면 API 호출하지 않음
    if (workStyle) {
      setApplicantProfile({
        personalityName: workStyle.name_en || "",
        personalityDesc: workStyle.description_en || "",
      });
      return;
    }

    try {
      setWorkStyleLoading(true);
      const profileData = await apiGetData<{
        id: number;
        name_ko: string;
        name_en: string;
        description_ko: string;
        description_en: string;
      } | null>(API_URLS.QUIZ.MY_PROFILE);

      if (profileData) {
        // Store에 데이터 저장
        setWorkStyle(profileData);

        setApplicantProfile({
          personalityName: profileData.name_en || "",
          personalityDesc: profileData.description_en || "",
        });
      } else {
        // data가 null인 경우 더미 데이터 사용
        setApplicantProfile(DUMMY_PERSONALITY_PROFILE);
      }
    } catch (error) {
      console.error("Error fetching personality profile:", error);
      // 에러 발생 시에도 더미 데이터 사용
      setApplicantProfile(DUMMY_PERSONALITY_PROFILE);
    } finally {
      setWorkStyleLoading(false);
    }
  }, [appUser?.id, workStyle, setWorkStyle, setWorkStyleLoading]);

  // Update profile image
  const updateProfileImage = useCallback(async (file: File) => {
    try {
      setImageUploadLoading(true);
      const formData = new FormData();
      formData.append("img", file);

      const result = await apiPatchData(API_URLS.USER.UPDATE_PROFILE_IMAGE, formData);

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

  // Profile image change handler
  const handleProfileImageChange = useCallback(
    async (file: File) => {
      try {
        await updateProfileImage(file);
        showSuccessToast("Profile image updated!");
      } catch (error) {
        console.error("Error updating profile image:", error);
        showErrorToast("Failed to update profile image");
      }
    },
    [updateProfileImage]
  );

  // Dialog handlers
  const handleImageUploadDialog = useCallback(() => {
    setDialogStates((prev) => ({ ...prev, imageUpload: true }));
  }, []);

  const handleProfileEditDialog = useCallback(() => {
    setProfileEditData({
      name: appUser?.name || "",
      phone_number: appUser?.phone_number || "",
    });
    setDialogStates((prev) => ({ ...prev, profileEdit: true }));
  }, [appUser?.name, appUser?.phone_number]);

  const handleProfileEditClose = useCallback(() => {
    setDialogStates((prev) => ({ ...prev, profileEdit: false }));
  }, []);

  const handleProfileEditSave = useCallback(async () => {
    try {
      const response = await apiPatchData(API_URLS.USER.UPDATE, {
        name: profileEditData.name,
        phone_number: profileEditData.phone_number,
      });

      if (response) {
        // 성공 시 페이지 데이터 업데이트
        if (appUser) {
          setAppUser({
            ...appUser,
            name: profileEditData.name,
            phone_number: profileEditData.phone_number,
          });
        }

        setDialogStates((prev) => ({ ...prev, profileEdit: false }));
        showSuccessToast("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showErrorToast("Failed to update profile");
    }
  }, [profileEditData, appUser, setAppUser]);

  const handleProfileEditChange = useCallback((field: "name" | "phone_number", value: string) => {
    setProfileEditData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Navigation handlers
  const handleNavigateToProfile = useCallback(() => {
    router.push(PAGE_URLS.SEEKER.MYPAGE.PROFILE);
  }, [router]);

  const handleNavigateToAppliedJobs = useCallback(() => {
    router.push(PAGE_URLS.SEEKER.MYPAGE.APPLIES);
  }, [router]);

  const handleNavigateToBookmarks = useCallback(() => {
    router.push(PAGE_URLS.SEEKER.MYPAGE.BOOKMARKS);
  }, [router]);

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        // userInfo는 동기적으로 설정
        setUserInfoFromAppUser();
        // personality profile만 비동기로 가져오기 (store에 없을 때만)
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
    isLoading: isLoading || workStyleLoading,
    imageUploadLoading,
    dialogStates,
    profileEditData,
    updateProfileImage,
    handleProfileImageChange,
    handleImageUploadDialog,
    handleProfileEditDialog,
    handleProfileEditClose,
    handleProfileEditSave,
    handleProfileEditChange,
    handleNavigateToProfile,
    handleNavigateToAppliedJobs,
    handleNavigateToBookmarks,
    setDialogStates,
  };
};
