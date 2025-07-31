"use client";
import React, { useMemo } from "react";
import { Briefcase, Heart, Calendar, Camera, Phone, User, Zap, Pencil } from "lucide-react";
import BackHeader from "@/components/common/BackHeader";
import ImageUploadDialog from "@/components/common/ImageUploadDialog";
import { useSeekerMypageMain } from "@/hooks/seeker/useSeekerMypageMain";
import { STORAGE_URLS } from "@/constants/storage";
import { ImageWithSkeleton } from "@/components/ui/ImageWithSkeleton";
import { useAuthStore } from "@/stores/useAuthStore";
import { ProfileEditDialog } from "@/components/seeker/ProfileEditDialog";
import { QuickActionCard } from "@/components/seeker/QuickActionCard";
import { Button } from "@/components/ui/Button";
import LoadingScreen from "@/components/common/LoadingScreen";

// 스켈레톤 컴포넌트들
const ProfileSkeleton = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg shadow-slate-200/50 border border-white/50 overflow-hidden relative">
    <div className="p-6 sm:p-8">
      <div className="flex flex-col items-center justify-center text-center sm:flex-row sm:items-center sm:text-left gap-6">
        <div className="relative flex-shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl bg-gray-200 animate-pulse" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center space-y-3">
          <div className="h-8 bg-gray-200 rounded-lg animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const WorkStyleSkeleton = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg shadow-slate-200/50 border border-white/50 overflow-hidden">
    <div className="p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse" />
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded animate-pulse w-24" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-5 bg-gray-200 rounded animate-pulse w-40" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
        </div>
      </div>
    </div>
  </div>
);

const QuickActionSkeleton = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-white/50 p-6">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-gray-200 rounded animate-pulse w-32" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-48" />
      </div>
      <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
    </div>
  </div>
);

function SeekerMypage() {
  const { appUser } = useAuthStore();

  // Custom hooks
  const {
    userInfo,
    applicantProfile,
    isLoading,
    imageUploadLoading,
    dialogStates,
    profileEditData,
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
  } = useSeekerMypageMain();

  // Computed values
  const displayImage = useMemo(() => {
    if (userInfo?.img_url) {
      return `${STORAGE_URLS.USER.PROFILE_IMG}${userInfo.img_url}`;
    }
    return "/images/img-default-profile.png";
  }, [userInfo?.img_url]);

  return (
    <div className="min-h-screen bg-gray-50 font-pretendard">
      {/* Loading Screen for API calls */}
      {imageUploadLoading && <LoadingScreen overlay={true} opacity="light" />}

      {/* Header */}
      <BackHeader title="My Page" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Profile Summary Card */}
        {isLoading ? (
          <ProfileSkeleton />
        ) : (
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
                      className="w-full h-full object-cover "
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
                          ? new Date(appUser.created_at).toLocaleDateString()
                          : "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Work Style */}
        {isLoading ? (
          <WorkStyleSkeleton />
        ) : (
          applicantProfile.personalityName && (
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

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-8 border-t border-slate-100">
                  <Button
                    onClick={() => (window.location.href = "/seeker")}
                    variant="gradient"
                    size="lg"
                    className="flex-1"
                  >
                    <Briefcase className="w-4 h-4" />
                    See Recommended Jobs
                  </Button>

                  <Button
                    onClick={() => (window.location.href = "/onboarding/seeker/quiz")}
                    variant="secondary"
                    size="lg"
                    className="flex-1"
                  >
                    Retake Quiz
                  </Button>
                </div>
              </div>
            </div>
          )
        )}

        {/* Quick Actions */}
        <div className="space-y-4">
          {isLoading ? (
            <>
              <QuickActionSkeleton />
              <QuickActionSkeleton />
              <QuickActionSkeleton />
            </>
          ) : (
            <>
              {/* Profile Management */}
              <QuickActionCard
                icon={User}
                iconBgColor="bg-purple-100"
                iconColor="text-purple-600"
                title="Profile Management"
                description="Edit your profile and work experience"
                onClick={handleNavigateToProfile}
              />

              {/* Applied Jobs */}
              <QuickActionCard
                icon={Briefcase}
                iconBgColor="bg-blue-100"
                iconColor="text-blue-600"
                title="Applied Jobs"
                description="View your job applications and status"
                onClick={handleNavigateToAppliedJobs}
              />

              {/* Bookmarks */}
              <QuickActionCard
                icon={Heart}
                iconBgColor="bg-red-100"
                iconColor="text-red-600"
                title="Bookmarks"
                description="View your saved job posts"
                onClick={handleNavigateToBookmarks}
              />
            </>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <ImageUploadDialog
        open={dialogStates.imageUpload}
        onClose={() => setDialogStates((prev) => ({ ...prev, imageUpload: false }))}
        onSave={handleProfileImageChange}
        title="Update Profile Picture"
        type="profile"
      />

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
