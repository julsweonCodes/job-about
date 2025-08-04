import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGetData, apiPatchData } from "@/utils/client/API";
import { API_URLS } from "@/constants/api";
import { showErrorToast, showSuccessToast } from "@/utils/client/toastUtils";
import { PAGE_URLS } from "@/constants/api";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";

// Types
export interface UserInfo {
  name: string;
  description: string;
  phone_number: string;
  img_url?: string;
  created_at: Date;
}

export interface PersonalityProfile {
  id?: number;
  name_ko: string;
  name_en: string;
  description_ko: string;
  description_en: string;
}

export interface ApplicantProfileMain {
  name: string;
  description: string;
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

// API Functions
const fetchPersonalityProfile = async (): Promise<PersonalityProfile | null> => {
  try {
    const profileData = await apiGetData<PersonalityProfile | null>(API_URLS.QUIZ.MY_PROFILE);
    return profileData || null;
  } catch (error) {
    console.error("Error fetching personality profile:", error);
    showErrorToast("Failed to load personality data");
    return null;
  }
};

// Constants
const INITIAL_DIALOG_STATES: DialogStates = {
  imageUpload: false,
  profileEdit: false,
};

export const useSeekerMypageMain = (): UseSeekerMypageMainReturn => {
  const router = useRouter();
  const { updateProfileImage: updateAuthProfileImage, setAppUser } = useAuthStore();
  const queryClient = useQueryClient();

  // React Query hooks
  const userInfoQuery = useQuery({
    queryKey: ["user-info"],
    queryFn: async () => {
      const userData = await apiGetData(API_URLS.USER.ME);
      return userData.user;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const personalityQuery = useQuery({
    queryKey: ["personality-profile"],
    queryFn: fetchPersonalityProfile,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Mutations
  const updateProfileImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("img", file);
      return await apiPatchData(API_URLS.USER.UPDATE_PROFILE_IMAGE, formData);
    },
    onSuccess: (result) => {
      if (result && result.img_url !== undefined) {
        showSuccessToast("Profile image updated!");
        // Update auth store
        updateAuthProfileImage(result.img_url);
        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ["user-info"] });
        queryClient.invalidateQueries({ queryKey: ["personality-profile"] });
      } else {
        showErrorToast("Failed to update profile image");
      }
    },
    onError: (error) => {
      console.error("Error updating profile image:", error);
      showErrorToast("Failed to update profile image");
    },
  });

  const updateUserProfileMutation = useMutation({
    mutationFn: async (userData: { name: string; phone_number: string }) => {
      return await apiPatchData(API_URLS.USER.UPDATE, userData);
    },
    onSuccess: (result) => {
      showSuccessToast("Profile updated successfully!");
      // Update auth store if result contains user data
      if (result && result.user) {
        setAppUser(result.user);
      }
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ["user-info"] });
      queryClient.invalidateQueries({ queryKey: ["personality-profile"] });
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      showErrorToast("Failed to update profile");
    },
  });

  // Derived data
  const userInfo: UserInfo | null = userInfoQuery.data || null;

  const applicantProfile: ApplicantProfileMain = {
    name: userInfo?.name || "",
    description: userInfo?.description || "",
    personalityName: personalityQuery.data?.name_en || "",
    personalityDesc: personalityQuery.data?.description_en || "",
  };

  // State
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [dialogStates, setDialogStates] = useState<DialogStates>(INITIAL_DIALOG_STATES);
  const [profileEditData, setProfileEditData] = useState<ProfileEditData>({
    name: userInfo?.name || "",
    phone_number: userInfo?.phone_number || "",
  });

  // Update profile image
  const updateProfileImageHandler = useCallback(
    async (file: File) => {
      try {
        setImageUploadLoading(true);
        await updateProfileImageMutation.mutateAsync(file);
      } catch (error) {
        console.error("Error updating profile image:", error);
      } finally {
        setImageUploadLoading(false);
      }
    },
    [updateProfileImageMutation]
  );

  // Profile image change handler
  const handleProfileImageChange = useCallback(
    async (file: File) => {
      try {
        await updateProfileImageHandler(file);
      } catch (error) {
        console.error("Error updating profile image:", error);
      }
    },
    [updateProfileImageHandler]
  );

  // Dialog handlers
  const handleImageUploadDialog = useCallback(() => {
    setDialogStates((prev) => ({ ...prev, imageUpload: true }));
  }, []);

  const handleProfileEditDialog = useCallback(() => {
    setProfileEditData({
      name: userInfo?.name || "",
      phone_number: userInfo?.phone_number || "",
    });
    setDialogStates((prev) => ({ ...prev, profileEdit: true }));
  }, [userInfo?.name, userInfo?.phone_number]);

  const handleProfileEditClose = useCallback(() => {
    setDialogStates((prev) => ({ ...prev, profileEdit: false }));
  }, []);

  const handleProfileEditSave = useCallback(async () => {
    try {
      await updateUserProfileMutation.mutateAsync({
        name: profileEditData.name,
        phone_number: profileEditData.phone_number,
      });
      setDialogStates((prev) => ({ ...prev, profileEdit: false }));
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }, [profileEditData, updateUserProfileMutation]);

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

  return {
    userInfo,
    applicantProfile,
    isLoading: userInfoQuery.isLoading || personalityQuery.isLoading,
    imageUploadLoading,
    dialogStates,
    profileEditData,
    updateProfileImage: updateProfileImageHandler,
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
