"use client";
import React, { useState } from "react";
import {
  Briefcase,
  Heart,
  Calendar,
  Edit3,
  ChevronRight,
  Target,
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

function App() {
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showImageUploadDialog, setShowImageUploadDialog] = useState(false);
  const [isEditing, setIsEditing] = useState({
    basicInfo: false,
    contact: false,
    location: false,
    skills: false,
    workType: false,
    jobTypes: false,
    availability: false,
    languages: false,
  });

  // 기존 데이터
  const [applicantProfile, setApplicantProfile] = useState({
    name: "Sarah Johnson",
    description:
      "Crafting meaningful digital experiences that connect people and solve real problems",
    profileImageUrl: "",
    joinDate: "March 2024",
    location: "San Francisco, CA",
    phone: "+1 (555) 123-4567",
    skills: ["UI/UX Design", "Figma", "Prototyping", "User Research"],
    workType: "Remote",
    jobTypes: ["Full-time", "Contract"],
    availabilityDays: ["Weekdays"],
    availabilityTimes: ["AM", "PM"],
    languages: [
      { language: "English", level: "Fluent" },
      { language: "Spanish", level: "Intermediate" },
    ],
    experiences: [
      {
        title: "Senior Product Designer",
        company: "TechFlow Solutions",
        duration: "2022 - Present",
      },
      {
        title: "UI Designer",
        company: "Creative Studio",
        duration: "2020 - 2022",
      },
    ],
  });

  // 임시 데이터
  const [tempData, setTempData] = useState(applicantProfile);

  // Job Preferences 관련 상태
  const [newSkill, setNewSkill] = useState("");
  const [newJobType, setNewJobType] = useState("");
  const [newLanguage, setNewLanguage] = useState({ language: "", level: "Intermediate" });

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

  // 수정 모드 진입 시 현재 데이터로 임시 상태 초기화
  const handleEdit = (section: string) => {
    setTempData(applicantProfile);
    setIsEditing((prev) => ({ ...prev, [section]: true }));
  };

  // 취소 시 임시 데이터를 원래 상태로 되돌리기
  const handleCancel = (section: string) => {
    setTempData(applicantProfile);
    setIsEditing((prev) => ({ ...prev, [section]: false }));
  };

  // update basic info
  const handleBasicInfoSave = () => {
    setApplicantProfile(tempData);
    setIsEditing((prev) => ({ ...prev, basicInfo: false }));
  };

  // update contact, location
  const handleOptionsSave = (section: string) => {
    setApplicantProfile(tempData);
    setIsEditing((prev) => ({ ...prev, [section]: false }));
  };

  // update field
  const handleTempInputChange = (field: string, value: string) => {
    setTempData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfileEdit = () => {
    setTempData(applicantProfile);
    setShowProfileDialog(true);
  };

  const handleCloseProfileDialog = () => {
    setShowProfileDialog(false);
  };

  const handleProfileSave = () => {
    setApplicantProfile(tempData);
    console.log("Saving basic information:", tempData);
    handleCloseProfileDialog();
  };

  const handleProfileImageChange = (file: File) => {
    console.log("Profile image changed to:", file);
    try {
      // 파일을 읽어서 이미지 URL로 변환
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        // 프로필 이미지 상태 업데이트
        setApplicantProfile((prev) => ({
          ...prev,
          profileImageUrl: imageUrl,
        }));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error updating profile image:", error);
    }
  };

  const handleImageUploadDialog = () => {
    setShowImageUploadDialog(true);
  };

  // Job Preferences 관련 함수들
  const addSkill = () => {
    if (newSkill.trim()) {
      setTempData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setTempData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const addJobType = () => {
    if (newJobType.trim()) {
      setTempData((prev) => ({
        ...prev,
        jobTypes: [...prev.jobTypes, newJobType.trim()],
      }));
      setNewJobType("");
    }
  };

  const removeJobType = (index: number) => {
    setTempData((prev) => ({
      ...prev,
      jobTypes: prev.jobTypes.filter((_, i) => i !== index),
    }));
  };

  const toggleAvailabilityDay = (day: string) => {
    setTempData((prev) => ({
      ...prev,
      availabilityDays: prev.availabilityDays.includes(day)
        ? prev.availabilityDays.filter((d) => d !== day)
        : [...prev.availabilityDays, day],
    }));
  };

  const toggleAvailabilityTime = (time: string) => {
    setTempData((prev) => ({
      ...prev,
      availabilityTimes: prev.availabilityTimes.includes(time)
        ? prev.availabilityTimes.filter((t) => t !== time)
        : [...prev.availabilityTimes, time],
    }));
  };

  const addLanguage = () => {
    if (newLanguage.language.trim()) {
      setTempData((prev) => ({
        ...prev,
        languages: [...prev.languages, { ...newLanguage, language: newLanguage.language.trim() }],
      }));
      setNewLanguage({ language: "", level: "Intermediate" });
    }
  };

  const removeLanguage = (index: number) => {
    setTempData((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }));
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
                    src={applicantProfile.profileImageUrl || "/images/img-default-profile.png"}
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
            onEdit={() => handleEdit("contact")}
            isEditing={isEditing.contact}
            onSave={() => handleOptionsSave("contact")}
            onCancel={() => handleCancel("contact")}
          >
            {isEditing.contact ? (
              <Input
                label="Phone Number"
                type="tel"
                value={tempData.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleTempInputChange("phone", e.target.value)
                }
                placeholder="+1 (555) 123-4567"
                rightIcon={<Phone className="w-5 h-5" />}
              />
            ) : (
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-slate-400" />
                <span className="text-slate-700 font-medium">{applicantProfile.phone}</span>
              </div>
            )}
          </InfoSection>

          <InfoSection
            iconClassName="bg-gradient-to-br from-purple-100 to-pink-100"
            icon={<MapPin size={18} className="text-purple-600" />}
            title="Location"
            subtitle="Your current location"
            onEdit={() => handleEdit("location")}
            isEditing={isEditing.location}
            onSave={() => handleOptionsSave("location")}
            onCancel={() => handleCancel("location")}
          >
            {isEditing.location ? (
              <Input
                label="Location"
                value={tempData.location}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleTempInputChange("location", e.target.value)
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
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-white/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                  <Star size={18} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Skills</h3>
                  <p className="text-sm text-slate-500">Your professional skills and expertise</p>
                </div>
              </div>
              {!isEditing.skills && (
                <button
                  onClick={() => handleEdit("skills")}
                  className="p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-200 touch-manipulation"
                >
                  <Edit3 size={16} className="text-slate-600" />
                </button>
              )}
            </div>

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
                <div className="flex gap-3">
                  <button
                    onClick={() => handleOptionsSave("skills")}
                    className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl shadow-indigo-500/25 touch-manipulation active:scale-[0.98]"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => handleCancel("skills")}
                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-semibold rounded-xl transition-all duration-200 touch-manipulation active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Work Type */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-white/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                  <Globe size={18} className="text-green-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Work Type</h3>
                  <p className="text-sm text-slate-500">Remote, on-site, or hybrid preference</p>
                </div>
              </div>
              {!isEditing.workType && (
                <button
                  onClick={() => handleEdit("workType")}
                  className="p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-200 touch-manipulation"
                >
                  <Edit3 size={16} className="text-slate-600" />
                </button>
              )}
            </div>

            {!isEditing.workType ? (
              <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                {tempData.workType}
              </span>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-2">
                  {["Remote", "On-site", "Hybrid"].map((type) => (
                    <button
                      key={type}
                      onClick={() => handleTempInputChange("workType", type)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        tempData.workType === type
                          ? "bg-green-500 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleOptionsSave("workType")}
                    className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl shadow-indigo-500/25 touch-manipulation active:scale-[0.98]"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => handleCancel("workType")}
                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-semibold rounded-xl transition-all duration-200 touch-manipulation active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Preferred Job Types */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-white/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                  <Briefcase size={18} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Preferred Job Types</h3>
                  <p className="text-sm text-slate-500">Types of roles you're interested in</p>
                </div>
              </div>
              {!isEditing.jobTypes && (
                <button
                  onClick={() => handleEdit("jobTypes")}
                  className="p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-200 touch-manipulation"
                >
                  <Edit3 size={16} className="text-slate-600" />
                </button>
              )}
            </div>

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
                <div className="flex gap-3">
                  <button
                    onClick={() => handleOptionsSave("jobTypes")}
                    className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl shadow-indigo-500/25 touch-manipulation active:scale-[0.98]"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => handleCancel("jobTypes")}
                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-semibold rounded-xl transition-all duration-200 touch-manipulation active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-white/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center">
                  <Calendar size={18} className="text-orange-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Availability</h3>
                  <p className="text-sm text-slate-500">When you're available to work</p>
                </div>
              </div>
              {!isEditing.availability && (
                <button
                  onClick={() => handleEdit("availability")}
                  className="p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-200 touch-manipulation"
                >
                  <Edit3 size={16} className="text-slate-600" />
                </button>
              )}
            </div>

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
                    {["Weekdays", "Weekends"].map((day) => (
                      <button
                        key={day}
                        onClick={() => toggleAvailabilityDay(day)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          tempData.availabilityDays.includes(day)
                            ? "bg-orange-500 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Times</p>
                  <div className="flex gap-2">
                    {["AM", "PM"].map((time) => (
                      <button
                        key={time}
                        onClick={() => toggleAvailabilityTime(time)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          tempData.availabilityTimes.includes(time)
                            ? "bg-red-500 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleOptionsSave("availability")}
                    className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl shadow-indigo-500/25 touch-manipulation active:scale-[0.98]"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => handleCancel("availability")}
                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-semibold rounded-xl transition-all duration-200 touch-manipulation active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Experiences */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-white/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center">
                  <Briefcase size={18} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Experiences</h3>
                  <p className="text-sm text-slate-500">Your work experience and background</p>
                </div>
              </div>
              <button className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 touch-manipulation">
                <Plus size={16} />
                Add Experience
              </button>
            </div>

            <div className="space-y-3">
              {tempData.experiences.map((exp, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-medium text-slate-900">{exp.title}</h4>
                  <p className="text-sm text-slate-600">{exp.company}</p>
                  <p className="text-xs text-slate-500">{exp.duration}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Language Proficiency */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-white/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-xl flex items-center justify-center">
                  <Globe size={18} className="text-teal-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Language Proficiency</h3>
                  <p className="text-sm text-slate-500">Languages you speak and your skill level</p>
                </div>
              </div>
              {!isEditing.languages && (
                <button
                  onClick={() => handleEdit("languages")}
                  className="p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-200 touch-manipulation"
                >
                  <Edit3 size={16} className="text-slate-600" />
                </button>
              )}
            </div>

            {!isEditing.languages ? (
              <div className="space-y-2">
                {tempData.languages.map((lang, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <span className="font-medium text-slate-900">{lang.language}</span>
                    <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                      {lang.level}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  {tempData.languages.map((lang, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <span className="font-medium text-slate-900">{lang.language}</span>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                          {lang.level}
                        </span>
                        <button
                          onClick={() => removeLanguage(index)}
                          className="hover:bg-slate-200 rounded-full p-1"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newLanguage.language}
                    onChange={(e) =>
                      setNewLanguage((prev) => ({ ...prev, language: e.target.value }))
                    }
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Language..."
                  />
                  <select
                    value={newLanguage.level}
                    onChange={(e) => setNewLanguage((prev) => ({ ...prev, level: e.target.value }))}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Fluent">Fluent</option>
                  </select>
                  <button
                    onClick={addLanguage}
                    className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleOptionsSave("languages")}
                    className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl shadow-indigo-500/25 touch-manipulation active:scale-[0.98]"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => handleCancel("languages")}
                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-semibold rounded-xl transition-all duration-200 touch-manipulation active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
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
                handleTempInputChange("name", e.target.value)
              }
            />

            <TextArea
              label="Description"
              value={tempData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleTempInputChange("description", e.target.value)
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
        currentImage={applicantProfile.profileImageUrl}
        type="profile"
      />
    </div>
  );
}

export default App;
