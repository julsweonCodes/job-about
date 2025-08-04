import { useState, useCallback } from "react";
import { PAGE_URLS } from "@/constants/api";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import {
  useSeekerMypageQueries,
  UserInfo,
  ApplicantProfileMain,
} from "@/hooks/seeker/useSeekerMypageQueries";

// Types
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
const INITIAL_DIALOG_STATES: DialogStates = {
  imageUpload: false,
  profileEdit: false,
};

export const useSeekerMypageMain = (): UseSeekerMypageMainReturn => {
  const router = useRouter();
  const { appUser } = useAuthStore();

  // React Query hooks
  const { userInfo, applicantProfile, isLoading, updateProfileImage, updateUserProfile } =
    useSeekerMypageQueries();

  // State
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [dialogStates, setDialogStates] = useState<DialogStates>(INITIAL_DIALOG_STATES);
  const [profileEditData, setProfileEditData] = useState<ProfileEditData>({
    name: appUser?.name || "",
    phone_number: appUser?.phone_number || "",
  });

  // Update profile image
  const updateProfileImageHandler = useCallback(
    async (file: File) => {
      try {
        setImageUploadLoading(true);
        await updateProfileImage.mutateAsync(file);
      } catch (error) {
        console.error("Error updating profile image:", error);
      } finally {
        setImageUploadLoading(false);
      }
    },
    [updateProfileImage]
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
      await updateUserProfile.mutateAsync({
        name: profileEditData.name,
        phone_number: profileEditData.phone_number,
      });
      setDialogStates((prev) => ({ ...prev, profileEdit: false }));
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }, [profileEditData, updateUserProfile]);

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
    isLoading,
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
