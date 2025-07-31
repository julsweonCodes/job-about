"use client";
import React from "react";
import { Briefcase, Calendar, Lightbulb, MapPin, Star, Globe, Plus } from "lucide-react";
import BackHeader from "@/components/common/BackHeader";
import InfoSection from "@/components/common/InfoSection";
import TextArea from "@/components/ui/TextArea";
import { LanguageLevel, WORK_TYPES } from "@/constants/enums";
import { AVAILABLE_DAY_OPTIONS, AVAILABLE_HOUR_OPTIONS } from "@/constants/options";
import LoadingScreen from "@/components/common/LoadingScreen";
import { JobType } from "@/constants/jobTypes";
import ExperienceFormDialog from "@/components/seeker/ExperienceFormDialog";
import { ExperienceCard } from "@/components/seeker/ExperienceCard";
import JobTypesDialog from "@/components/common/JobTypesDialog";
import RequiredSkillsDialog from "@/app/employer/components/RequiredSkillsDialog";
import { DeleteExperienceDialog } from "@/components/seeker/DeleteExperienceDialog";
import { useSeekerMypageProfile, DialogStates } from "@/hooks/seeker/profile";
import { useSeekerExperience } from "@/hooks/seeker/useSeekerExperience";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { getLocationDisplayName } from "@/constants/location";

import {
  getWorkTypeLabel,
  getAvailabilityDayLabel,
  getAvailabilityHourLabel,
  getLanguageLevelLabel,
  getJobTypeName,
} from "@/utils/client/enumDisplayUtils";

// 스켈레톤 컴포넌트들
const InfoSectionSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-white/50 overflow-hidden">
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse" />
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded animate-pulse w-32" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-48" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
      </div>
    </div>
  </div>
);

function SeekerProfilePage() {
  // Custom hooks
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
    setTempData,
    selectedSkills,
    selectedJobTypes,
    dialogStates,
    setDialogStates,
    handleOptionsSave,
    handleSkillsEdit,
    handleSkillsConfirm,
    handleSkillsCancel,
    handleJobTypesEdit,
    handleJobTypesConfirm,
    deleteExperience,
    confirmDeleteExperience,
    cancelDeleteExperience,
    hasExperiencesChanged,
  } = useSeekerMypageProfile();

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
  } = useSeekerExperience();

  if (isLoading || !applicantProfile || !tempData) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        {/* Loading Screen for API calls */}
        {(loadingStates.profileUpdate ||
          loadingStates.imageUpload ||
          loadingStates.skillsUpdate ||
          loadingStates.jobTypesUpdate ||
          loadingStates.experienceSave) && <LoadingScreen overlay={true} opacity="light" />}

        <BackHeader title="Profile Settings" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4 sm:space-y-5">
          <div className="space-y-4 sm:space-y-5">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 px-1">Profile Details</h3>
            {Array.from({ length: 7 }).map((_, index) => (
              <InfoSectionSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <BackHeader title="Profile Settings" />
      {/* Loading Screen for API calls */}
      {(loadingStates.profileUpdate ||
        loadingStates.imageUpload ||
        loadingStates.skillsUpdate ||
        loadingStates.jobTypesUpdate ||
        loadingStates.experienceSave) && <LoadingScreen overlay={true} opacity="light" />}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4 sm:space-y-5">
        {/* Profile Sections */}
        <div className="space-y-4 sm:space-y-5">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 px-1">Profile Details</h3>

          {/* Description */}
          <InfoSection
            icon={<Lightbulb size={18} className="text-amber-600" />}
            iconClassName="bg-gradient-to-br from-amber-100 to-orange-100"
            title="About Me"
            subtitle="Tell us about yourself and your experience"
            onEdit={() => handleEditSection("description")}
            isEditing={isEditing.description}
            onSave={() => handleOptionsSave("description")}
            onCancel={() => handleCancelSection("description")}
          >
            {!isEditing.description ? (
              <div className="text-slate-700">
                {tempData.description ? (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-sm leading-relaxed text-slate-700">{tempData.description}</p>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-200 rounded-xl p-4 text-center">
                    <Lightbulb size={24} className="text-slate-400 mx-auto mb-2" />
                    <span className="text-slate-500 text-sm">Share your story and experience</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <TextArea
                  value={tempData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Tell us about yourself, your experience, skills, and what you're looking for in your next opportunity..."
                  rows={6}
                  className="w-full resize-none"
                />
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <span>Share your background, skills, and career goals</span>
                </div>
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
            <div className="flex flex-wrap gap-2">
              {tempData.skillIds.length > 0 ? (
                tempData.skillIds.map((skillId, index) => {
                  const skill = availableSkills.find((s) => s.id === skillId);
                  return skill ? (
                    <span
                      key={`${skill.id}-${index}`}
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
            <div className="flex flex-wrap gap-2">
              {tempData.jobTypes.length > 0 ? (
                tempData.jobTypes.map((type, index) => (
                  <span
                    key={`${type}-${index}`}
                    className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                  >
                    {getJobTypeName(type)}
                  </span>
                ))
              ) : (
                <span className="text-slate-500 text-sm">No job types selected</span>
              )}
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
                        onClick={() => handleInputChange("availabilityDay", day.value)}
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
                        onClick={() => handleInputChange("availabilityTime", hour.value)}
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
                    onClick={() => handleInputChange("englishLevel", level)}
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
                onClick={() => handleOptionsSave("workExperience")}
                disabled={!hasExperiencesChanged()}
                className={`w-full sm:w-auto font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-200 touch-manipulation active:scale-[0.98] ${
                  hasExperiencesChanged()
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl shadow-purple-500/25 hover:shadow-purple-500/30"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <span className="text-sm sm:text-base">Save Changes</span>
              </button>
            </div>
          </InfoSection>
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
        onClose={() =>
          setDialogStates((prev: DialogStates) => ({ ...prev, preferredJobTypes: false }))
        }
        selectedJobTypes={selectedJobTypes}
        onConfirm={handleJobTypesConfirm}
        maxSelected={3}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteExperienceDialog
        open={dialogStates.deleteConfirm.isOpen}
        onClose={cancelDeleteExperience}
        onConfirm={confirmDeleteExperience}
        companyName={
          dialogStates.deleteConfirm.experienceIndex !== null
            ? tempData.experiences[dialogStates.deleteConfirm.experienceIndex]?.company || ""
            : ""
        }
      />
    </div>
  );
}

export default SeekerProfilePage;
