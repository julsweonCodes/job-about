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
import { LanguageLevel, AVAILABLE_DAYS, AVAILABLE_HOURS, WORK_TYPES } from "@/constants/enums";
import LoadingScreen from "@/components/common/LoadingScreen";
import { JobType } from "@/constants/jobTypes";
import ExperienceFormDialog from "@/components/seeker/ExperienceFormDialog";
import JobTypesDialog from "@/components/common/JobTypesDialog";
import { useSeekerMypage } from "@/hooks/useSeekerMypage";
import { useExperienceManagement } from "@/hooks/useExperienceManagement";
import { applicantProfile } from "@/types/profile";
import { API_URLS } from "@/constants/api";
import {
  toPrismaWorkType,
  toPrismaJobType,
  toPrismaLanguageLevel,
  toPrismaAvailableDay,
  toPrismaAvailableHour,
} from "@/types/enumMapper";

function SeekerMypage() {
  // 커스텀 훅 사용 (최상단에서 호출)
  const {
    applicantProfile,
    tempData,
    isLoading,
    isEditing,
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
  } = useExperienceManagement();

  // 모든 useState 훅을 조건문 이전에 호출
  const [newSkill, setNewSkill] = useState("");
  const [newJobType, setNewJobType] = useState("");
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showImageUploadDialog, setShowImageUploadDialog] = useState(false);

  // 로딩 상태 체크 (훅 호출 이후에 위치)
  if (isLoading || !applicantProfile || !tempData) {
    return <LoadingScreen message="Loading your profile..." />;
  }

  // TODO call api to get workStyle
  const workStyle = {
    type: "Empathetic Coordinator",
    description:
      "You thrive in collaborative, people-oriented roles where communication and teamwork drive success.",
    emoji: "🤝",
    traits: ["#Empathy", "#Customer-Focused", "#Positive Attitude", "#Team Player"],
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

  // update contact, location
  const handleOptionsSave = async (section: string) => {
    let payload: Partial<applicantProfile> = {};

    console.log("Section:", section);
    console.log("tempData:", tempData);

    switch (section) {
      case "location":
        console.log("Location case - tempData.location:", tempData.location);
        payload = {
          location: tempData.location as any,
        };
        break;
      case "skills":
        payload = {};
        break;
      case "workType":
        console.log("WorkType case - tempData.workType:", tempData.workType);
        payload = {
          work_type: toPrismaWorkType(tempData.workType as any),
        };
        break;
      case "jobTypes":
        console.log("JobTypes case - tempData.jobTypes:", tempData.jobTypes);
        payload = {
          job_type1: toPrismaJobType(tempData.jobTypes[0] as any),
          ...(tempData.jobTypes[1] && {
            job_type2: toPrismaJobType(tempData.jobTypes[1] as any),
          }),
          ...(tempData.jobTypes[2] && {
            job_type3: toPrismaJobType(tempData.jobTypes[2] as any),
          }),
        };
        break;

      case "availability":
        console.log("Availability case - tempData.availabilityDays:", tempData.availabilityDays);
        console.log("Availability case - tempData.availabilityTimes:", tempData.availabilityTimes);
        payload = {
          available_day: toPrismaAvailableDay(tempData.availabilityDays[0] as any),
          available_hour: toPrismaAvailableHour(tempData.availabilityTimes[0] as any),
        };
        break;
      case "languages":
        console.log("Languages case - tempData.englishLevel:", tempData.englishLevel);
        payload = {
          language_level: toPrismaLanguageLevel(tempData.englishLevel as any),
        };
        break;
      default:
        console.warn("Unknown section:", section);
        return;
    }

    console.log("Final payload:", payload);

    try {
      const response = await fetch(API_URLS.SEEKER.PROFILES, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        // 성공 처리
      }
    } catch (error) {
      console.error(`Failed to save ${section}:`, error);
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
      handleInputChange("skills", [...tempData.skills, newSkill.trim()] as any);
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    handleInputChange("skills", tempData.skills.filter((_, i) => i !== index) as any);
  };

  const addJobType = () => {
    if (newJobType.trim()) {
      handleInputChange("jobTypes", [...tempData.jobTypes, newJobType.trim()] as any);
      setNewJobType("");
    }
  };

  const removeJobType = (index: number) => {
    handleInputChange("jobTypes", tempData.jobTypes.filter((_, i) => i !== index) as any);
  };

  const toggleAvailabilityDay = (day: string) => {
    handleInputChange(
      "availabilityDays",
      tempData.availabilityDays.includes(day)
        ? (tempData.availabilityDays.filter((d) => d !== day) as any)
        : ([...tempData.availabilityDays, day] as any)
    );
  };

  const toggleAvailabilityTime = (time: string) => {
    handleInputChange(
      "availabilityTimes",
      tempData.availabilityTimes.includes(time)
        ? (tempData.availabilityTimes.filter((t) => t !== time) as any)
        : ([...tempData.availabilityTimes, time] as any)
    );
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
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden">
                  <img
                    src={
                      applicantProfile.profileImageUrl
                        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/job-about/user-photo/${applicantProfile.profileImageUrl}`
                        : "/images/img-default-profile.png"
                    }
                    alt={applicantProfile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={handleImageUploadDialog}
                  className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors duration-200"
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
                  {workStyle.emoji}
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-bold text-slate-900 mb-0">
                    {workStyle.type}
                  </h4>
                </div>
              </div>

              <div className="mb-5 sm:mb-6">
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {workStyle.description}
                </p>
              </div>

              {/* Traits */}
              <div className="mb-6 sm:mb-8">
                <h5 className="text-sm font-semibold text-slate-700 mb-3">Key Traits</h5>
                <div className="flex flex-wrap gap-2">
                  {workStyle.traits.map((trait, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gradient-to-r from-orange-50 to-pink-50 text-orange-700 text-xs sm:text-sm font-medium rounded-full border border-orange-100/50"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl shadow-purple-500/25 hover:shadow-purple-500/30 touch-manipulation active:scale-[0.98]">
                  <div className="flex items-center justify-center gap-2">
                    <Lightbulb size={16} className="sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">See Recommended Jobs</span>
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
              <Input
                label="Location"
                value={tempData.location}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("location", e.target.value)
                }
                placeholder="City, State"
                rightIcon={<MapPin className="w-5 h-5" />}
              />
            ) : (
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-slate-400" />
                <span className="text-slate-700 font-medium">{applicantProfile.location}</span>
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
            onEdit={() => handleEditSection("skills")}
            isEditing={isEditing.skills}
            onSave={() => handleOptionsSave("skills")}
            onCancel={() => handleCancelSection("skills")}
          >
            {!isEditing.skills ? (
              <div className="flex flex-wrap gap-2">
                {tempData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {tempData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(index)}
                        className="hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addSkill()}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Add a skill..."
                  />
                  <button
                    onClick={addSkill}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
                  >
                    <Plus size={16} />
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
            onEdit={() => handleEditSection("jobTypes")}
            isEditing={isEditing.jobTypes}
            onSave={() => handleOptionsSave("jobTypes")}
            onCancel={() => handleCancelSection("jobTypes")}
          >
            {!isEditing.jobTypes ? (
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
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {tempData.jobTypes.map((type, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium flex items-center gap-2"
                    >
                      {type}
                      <button
                        onClick={() => removeJobType(index)}
                        className="hover:bg-purple-200 rounded-full p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newJobType}
                    onChange={(e) => setNewJobType(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addJobType()}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Add a job type..."
                  />
                  <button
                    onClick={addJobType}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
                  >
                    <Plus size={16} />
                  </button>
                </div>
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
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {tempData.availabilityDays.map((day, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                    >
                      {day}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {tempData.availabilityTimes.map((time, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-medium"
                    >
                      {time}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Days</p>
                  <div className="flex gap-2">
                    {AVAILABLE_DAYS.map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => toggleAvailabilityDay(label)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          tempData.availabilityDays.includes(label)
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
                    {AVAILABLE_HOURS.map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => toggleAvailabilityTime(label)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          tempData.availabilityTimes.includes(label)
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
            ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/job-about/user-photo/${applicantProfile.profileImageUrl}`
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
    </div>
  );
}

export default SeekerMypage;
