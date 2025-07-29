"use client";
import React, { useState, useCallback, useMemo } from "react";
import {
  Briefcase,
  Heart,
  Calendar,
  Edit3,
  ChevronRight,
  Lightbulb,
  RefreshCw,
  Camera,
  MapPin,
  Phone,
  Star,
  Globe,
  Plus,
  X,
} from "lucide-react";
import BackHeader from "@/components/common/BackHeader";
import ImageUploadDialog from "@/components/common/ImageUploadDialog";
import BaseDialog from "@/components/common/BaseDialog";
import InfoSection from "@/components/common/InfoSection";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import { LanguageLevel, WORK_TYPES } from "@/constants/enums";
import {
  AVAILABLE_DAY_OPTIONS,
  AVAILABLE_HOUR_OPTIONS,
  LANGUAGE_LEVEL_OPTIONS,
} from "@/constants/options";
import LoadingScreen from "@/components/common/LoadingScreen";
import { JobType } from "@/constants/jobTypes";
import ExperienceFormDialog from "@/components/seeker/ExperienceFormDialog";
import { ExperienceCard } from "@/components/seeker/ExperienceCard";
import JobTypesDialog from "@/components/common/JobTypesDialog";
import RequiredSkillsDialog from "@/app/employer/components/RequiredSkillsDialog";
import { useSeekerMypage } from "@/hooks/useSeekerMypage";
import { useSeekerExperience } from "@/hooks/useSeekerExperience";
import { applicantProfile } from "@/types/profile";
import { API_URLS } from "@/constants/api";
import {
  toPrismaWorkType,
  toPrismaJobType,
  toPrismaLanguageLevel,
  toPrismaAvailableDay,
  toPrismaAvailableHour,
  toPrismaLocation,
} from "@/types/enumMapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { getLocationDisplayName } from "@/constants/location";
import { Skill } from "@/types/profile";
import { STORAGE_URLS } from "@/constants/storage";
import { apiDelete, apiPatch } from "@/utils/client/API";
import { showErrorToast, showSuccessToast } from "@/utils/client/toastUtils";
import { ImageWithSkeleton } from "@/components/ui/ImageWithSkeleton";

import {
  getWorkTypeLabel,
  getAvailabilityDayLabel,
  getAvailabilityHourLabel,
  getLanguageLevelLabel,
  getJobTypeName,
} from "@/utils/client/enumDisplayUtils";
import MypageActionButtons from "@/components/common/MypageActionButtons";

// Types
interface DeleteConfirmDialogState {
  isOpen: boolean;
  experienceIndex: number | null;
}

interface DialogStates {
  profile: boolean;
  imageUpload: boolean;
  skills: boolean;
  preferredJobTypes: boolean;
  deleteConfirm: DeleteConfirmDialogState;
}

// Constants
const INITIAL_DIALOG_STATES: DialogStates = {
  profile: false,
  imageUpload: false,
  skills: false,
  preferredJobTypes: false,
  deleteConfirm: { isOpen: false, experienceIndex: null },
};

const MY_ACTIVITY_ITEMS = [
  {
    id: "applied",
    icon: Briefcase,
    title: "Applied Jobs",
    description: "Track and manage your applications",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    id: "saved",
    icon: Heart,
    title: "Saved Jobs",
    description: "Your bookmarked positions",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
  },
];

const SECTION_MAPPINGS = {
  contact: (data: any) => ({
    phone: data.phone,
  }),
  location: (data: any) => ({
    location: toPrismaLocation(data.location),
  }),
  skills: (data: any) => ({
    profile_practical_skills: data.skillIds.map((i: number) => ({
      practical_skill_id: i,
    })),
  }),
  workType: (data: any) => ({
    work_type: toPrismaWorkType(data.workType),
  }),
  jobTypes: (data: any) => ({
    job_type1: toPrismaJobType(data.jobTypes[0]),
    ...(data.jobTypes[1] && {
      job_type2: toPrismaJobType(data.jobTypes[1]),
    }),
    ...(data.jobTypes[2] && {
      job_type3: toPrismaJobType(data.jobTypes[2]),
    }),
  }),
  availability: (data: any) => ({
    available_day: toPrismaAvailableDay(data.availabilityDay),
    available_hour: toPrismaAvailableHour(data.availabilityTime),
  }),
  languages: (data: any) => ({
    language_level: toPrismaLanguageLevel(data.englishLevel),
  }),
} as const;

function SeekerMypage() {
  // Custom hooks
  const {
    applicantProfile,
    tempData,
    isLoading,
    isEditing,
    availableSkills,
    availableLocations,
    loadingStates,
    userInfo,
    handleEdit: handleEditSection,
    handleCancel: handleCancelSection,
    handleTempInputChange: handleInputChange,
    updateUserProfile: updateProfile,
    updateProfileImageFile,
    setApplicantProfile,
    setTempData,
  } = useSeekerMypage();

  const {
    experienceForm,
    editingExperienceIndex,
    showExperienceDialog,
    showJobTypesDialog,
    setExperienceForm,
    setShowExperienceDialog,
    setShowJobTypesDialog,
    handleAddExperience: addExperience,
    handleEditExperience: editExperience,
    handleSaveExperience: saveExperience,
    handleJobTypeSelect: selectJobType,
    handleJobTypeConfirm: confirmJobType,
  } = useSeekerExperience();

  // Local state
  const [profileImageUrl, setProfileImageUrl] = useState<string>("/images/img-default-profile.png");
  const [newSkill, setNewSkill] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<JobType[]>([]);
  const [dialogStates, setDialogStates] = useState<DialogStates>(INITIAL_DIALOG_STATES);

  // Computed values
  const displayImage = useMemo(() => {
    if (!profileImageUrl || profileImageUrl === "/images/img-default-profile.png") {
      return "/images/img-default-profile.png";
    }
    return profileImageUrl;
  }, [profileImageUrl]);

  const workStyle = useMemo(
    () => ({
      type: "Empathetic Coordinator",
      description:
        "You thrive in collaborative, people-oriented roles where communication and teamwork drive success.",
      emoji: "🤝",
      completedDate: "2 weeks ago",
    }),
    []
  );

  // Effects
  React.useEffect(() => {
    if (userInfo?.img_url) {
      const fullImageUrl = `${STORAGE_URLS.USER.PROFILE_IMG}${userInfo.img_url}`;
      setProfileImageUrl(fullImageUrl);
    }
  }, [userInfo?.img_url]);

  // API Functions
  const updateProfileSection = useCallback(
    async (section: string, payload: Partial<applicantProfile>, showToast: boolean = true) => {
      try {
        console.log("🔍 updateProfileSection payload:", payload);
        const result = await apiPatch(API_URLS.SEEKER.PROFILES, payload);

        if (result.status === "success") {
          if (showToast) {
            showSuccessToast(`${section} updated successfully`);
          }
          setApplicantProfile(tempData);
          return true;
        } else {
          throw new Error(result.message || "Update failed");
        }
      } catch (error) {
        console.error(`Failed to save ${section}:`, error);
        showErrorToast(`Failed to update ${section}: ${(error as Error).message}`);
        return false;
      }
    },
    [tempData, setApplicantProfile]
  );

  const handleOptionsSave = useCallback(
    async (section: keyof typeof SECTION_MAPPINGS) => {
      try {
        const mapper = SECTION_MAPPINGS[section];
        if (!mapper) {
          showErrorToast(`Unknown section: ${section}`);
          return;
        }

        const payload = mapper(tempData);
        const success = await updateProfileSection(section, payload);

        if (success) {
          handleCancelSection(section);
        }
      } catch (error) {
        console.error(`Error updating ${section}:`, error);
        showErrorToast(`Failed to update ${section}`);
      }
    },
    [tempData, updateProfileSection, handleCancelSection]
  );

  // Skills handlers
  const handleSkillsEdit = useCallback(() => {
    const currentSkills = applicantProfile.skillIds
      .map((skillId) => availableSkills.find((skill) => skill.id === skillId))
      .filter(Boolean) as Skill[];
    setSelectedSkills(currentSkills);
    setDialogStates((prev) => ({ ...prev, skills: true }));
  }, [applicantProfile.skillIds, availableSkills]);

  const handleSkillsConfirm = useCallback(
    async (skills: Skill[]) => {
      const skillIds = skills.map((skill) => skill.id);
      handleInputChange("skillIds", skillIds);
      setDialogStates((prev) => ({ ...prev, skills: false }));

      const payload = {
        profile_practical_skills: skillIds.map((i: number) => ({
          practical_skill_id: i,
        })),
      };

      const success = await updateProfileSection("skills", payload, false);
      if (success) {
        setApplicantProfile({
          ...applicantProfile,
          skillIds: skillIds,
        });
        showSuccessToast("Skills updated successfully!");
      }
    },
    [handleInputChange, updateProfileSection, applicantProfile, setApplicantProfile]
  );

  const handleSkillsCancel = useCallback(() => {
    setDialogStates((prev) => ({ ...prev, skills: false }));
  }, []);

  // Job types handlers
  const handleJobTypesEdit = useCallback(() => {
    const currentJobTypes = tempData.jobTypes.map((type: string) => type as JobType);
    setSelectedJobTypes(currentJobTypes);
    setDialogStates((prev) => ({ ...prev, preferredJobTypes: true }));
  }, [tempData.jobTypes]);

  const handleJobTypesConfirm = useCallback(
    async (jobTypes: JobType[]) => {
      const jobTypeStrings = jobTypes.map((type) => type);
      setTempData({ ...tempData, jobTypes: jobTypeStrings });
      setDialogStates((prev) => ({ ...prev, preferredJobTypes: false }));

      const payload = {
        job_type1: jobTypeStrings[0] ? toPrismaJobType(jobTypeStrings[0]) : null,
        job_type2: jobTypeStrings[1] ? toPrismaJobType(jobTypeStrings[1]) : null,
        job_type3: jobTypeStrings[2] ? toPrismaJobType(jobTypeStrings[2]) : null,
      };

      try {
        console.log("🔍 job types payload:", payload);
        const result = await apiPatch(API_URLS.SEEKER.PROFILES, payload);

        if (result.status === "success") {
          setApplicantProfile({
            ...applicantProfile,
            jobTypes: jobTypeStrings,
          });
          showSuccessToast("Job types updated successfully!");
        } else {
          throw new Error(result.message || "Update failed");
        }
      } catch (error) {
        console.error("Failed to save job types:", error);
        showErrorToast(`Failed to update job types: ${(error as Error).message}`);
      }
    },
    [tempData, setTempData, setApplicantProfile, applicantProfile]
  );

  // Experience handlers
  const deleteExperience = useCallback((index: number) => {
    setDialogStates((prev) => ({
      ...prev,
      deleteConfirm: { isOpen: true, experienceIndex: index },
    }));
  }, []);

  const confirmDeleteExperience = useCallback(() => {
    const { experienceIndex } = dialogStates.deleteConfirm;
    if (experienceIndex !== null) {
      const experience = tempData.experiences[experienceIndex];
      const updatedExperiences = tempData.experiences.filter((_, i) => i !== experienceIndex);
      setTempData({ ...tempData, experiences: updatedExperiences });
      showSuccessToast("Experience deleted successfully!");
    }
    setDialogStates((prev) => ({
      ...prev,
      deleteConfirm: { isOpen: false, experienceIndex: null },
    }));
  }, [dialogStates.deleteConfirm, tempData, setTempData]);

  const cancelDeleteExperience = useCallback(() => {
    setDialogStates((prev) => ({
      ...prev,
      deleteConfirm: { isOpen: false, experienceIndex: null },
    }));
  }, []);

  // Profile handlers
  const handleProfileEdit = useCallback(() => {
    setDialogStates((prev) => ({ ...prev, profile: true }));
  }, []);

  const handleCloseProfileDialog = useCallback(() => {
    setDialogStates((prev) => ({ ...prev, profile: false }));
  }, []);

  const handleProfileSave = useCallback(async () => {
    await updateProfile();
    handleCloseProfileDialog();
  }, [updateProfile, handleCloseProfileDialog]);

  const handleProfileContactSave = useCallback(async () => {
    await updateProfile();
  }, [updateProfile]);

  const handleProfileImageChange = useCallback(async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("img", file);

      const result = await apiPatch(API_URLS.USER.UPDATE, formData);

      if (result.data && result.data.img_url !== undefined) {
        // 프로필 이미지 URL을 직접 업데이트
        const fullImageUrl = `${STORAGE_URLS.USER.PROFILE_IMG}${result.data.img_url}`;
        setProfileImageUrl(fullImageUrl);
        showSuccessToast("Profile image updated!");
      } else {
        showErrorToast("Failed to update profile image");
      }
    } catch (error) {
      console.error("Error updating profile image:", error);
      showErrorToast("Failed to update profile image");
    }
  }, []);

  const handleSaveExperiences = useCallback(async () => {
    try {
      const payload = {
        work_experiences: tempData.experiences.map((exp: any) => ({
          company_name: exp.company,
          job_type: exp.jobType,
          start_year: exp.startYear,
          work_period: exp.workedPeriod,
          work_type: exp.workType,
          description: exp.description,
        })),
      };

      const success = await updateProfileSection("work_experiences", payload);
      if (success) {
        showSuccessToast("Work experiences saved successfully!");
      }
    } catch (error) {
      console.error("Error saving work experiences:", error);
      showErrorToast("Failed to save work experiences");
    }
  }, [tempData.experiences, updateProfileSection]);

  const handleImageUploadDialog = useCallback(() => {
    setDialogStates((prev) => ({ ...prev, imageUpload: true }));
  }, []);

  // Utility handlers
  const addSkill = useCallback(() => {
    if (newSkill.trim()) {
      const selectedSkill = availableSkills.find((skill) => skill.name_en === newSkill.trim());
      if (selectedSkill) {
        handleInputChange("skillIds", [...tempData.skillIds, selectedSkill.id]);
        setNewSkill("");
      }
    }
  }, [newSkill, availableSkills, handleInputChange, tempData.skillIds]);

  const removeSkill = useCallback(
    (index: number) => {
      handleInputChange(
        "skillIds",
        tempData.skillIds.filter((_, i) => i !== index)
      );
    },
    [handleInputChange, tempData.skillIds]
  );

  const toggleAvailabilityDay = useCallback(
    (day: string) => {
      handleInputChange("availabilityDay", day);
    },
    [handleInputChange]
  );

  const toggleAvailabilityTime = useCallback(
    (time: string) => {
      handleInputChange("availabilityTime", time);
    },
    [handleInputChange]
  );

  const updateEnglishLevel = useCallback(
    (level: LanguageLevel) => {
      handleInputChange("englishLevel", level);
    },
    [handleInputChange]
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Loading Screen */}
      {isLoading || !applicantProfile || !tempData ? (
        <LoadingScreen message="Loading your profile..." />
      ) : (
        <>
          {/* Header */}
          <BackHeader title="My Page" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4 sm:space-y-5">
            {/* Profile Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 px-1">My Profile</h3>
              <button
                onClick={handleProfileEdit}
                className="p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-200 touch-manipulation"
              >
                <Edit3 size={16} className="text-slate-600" />
              </button>
            </div>

            {/* Profile Summary Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg shadow-slate-200/50 border border-white/50 overflow-hidden">
              <div className="p-5 sm:p-8">
                <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4 sm:gap-6">
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden">
                      <ImageWithSkeleton
                        key={displayImage}
                        src={displayImage}
                        alt={applicantProfile.name}
                        fallbackSrc="/images/img-default-profile.png"
                        className="w-full h-full object-cover"
                        skeletonClassName="bg-gray-200 animate-pulse rounded-xl sm:rounded-2xl"
                      />
                    </div>
                    <button
                      onClick={handleImageUploadDialog}
                      className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors duration-200 z-20"
                    >
                      <Camera className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
                    </button>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                      {applicantProfile.name}
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4 px-2 sm:px-0">
                      {applicantProfile.description}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar
                          size={14}
                          className="sm:w-4 sm:h-4 text-slate-400 flex-shrink-0"
                        />
                        <span>Joined {applicantProfile.joinDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Work Style Personality */}
            <div className="space-y-4 sm:space-y-5">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 px-1">My Work Style</h3>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg shadow-slate-200/50 border border-white/50 overflow-hidden">
                <div className="p-5 sm:p-8">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-100 to-pink-100 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl">
                      {workStyle.emoji || "🤝"}
                    </div>
                    <div>
                      <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
                        {workStyle.type}
                      </h4>
                      <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                        {workStyle.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
                    <Lightbulb size={14} className="sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                    <span>Completed {workStyle.completedDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Sections */}
            <div className="space-y-4 sm:space-y-5">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 px-1">Profile Details</h3>

              {/* Contact Information */}
              <InfoSection
                icon={<Phone size={18} className="text-blue-600" />}
                iconClassName="bg-gradient-to-br from-blue-100 to-indigo-100"
                title="Contact Information"
                subtitle="Your phone number and contact details"
                onEdit={() => handleEditSection("contact")}
                isEditing={isEditing.contact}
                onSave={() => handleOptionsSave("contact")}
                onCancel={() => handleCancelSection("contact")}
              >
                {!isEditing.contact ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm sm:text-base">
                      <Phone size={16} className="text-slate-400 flex-shrink-0" />
                      <span className="text-slate-700">{tempData.phone || "Not provided"}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Input
                      type="phone"
                      value={tempData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full"
                    />
                  </div>
                )}
              </InfoSection>

              {/* Location */}
              <InfoSection
                icon={<MapPin size={18} className="text-green-600" />}
                iconClassName="bg-gradient-to-br from-green-100 to-emerald-100"
                title="Location"
                subtitle="Your preferred work location"
                onEdit={() => handleEditSection("location")}
                isEditing={isEditing.location}
                onSave={() => handleOptionsSave("location")}
                onCancel={() => handleCancelSection("location")}
              >
                {!isEditing.location ? (
                  <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {getLocationDisplayName(tempData.location) || "Not specified"}
                  </span>
                ) : (
                  <Select
                    value={tempData.location}
                    onValueChange={(value) => handleInputChange("location", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your location" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableLocations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {getLocationDisplayName(location)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </InfoSection>

              {/* Skills */}
              <InfoSection
                icon={<Star size={18} className="text-yellow-600" />}
                iconClassName="bg-gradient-to-br from-yellow-100 to-amber-100"
                title="Skills"
                subtitle="Your practical skills and expertise"
                onEdit={handleSkillsEdit}
                isEditing={isEditing.skills}
                onSave={() => handleOptionsSave("skills")}
                onCancel={() => handleCancelSection("skills")}
              >
                {!isEditing.skills ? (
                  <div className="flex flex-wrap gap-2">
                    {tempData.skillIds.length > 0 ? (
                      tempData.skillIds.map((skillId) => {
                        const skill = availableSkills.find((s) => s.id === skillId);
                        return skill ? (
                          <span
                            key={skill.id}
                            className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium"
                          >
                            {skill.name_en}
                          </span>
                        ) : null;
                      })
                    ) : (
                      <span className="text-slate-500 text-sm">No skills added</span>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Search skills..."
                        className="flex-1"
                      />
                      <Button onClick={addSkill} size="sm">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tempData.skillIds.map((skillId, index) => {
                        const skill = availableSkills.find((s) => s.id === skillId);
                        return skill ? (
                          <div
                            key={skill.id}
                            className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium"
                          >
                            <span>{skill.name_en}</span>
                            <button
                              onClick={() => removeSkill(index)}
                              className="text-yellow-600 hover:text-yellow-800"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </InfoSection>

              {/* Work Type */}
              <InfoSection
                icon={<Briefcase size={18} className="text-purple-600" />}
                iconClassName="bg-gradient-to-br from-purple-100 to-violet-100"
                title="Work Type"
                subtitle="Your preferred work arrangement"
                onEdit={() => handleEditSection("workType")}
                isEditing={isEditing.workType}
                onSave={() => handleOptionsSave("workType")}
                onCancel={() => handleCancelSection("workType")}
              >
                {!isEditing.workType ? (
                  <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    {getWorkTypeLabel(tempData.workType) || "Not specified"}
                  </span>
                ) : (
                  <div className="flex gap-2">
                    {WORK_TYPES.map((type) => (
                      <button
                        key={type}
                        onClick={() => handleInputChange("workType", type)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          tempData.workType === type
                            ? "bg-purple-500 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {getWorkTypeLabel(type)}
                      </button>
                    ))}
                  </div>
                )}
              </InfoSection>

              {/* Preferred Job Types */}
              <InfoSection
                icon={<Briefcase size={18} className="text-indigo-600" />}
                iconClassName="bg-gradient-to-br from-indigo-100 to-blue-100"
                title="Preferred Job Types"
                subtitle="Types of jobs you're interested in"
                onEdit={handleJobTypesEdit}
                isEditing={isEditing.jobTypes}
                onSave={() => handleOptionsSave("jobTypes")}
                onCancel={() => handleCancelSection("jobTypes")}
              >
                {!isEditing.jobTypes ? (
                  <div className="flex flex-wrap gap-2">
                    {tempData.jobTypes.length > 0 ? (
                      tempData.jobTypes.map((type) => (
                        <span
                          key={type}
                          className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                        >
                          {getJobTypeName(type)}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 text-sm">No job types selected</span>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    {tempData.jobTypes.map((type) => (
                      <span
                        key={type}
                        className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                      >
                        {getJobTypeName(type)}
                      </span>
                    ))}
                  </div>
                )}
              </InfoSection>

              {/* Availability */}
              <InfoSection
                icon={<Calendar size={18} className="text-orange-600" />}
                iconClassName="bg-gradient-to-br from-orange-100 to-red-100"
                title="Availability"
                subtitle="When you're available to work"
                onEdit={() => handleEditSection("availability")}
                isEditing={isEditing.availability}
                onSave={() => handleOptionsSave("availability")}
                onCancel={() => handleCancelSection("availability")}
              >
                {!isEditing.availability ? (
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                      {getAvailabilityDayLabel(tempData.availabilityDay)}
                    </span>
                    <span className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                      {getAvailabilityHourLabel(tempData.availabilityTime)}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Available Days
                      </label>
                      <div className="flex gap-2">
                        {AVAILABLE_DAY_OPTIONS.map((day) => (
                          <button
                            key={day.value}
                            onClick={() => toggleAvailabilityDay(day.value)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                              tempData.availabilityDay === day.value
                                ? "bg-orange-500 text-white"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                          >
                            {getAvailabilityDayLabel(day.value)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Available Hours
                      </label>
                      <div className="flex gap-2">
                        {AVAILABLE_HOUR_OPTIONS.map((hour) => (
                          <button
                            key={hour.value}
                            onClick={() => toggleAvailabilityTime(hour.value)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                              tempData.availabilityTime === hour.value
                                ? "bg-orange-500 text-white"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                          >
                            {getAvailabilityHourLabel(hour.value)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </InfoSection>

              {/* Work Experience */}
              <InfoSection
                icon={<Briefcase size={18} className="text-emerald-600" />}
                iconClassName="bg-gradient-to-br from-emerald-100 to-teal-100"
                title="Work Experience"
                subtitle="Your previous work experience"
              >
                <div className="space-y-3">
                  {tempData.experiences.map((experience, index) => (
                    <ExperienceCard
                      key={index}
                      index={index}
                      experience={experience as any}
                      onEdit={(_, experience) => editExperience(index, experience)}
                      onDelete={() => deleteExperience(index)}
                    />
                  ))}
                </div>

                <div className={`flex gap-2 justify-end`}>
                  <button
                    onClick={addExperience}
                    className="w-full flex items-center gap-2 sm:w-auto bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-200 hover:shadow-xl touch-manipulation active:scale-[0.98]"
                  >
                    <Plus size={16} />
                    <span className="text-sm sm:text-base">Add Experience</span>
                  </button>
                  <button
                    onClick={handleSaveExperiences}
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl shadow-purple-500/25 hover:shadow-purple-500/30 touch-manipulation active:scale-[0.98]"
                  >
                    <span className="text-sm sm:text-base">Save Changes</span>
                  </button>
                </div>
              </InfoSection>

              {/* Language Proficiency */}
              <InfoSection
                icon={<Globe size={18} className="text-teal-600" />}
                iconClassName="bg-gradient-to-br from-teal-100 to-cyan-100"
                title="Language Proficiency"
                subtitle="Select your language skill level"
                onEdit={() => handleEditSection("languages")}
                isEditing={isEditing.languages}
                onSave={() => handleOptionsSave("languages")}
                onCancel={() => handleCancelSection("languages")}
              >
                {!isEditing.languages ? (
                  <span className="px-3 py-1.5 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                    {getLanguageLevelLabel(tempData.englishLevel)}
                  </span>
                ) : (
                  <div className="flex gap-2">
                    {Object.values(LanguageLevel).map((level) => (
                      <button
                        key={level}
                        onClick={() => updateEnglishLevel(level)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          tempData.englishLevel === level
                            ? "bg-teal-500 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                )}
              </InfoSection>
            </div>

            {/* My Activity */}
            <div className="space-y-4 sm:space-y-5">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 px-1">My Activity</h3>
              <div className="space-y-3 sm:space-y-4">
                {MY_ACTIVITY_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      className="w-full bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg shadow-slate-200/50 border border-white/50 p-4 sm:p-6 hover:shadow-xl hover:shadow-slate-200/60 hover:bg-white/90 transition-all duration-300 group touch-manipulation active:scale-[0.98]"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 sm:gap-5 min-w-0 flex-1">
                          <div
                            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${item.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}
                          >
                            <Icon size={20} className={`sm:w-6 sm:h-6 ${item.iconColor}`} />
                          </div>
                          <div className="text-left min-w-0 flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                              <h4 className="text-base sm:text-lg font-semibold text-slate-900 truncate">
                                {item.title}
                              </h4>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-500 line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <ChevronRight
                          size={18}
                          className="sm:w-5 sm:h-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 ml-2"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Spacing for Mobile */}
            <div className="h-4 sm:h-0"></div>
          </div>

          {/* Dialogs */}
          <ExperienceFormDialog
            title={editingExperienceIndex >= 0 ? "Edit Job Experience" : "Add Job Experience"}
            open={showExperienceDialog}
            onClose={() => setShowExperienceDialog(false)}
            experienceForm={experienceForm}
            setExperienceForm={setExperienceForm}
            onSave={() =>
              saveExperience(tempData.experiences, (updatedExperiences) => {
                setTempData({ ...tempData, experiences: updatedExperiences });
              })
            }
            editingIndex={editingExperienceIndex}
            onJobTypeSelect={() => setShowJobTypesDialog(true)}
          />

          <JobTypesDialog
            title="Select Job Type"
            open={showJobTypesDialog}
            onClose={() => setShowJobTypesDialog(false)}
            selectedJobTypes={experienceForm.jobType ? [experienceForm.jobType] : []}
            onConfirm={(jobTypes) => {
              if (jobTypes.length > 0) {
                setExperienceForm((f) => ({ ...f, jobType: jobTypes[0] as JobType }));
              }
              setShowJobTypesDialog(false);
            }}
            maxSelected={1}
          />

          <RequiredSkillsDialog
            open={dialogStates.skills}
            onClose={handleSkillsCancel}
            selectedSkills={selectedSkills}
            onConfirm={handleSkillsConfirm}
            skills={availableSkills}
          />

          <JobTypesDialog
            title="Select Preferred Job Types"
            open={dialogStates.preferredJobTypes}
            onClose={() => setDialogStates((prev) => ({ ...prev, preferredJobTypes: false }))}
            selectedJobTypes={selectedJobTypes}
            onConfirm={handleJobTypesConfirm}
            maxSelected={3}
          />

          {/* Profile Dialog */}
          <BaseDialog
            open={dialogStates.profile}
            onClose={handleCloseProfileDialog}
            title="Edit Profile"
            size="md"
            type="bottomSheet"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                <Input
                  value={tempData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your name"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <TextArea
                  value={tempData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                variant="secondary"
                size="lg"
                onClick={handleCloseProfileDialog}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleProfileSave} className="flex-1" variant="gradient" size="lg">
                Save
              </Button>
            </div>
          </BaseDialog>

          {/* Image Upload Dialog */}
          <ImageUploadDialog
            open={dialogStates.imageUpload}
            onClose={() => setDialogStates((prev) => ({ ...prev, imageUpload: false }))}
            onSave={handleProfileImageChange}
            title="Update Profile Picture"
            type="profile"
          />

          {/* Delete Confirmation Dialog */}
          <BaseDialog
            open={dialogStates.deleteConfirm.isOpen}
            onClose={cancelDeleteExperience}
            title="Delete Experience"
            size="sm"
            type="bottomSheet"
            actions={
              <div className="flex gap-3 w-full">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={cancelDeleteExperience}
                  className="w-full"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDeleteExperience}
                  className="w-full"
                  variant="red"
                  size="lg"
                >
                  Delete
                </Button>
              </div>
            }
          >
            <div className="text-center py-6">
              <p className="text-sm text-gray-600 leading-relaxed text-sm sm:text-base">
                Are you sure you want to delete your experience at{" "}
                <span className="font-semibold text-gray-900">
                  {dialogStates.deleteConfirm.experienceIndex !== null
                    ? tempData.experiences[dialogStates.deleteConfirm.experienceIndex]?.company
                    : ""}
                </span>
                ? This action cannot be undone.
              </p>
            </div>
          </BaseDialog>
        </>
      )}
    </div>
  );
}

export default SeekerMypage;
