"use client";
import React, { useState } from "react";
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
import { AVAILABLE_DAY_OPTIONS, AVAILABLE_HOUR_OPTIONS } from "@/constants/options";
import LoadingScreen from "@/components/common/LoadingScreen";
import { JobType } from "@/constants/jobTypes";
import ExperienceFormDialog from "@/components/seeker/ExperienceFormDialog";
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
import { Location } from "@/constants/location";
import { Skill } from "@/types/profile";
import { STORAGE_URLS } from "@/constants/storage";
import { apiDelete } from "@/utils/client/API";
import { showErrorToast, showSuccessToast } from "@/utils/client/toastUtils";

function SeekerMypage() {
  // 커스텀 훅 사용 (최상단에서 호출)
  const {
    applicantProfile,
    tempData,
    isLoading,
    isEditing,
    availableSkills,
    availableLocations,
    loadingStates,
    handleEdit: handleEditSection,
    handleCancel: handleCancelSection,
    handleTempInputChange: handleInputChange,
    updateUserProfile: updateProfile,
    updateProfileImage: updateImage,
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

  // 모든 useState 훅을 조건문 이전에 호출
  const [newSkill, setNewSkill] = useState("");
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showImageUploadDialog, setShowImageUploadDialog] = useState(false);
  const [showSkillsDialog, setShowSkillsDialog] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<JobType[]>([]);
  const [showPreferredJobTypesDialog, setShowPreferredJobTypesDialog] = useState(false);

  // 로딩 상태 체크 (훅 호출 이후에 위치)
  if (isLoading || !applicantProfile || !tempData) {
    return <LoadingScreen message="Loading your profile..." />;
  }

  // Skills 관련 함수들
  const handleSkillsEdit = () => {
    // 현재 선택된 skills를 id로 매칭하여 실제 Skill 객체 찾기
    const currentSkills = tempData.skillIds
      .map((skillId) => {
        const foundSkill = availableSkills.find((skill) => skill.id === skillId);
        return foundSkill;
      })
      .filter(Boolean) as Skill[];
    setSelectedSkills(currentSkills);
    setShowSkillsDialog(true);
  };

  const handleSkillsConfirm = (skills: Skill[]) => {
    const skillIds = skills.map((skill) => skill.id);
    // skillIds 배열로 저장
    handleInputChange("skillIds", skillIds as any);
    setShowSkillsDialog(false);
  };

  const handleSkillsCancel = () => {
    setShowSkillsDialog(false);
  };

  // TODO call api to get workStyle
  const workStyle = {
    type: "Empathetic Coordinator",
    description:
      "You thrive in collaborative, people-oriented roles where communication and teamwork drive success.",
    emoji: "🤝",
    completedDate: "2 weeks ago",
  };

  const myActivity = [
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

  // API 호출 로직을 별도 함수로 분리
  const updateProfileSection = async (section: string, payload: Partial<applicantProfile>) => {
    try {
      const response = await fetch(API_URLS.SEEKER.PROFILES, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.status === "success") {
        showSuccessToast(`${section} updated successfully`);
        return true;
      } else {
        throw new Error(result.message || "Update failed");
      }
    } catch (error) {
      console.error(`Failed to save ${section}:`, error);
      showErrorToast(`Failed to update ${section}: ${(error as Error).message}`);
      return false;
    }
  };

  // 섹션별 매핑 객체로 리팩토링
  const SECTION_MAPPINGS = {
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

  // SECTION_MAPPINGS를 사용하는 개선된 저장 함수
  const handleOptionsSave = async (section: keyof typeof SECTION_MAPPINGS) => {
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
  };

  const handleProfileEdit = () => {
    setShowProfileDialog(true);
  };

  const handleCloseProfileDialog = () => {
    setShowProfileDialog(false);
  };

  const handleProfileSave = async () => {
    await updateProfile();
    handleCloseProfileDialog();
  };

  const handleProfileContactSave = async () => {
    await updateProfile();
  };

  const handleProfileImageChange = async (file: File) => {
    await updateImage(file);
  };

  const handleImageUploadDialog = () => {
    setShowImageUploadDialog(true);
  };

  // Job Preferences 관련 함수들
  const addSkill = () => {
    if (newSkill.trim()) {
      const selectedSkill = availableSkills.find((skill) => skill.name_en === newSkill.trim());
      if (selectedSkill) {
        handleInputChange("skillIds", [...tempData.skillIds, selectedSkill.id] as any);
        setNewSkill("");
      }
    }
  };

  const removeSkill = (index: number) => {
    handleInputChange("skillIds", tempData.skillIds.filter((_, i) => i !== index) as any);
  };

  const handleJobTypesEdit = () => {
    // 현재 선택된 job types를 JobType[] 형태로 변환
    const currentJobTypes = tempData.jobTypes.map((type: string) => type as JobType);
    setSelectedJobTypes(currentJobTypes);
    setShowPreferredJobTypesDialog(true);
  };

  const handleJobTypesConfirm = (jobTypes: JobType[]) => {
    // JobType[]를 string[]로 변환하여 저장
    const jobTypeStrings = jobTypes.map((type) => type);
    handleInputChange("jobTypes", jobTypeStrings as any);
    setShowPreferredJobTypesDialog(false);
  };

  const toggleAvailabilityDay = (day: string) => {
    handleInputChange("availabilityDay", day);
  };

  const toggleAvailabilityTime = (time: string) => {
    handleInputChange("availabilityTime", time);
  };

  const updateEnglishLevel = (level: LanguageLevel) => {
    handleInputChange("englishLevel", level);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <BackHeader title="My Page" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4 sm:space-y-5">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 px-1 flex items-center justify-between">
          <span>My Profile</span>
          <button
            onClick={handleProfileEdit}
            className="p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-200 touch-manipulation"
          >
            <Edit3 size={16} className="text-slate-600" />
          </button>
        </h3>

        {/* 1. Profile Summary Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg shadow-slate-200/50 border border-white/50 overflow-hidden">
          <div className="p-5 sm:p-8">
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4 sm:gap-6">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden relative">
                  {/* 스켈레톤 로더 */}
                  <div
                    id="profile-skeleton"
                    className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl sm:rounded-2xl z-10"
                  />
                  <img
                    src={
                      applicantProfile.profileImageUrl
                        ? `${STORAGE_URLS.USER.PROFILE_IMG}${applicantProfile.profileImageUrl}`
                        : "/images/img-default-profile.png"
                    }
                    alt={applicantProfile.name}
                    className="w-full h-full object-cover relative z-20"
                    onLoad={(e) => {
                      const skeleton = document.getElementById("profile-skeleton");
                      if (skeleton) {
                        skeleton.style.opacity = "0";
                        setTimeout(() => {
                          skeleton.style.display = "none";
                        }, 300);
                      }
                    }}
                    onError={(e) => {
                      e.currentTarget.src = "/images/img-default-profile.png";
                      const skeleton = document.getElementById("profile-skeleton");
                      if (skeleton) {
                        skeleton.style.opacity = "0";
                        setTimeout(() => {
                          skeleton.style.display = "none";
                        }, 300);
                      }
                    }}
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
                    <Calendar size={14} className="sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                    <span>Joined {applicantProfile.joinDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Work Style Personality */}
        <div className="space-y-4 sm:space-y-5">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 px-1">My Work Style</h3>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg shadow-slate-200/50 border border-white/50 overflow-hidden">
            <div className="p-5 sm:p-8">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-100 to-pink-100 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl">
                  {workStyle.emoji || "🤝"}
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-bold text-slate-900 mb-0">
                    {applicantProfile.personalityName || "Empathetic Coordinator"}
                  </h4>
                </div>
              </div>

              <div className="mb-5 sm:mb-6">
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {applicantProfile.personalityDesc ||
                    "You thrive in collaborative, people-oriented roles where communication and teamwork drive success."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={async () => {
                    try {
                      console.log("Starting DELETE request...");
                      const response = await apiDelete(API_URLS.SEEKER.PROFILES);
                      console.log("DELETE response:", response);
                      showSuccessToast(response.message || "Profile deleted");
                    } catch (error) {
                      console.error("DELETE error:", error);
                      showErrorToast("Error deleting profile: " + (error as Error).message);
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl shadow-purple-500/25 hover:shadow-purple-500/30 touch-manipulation active:scale-[0.98]"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Lightbulb size={16} className="sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">See Recommended Jobs (DELETE TEST)</span>
                  </div>
                </button>
                <button className="flex-1 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-200 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md touch-manipulation active:scale-[0.98]">
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw size={16} className="sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">Retake Quiz</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Contact Information */}
        <div className="space-y-4 sm:space-y-5">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 px-1">Contact Information</h3>

          <InfoSection
            iconClassName="bg-gradient-to-br from-green-100 to-emerald-100"
            icon={<Phone size={18} className="text-green-600" />}
            title="Phone Number"
            subtitle="Your contact phone number"
            onEdit={() => handleEditSection("contact")}
            isEditing={isEditing.contact}
            onSave={() => handleProfileContactSave()}
            onCancel={() => handleCancelSection("contact")}
          >
            {isEditing.contact ? (
              <Input
                label="Phone Number"
                type="phone"
                value={tempData.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("phone", e.target.value)
                }
                placeholder="(555) 123-4567"
                rightIcon={<Phone className="w-5 h-5" />}
              />
            ) : (
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-slate-400" />
                <span className="text-slate-700 font-medium">
                  {applicantProfile.phone || "Enter your phone number"}
                </span>
              </div>
            )}
          </InfoSection>

          <InfoSection
            iconClassName="bg-gradient-to-br from-purple-100 to-pink-100"
            icon={<MapPin size={18} className="text-purple-600" />}
            title="Location"
            subtitle="Your current location"
            onEdit={() => handleEditSection("location")}
            isEditing={isEditing.location}
            onSave={() => handleOptionsSave("location")}
            onCancel={() => handleCancelSection("location")}
          >
            {isEditing.location ? (
              <div className="space-y-3">
                <Select
                  value={tempData.location || ""}
                  onValueChange={(value) => handleInputChange("location", value)}
                >
                  <SelectTrigger className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 outline-none text-slate-900 font-medium">
                    <SelectValue placeholder="Select your location" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(availableLocations) && availableLocations.length > 0 ? (
                      availableLocations.map((city) => {
                        const displayName = getLocationDisplayName(city);
                        return (
                          <SelectItem
                            key={city}
                            value={city}
                            selectedValue={tempData.location || ""}
                          >
                            {displayName}
                          </SelectItem>
                        );
                      })
                    ) : (
                      <SelectItem value="" disabled>
                        No cities available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-slate-400" />
                <span className="text-slate-700 font-medium">
                  {getLocationDisplayName(applicantProfile.location)}
                </span>
              </div>
            )}
          </InfoSection>
        </div>

        {/* 4. Job Preferences */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Job Preferences</h2>

          {/* Skills */}
          <InfoSection
            icon={<Star size={18} className="text-blue-600" />}
            iconClassName="bg-gradient-to-br from-blue-100 to-indigo-100"
            title="Skills"
            subtitle="Your professional skills and expertise"
            onEdit={handleSkillsEdit}
            isEditing={isEditing.skills}
            onSave={() => handleOptionsSave("skills")}
            onCancel={() => handleCancelSection("skills")}
          >
            {!isEditing.skills ? (
              <div className="flex flex-wrap gap-2">
                {tempData.skillIds.map((skillId, index) => {
                  const skill = availableSkills.find((s) => s.id === skillId);
                  return skill ? (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {skill.name_en}
                    </span>
                  ) : null;
                })}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {tempData.skillIds.map((skillId, index) => {
                    const skill = availableSkills.find((s) => s.id === skillId);
                    return skill ? (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2"
                      >
                        {skill.name_en}
                        <button
                          onClick={() => removeSkill(index)}
                          className="hover:bg-blue-200 rounded-full p-0.5"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
                <div className="space-y-3">
                  <Select value={newSkill || ""} onValueChange={(value) => setNewSkill(value)}>
                    <SelectTrigger className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 outline-none text-slate-900 font-medium">
                      <SelectValue placeholder="Select a skill to add" />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingStates.skills ? (
                        <SelectItem value="" disabled>
                          Loading skills...
                        </SelectItem>
                      ) : availableSkills.filter((skill) => !tempData.skillIds.includes(skill.id))
                          .length > 0 ? (
                        availableSkills
                          .filter((skill) => !tempData.skillIds.includes(skill.id))
                          .map((skill) => (
                            <SelectItem key={skill.id} value={skill.name_en}>
                              {skill.name_en}
                            </SelectItem>
                          ))
                      ) : (
                        <SelectItem value="" disabled>
                          No skills available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <button
                    onClick={addSkill}
                    disabled={!newSkill}
                    className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-300 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add Skill
                  </button>
                </div>
              </div>
            )}
          </InfoSection>

          {/* Work Type */}
          <InfoSection
            icon={<Globe size={18} className="text-green-600" />}
            iconClassName="bg-gradient-to-br from-green-100 to-emerald-100"
            title="Work Type"
            subtitle="Remote, on-site, or hybrid preference"
            onEdit={() => handleEditSection("workType")}
            isEditing={isEditing.workType}
            onSave={() => handleOptionsSave("workType")}
            onCancel={() => handleCancelSection("workType")}
          >
            {!isEditing.workType ? (
              <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                {tempData.workType}
              </span>
            ) : (
              <div className="flex gap-2">
                {WORK_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleInputChange("workType", type)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      tempData.workType === type
                        ? "bg-green-500 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ")}
                  </button>
                ))}
              </div>
            )}
          </InfoSection>

          {/* Preferred Job Types */}
          <InfoSection
            icon={<Briefcase size={18} className="text-purple-600" />}
            iconClassName="bg-gradient-to-br from-purple-100 to-pink-100"
            title="Preferred Job Types"
            subtitle="Types of roles you're interested in"
            onEdit={handleJobTypesEdit}
            isEditing={false}
            onSave={() => {}}
            onCancel={() => {}}
          >
            <div className="flex flex-wrap gap-2">
              {tempData.jobTypes.map((type, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                >
                  {type}
                </span>
              ))}
            </div>
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
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {tempData.availabilityDay && (
                    <span className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                      {tempData.availabilityDay}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {tempData.availabilityTime && (
                    <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                      {tempData.availabilityTime}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Days</p>
                  <div className="flex gap-2">
                    {AVAILABLE_DAY_OPTIONS.map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => toggleAvailabilityDay(value)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          tempData.availabilityDay === value
                            ? "bg-orange-500 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Times</p>
                  <div className="flex gap-2">
                    {AVAILABLE_HOUR_OPTIONS.map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => toggleAvailabilityTime(value)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          tempData.availabilityTime === value
                            ? "bg-red-500 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </InfoSection>

          {/* Experiences */}
          <InfoSection
            icon={<Briefcase size={18} className="text-indigo-600" />}
            iconClassName="bg-gradient-to-br from-indigo-100 to-blue-100"
            title="Experiences"
            subtitle="Your work experience and background"
          >
            <div className="space-y-3">
              {tempData.experiences.map((exp, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-lg relative group">
                  <button
                    onClick={() => editExperience(index, tempData.experiences[index])}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm"
                  >
                    <Edit3 size={14} className="text-slate-600" />
                  </button>
                  <h4 className="font-medium text-slate-900">{exp.title}</h4>
                  <p className="text-sm text-slate-600">{exp.company}</p>
                  <p className="text-xs text-slate-500">{exp.duration}</p>
                  {exp.description && (
                    <p className="text-xs text-slate-500 mt-2">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={addExperience}
              className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 touch-manipulation"
            >
              <Plus size={16} />
              Add Experience
            </button>
          </InfoSection>

          {/* English Proficiency */}
          <InfoSection
            icon={<Globe size={18} className="text-teal-600" />}
            iconClassName="bg-gradient-to-br from-teal-100 to-cyan-100"
            title="English Proficiency"
            subtitle="Your English language skill level"
            onEdit={() => handleEditSection("languages")}
            isEditing={isEditing.languages}
            onSave={() => handleOptionsSave("languages")}
            onCancel={() => handleCancelSection("languages")}
          >
            {!isEditing.languages ? (
              <span className="px-3 py-1.5 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                {tempData.englishLevel}
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

        {/* 5. My Activity */}
        <div className="space-y-4 sm:space-y-5">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 px-1">My Activity</h3>
          <div className="space-y-3 sm:space-y-4">
            {myActivity.map((item) => {
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

      {/* Profile Edit Dialog */}
      <BaseDialog
        open={showProfileDialog}
        onClose={handleCloseProfileDialog}
        title="Edit Basic Information"
        size="md"
        type="bottomSheet"
      >
        <div className="space-y-4 mb-4">
          <div className="space-y-3">
            <Input
              label="Name"
              value={tempData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange("name", e.target.value)
              }
            />

            <TextArea
              label="Description"
              value={tempData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleInputChange("description", e.target.value)
              }
              rows={3}
            />
          </div>
        </div>

        <Button onClick={handleProfileSave} size="lg" className="w-full">
          Save Changes
        </Button>
      </BaseDialog>

      {/* Profile Image Dialog */}
      <ImageUploadDialog
        open={showImageUploadDialog}
        onClose={() => setShowImageUploadDialog(false)}
        onSave={handleProfileImageChange}
        title="Change Profile Image"
        currentImage={
          applicantProfile.profileImageUrl
            ? `${STORAGE_URLS.USER.PROFILE_IMG}${applicantProfile.profileImageUrl}`
            : "/images/img-default-profile.png"
        }
        type="profile"
      />

      {/* Experience Form Dialog */}
      <ExperienceFormDialog
        open={showExperienceDialog}
        onClose={() => setShowExperienceDialog(false)}
        experienceForm={experienceForm}
        setExperienceForm={setExperienceForm as any}
        onSave={() => saveExperience(tempData.experiences, () => {})}
        editingIndex={editingExperienceIndex}
        onJobTypeSelect={selectJobType}
      />

      {/* Job Types Dialog */}
      <JobTypesDialog
        title="Select Job Type"
        open={showJobTypesDialog}
        onClose={() => setShowJobTypesDialog(false)}
        selectedJobTypes={experienceForm.jobType ? [experienceForm.jobType as JobType] : []}
        onConfirm={confirmJobType}
        maxSelected={1}
      />

      {/* Preferred Job Types Dialog */}
      <JobTypesDialog
        title="Select Preferred Job Types"
        open={showPreferredJobTypesDialog}
        onClose={() => setShowPreferredJobTypesDialog(false)}
        selectedJobTypes={selectedJobTypes}
        onConfirm={handleJobTypesConfirm}
        maxSelected={5}
      />

      {/* Required Skills Dialog */}
      <RequiredSkillsDialog
        open={showSkillsDialog}
        onClose={handleSkillsCancel}
        selectedSkills={selectedSkills}
        skills={availableSkills}
        onConfirm={handleSkillsConfirm}
      />
    </div>
  );
}

export default SeekerMypage;
