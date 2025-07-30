"use client";
import React, { useState, useCallback, useMemo } from "react";
import {
  Briefcase,
  Heart,
  Calendar,
  ChevronRight,
  Camera,
  Phone,
  User,
  Zap,
  Pencil,
} from "lucide-react";
import BackHeader from "@/components/common/BackHeader";
import ImageUploadDialog from "@/components/common/ImageUploadDialog";
import LoadingScreen from "@/components/common/LoadingScreen";
import { useSeekerMypageMain } from "@/hooks/useSeekerMypageMain";
import { useRouter } from "next/navigation";
import { STORAGE_URLS } from "@/constants/storage";
import { showErrorToast, showSuccessToast } from "@/utils/client/toastUtils";
import { ImageWithSkeleton } from "@/components/ui/ImageWithSkeleton";
import { useAuthStore } from "@/stores/useAuthStore";
import { ProfileEditDialog } from "@/components/seeker/ProfileEditDialog";
import { apiPatch } from "@/utils/client/API";
import { API_URLS } from "@/constants/api";

interface DialogStates {
  imageUpload: boolean;
  profileEdit: boolean;
}

const INITIAL_DIALOG_STATES: DialogStates = {
  imageUpload: false,
  profileEdit: false,
};

function SeekerMypage() {
  const router = useRouter();
  const { appUser, setAppUser } = useAuthStore();

  // Custom hooks
  const { userInfo, applicantProfile, isLoading, imageUploadLoading, updateProfileImage } =
    useSeekerMypageMain();

  // Local state
  const [dialogStates, setDialogStates] = useState<DialogStates>(INITIAL_DIALOG_STATES);
  const [profileEditData, setProfileEditData] = useState({
    name: appUser?.name || "",
    phone_number: appUser?.phone_number || "",
  });

  // Computed values
  const displayImage = useMemo(() => {
    if (userInfo?.img_url) {
      return `${STORAGE_URLS.USER.PROFILE_IMG}${userInfo.img_url}`;
    }
    return "/images/img-default-profile.png";
  }, [userInfo?.img_url]);

  // API Functions
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

  // Event handlers
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
      const formData = new FormData();
      formData.append("name", profileEditData.name);
      formData.append("phone_number", profileEditData.phone_number);

      const response = await apiPatch(API_URLS.USER.UPDATE, formData);

      if (response.status === 200) {
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
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showErrorToast("Failed to update profile");
    }
  }, [profileEditData, appUser]);

  const handleProfileEditChange = useCallback((field: "name" | "phone_number", value: string) => {
    setProfileEditData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleNavigateToProfile = useCallback(() => {
    router.push("/seeker/mypage/profile");
  }, [router]);

  const handleNavigateToAppliedJobs = useCallback(() => {
    router.push("/seeker/mypage/applied");
  }, [router]);

  const handleNavigateToBookmarks = useCallback(() => {
    router.push("/seeker/mypage/bookmarks");
  }, [router]);

  // Loading states
  if (isLoading) {
    return <LoadingScreen message="Loading profile..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-pretendard">
      {/* Loading Screen for API calls */}
      {imageUploadLoading && (
        <LoadingScreen overlay={true} spinnerSize="lg" spinnerColor="purple" opacity="light" />
      )}

      {/* Header */}
      <BackHeader title="My Page" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Profile Summary Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg shadow-slate-200/50 border border-white/50 overflow-hidden relative">
          <button
            onClick={handleProfileEditDialog}
            className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors duration-200 z-10"
          >
            <Pencil className="w-4 h-4 text-slate-600" />
          </button>
          <div className="p-6 sm:p-8">
            <div className="flex flex-col items-center justify-center text-center sm:flex-row sm:items-center sm:text-left gap-6">
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl overflow-hidden">
                  <ImageWithSkeleton
                    key={displayImage}
                    src={displayImage}
                    alt={appUser?.name || "Profile"}
                    fallbackSrc="/images/img-default-profile.png"
                    className="w-full h-full object-cover"
                    skeletonClassName="bg-gray-200 animate-pulse rounded-2xl sm:rounded-3xl"
                  />
                </div>
                <button
                  onClick={handleImageUploadDialog}
                  className="absolute -bottom-1 -right-1 p-2 bg-white rounded-full shadow-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors duration-200 z-20"
                >
                  <Camera className="w-4 h-4 text-slate-600" />
                </button>
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                  {appUser?.name || "User"}
                </h2>

                <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-slate-400" />
                    <span>{appUser?.phone_number || "No phone number"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-slate-400" />
                    <span>
                      Joined{" "}
                      {appUser?.created_at
                        ? new Date(appUser.created_at)
                            .toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })
                            .replace(/(\d+)\/(\d+)\/(\d+)/, "$3. $1. $2")
                        : "Unknown"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Work Style */}
        {applicantProfile.personalityName && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg shadow-slate-200/50 border border-white/50 overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">Work Style</h3>
                  <p className="text-sm text-slate-600">Your personality and work preferences</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">
                    {applicantProfile.personalityName}
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {applicantProfile.personalityDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 px-1">Quick Actions</h3>

          <div className="grid grid-cols-1 gap-4">
            {/* Applied Jobs */}
            <button
              onClick={handleNavigateToAppliedJobs}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-white/50 p-6 hover:shadow-xl transition-all duration-200 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-slate-900 mb-1">Applied Jobs</h4>
                  <p className="text-sm text-slate-600">View your job applications</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </div>
            </button>

            {/* Bookmarked Jobs */}
            <button
              onClick={handleNavigateToBookmarks}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-white/50 p-6 hover:shadow-xl transition-all duration-200 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-pink-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-slate-900 mb-1">Bookmarked Jobs</h4>
                  <p className="text-sm text-slate-600">Your saved job posts</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </div>
            </button>
          </div>
        </div>

        {/* Profile Management */}
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 px-1">Profile Management</h3>

          <button
            onClick={handleNavigateToProfile}
            className="w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-white/50 p-6 hover:shadow-xl transition-all duration-200 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-semibold text-slate-900 mb-1">Profile Settings</h4>
                <p className="text-sm text-slate-600">
                  Edit your skills, experience, and preferences
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </div>
          </button>
        </div>
      </div>

      {/* Image Upload Dialog */}
      <ImageUploadDialog
        open={dialogStates.imageUpload}
        onClose={() => setDialogStates((prev) => ({ ...prev, imageUpload: false }))}
        onSave={handleProfileImageChange}
        title="Update Profile Picture"
        type="profile"
      />

      {/* Profile Edit Dialog */}
      <ProfileEditDialog
        open={dialogStates.profileEdit}
        onClose={handleProfileEditClose}
        onSave={handleProfileEditSave}
        data={profileEditData}
        onChange={handleProfileEditChange}
      />
    </div>
  );
}

export default SeekerMypage;
