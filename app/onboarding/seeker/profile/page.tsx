"use client";
import React, { useState } from "react";
import { User, MapPin, Clock, Briefcase, Languages, FileText } from "lucide-react";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import { FullWidthChip } from "@/components/ui/FullWidthChip";
import { Button } from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import ProgressHeader from "@/components/common/ProgressHeader";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/Select";
import { workedPeriodOptions } from "@/constants/options";
import { getJobTypeConfig } from "@/constants/jobTypes";
import { LANGUAGE_LEVELS, WORK_TYPES, AVAILABLE_DAYS, AVAILABLE_HOURS } from "@/constants/enums";
import { getLocationDisplayName } from "@/constants/location";
import ExperienceFormDialog from "@/components/seeker/ExperienceFormDialog";
import JobTypesDialog from "@/app/employer/components/JobTypesDialog";
import RequiredSkillsDialog from "@/app/employer/components/RequiredSkillsDialog";
import { FormSection } from "@/components/common/FormSection";
import LoadingScreen from "@/components/common/LoadingScreen";
import { useJobSeekerForm } from "@/hooks/useJobSeekerForm";
import { useDialogState } from "@/hooks/useDialogState";
import { ExperienceCard } from "@/components/seeker/ExperienceCard";

function JobSeekerProfile() {
  // 커스텀 훅 사용
  const {
    formData,
    workExperiences,
    availableSkills,
    cities,
    isLoading,
    updateFormData,
    addExperience,
    updateExperience,
    removeExperience,
    calculateProgress,
  } = useJobSeekerForm();

  // 다이얼로그 상태 관리
  const experienceFormDialog = useDialogState();
  const jobTypesDialog = useDialogState();
  const experienceJobTypesDialog = useDialogState();
  const skillsDialog = useDialogState();

  // 경험 폼 상태
  const [experienceForm, setExperienceForm] = useState({
    company: "",
    jobType: "",
    startYear: new Date().getFullYear().toString(),
    workedPeriod: workedPeriodOptions[0],
    description: "",
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Select 옵션 배열
  const years = Array.from({ length: 50 }, (_, i) => (new Date().getFullYear() - i).toString());

  // 이벤트 핸들러들
  const handleInputChange = (field: string, value: any) => {
    updateFormData(field as any, value);
  };

  const handleExperienceFormClose = () => {
    experienceFormDialog.close();
    setEditingIndex(null);
    setExperienceForm({
      company: "",
      jobType: "",
      startYear: new Date().getFullYear().toString(),
      workedPeriod: workedPeriodOptions[0],
      description: "",
    });
  };

  const handleAddExperience = () => {
    if (experienceForm.company.trim() && experienceForm.jobType.trim()) {
      if (editingIndex !== null) {
        updateExperience(editingIndex, experienceForm);
      } else {
        addExperience(experienceForm);
      }
      handleExperienceFormClose();
    }
  };

  const handleEditExperience = (index: number) => {
    setEditingIndex(index);
    setExperienceForm(workExperiences[index]);
    experienceFormDialog.open();
  };

  const handleSubmit = () => {
    console.log("Job Seeker Profile submitted:", formData);
    console.log("Work experiences:", workExperiences);
  };

  const workTypes = WORK_TYPES;
  const languageLevels = LANGUAGE_LEVELS;
  const progress = calculateProgress();

  // 로딩 중일 때 LoadingScreen 표시
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
      {/* Sticky Progress Bar */}
      <ProgressHeader completionPercentage={progress} title="Profile Setup" />

      {/* Main Content */}
      <div className="py-8 px-5">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Typography variant="headlineLg" as="h1" className="mb-4 tracking-tight">
              Create Job Seeker Profile
            </Typography>
            <Typography
              variant="bodyMd"
              as="p"
              className="text-gray-600 lg:text-lg font-medium max-w-2xl mx-auto leading-relaxed"
            >
              Build your profile to connect with
              <br /> the right employers and opportunities
            </Typography>
          </div>

          {/* Skills Section */}
          <FormSection
            icon={<User />}
            title="Skills"
            description="Add your key skills and competencies"
            iconColor="blue"
          >
            <div className="space-y-4">
              <div>
                <Input
                  readOnly
                  label="Skills"
                  required
                  placeholder="Select Skills"
                  className="cursor-pointer"
                  value={formData.skills.map((skill) => skill.name_en).join(", ")}
                  onClick={() => skillsDialog.open()}
                />
              </div>
            </div>
          </FormSection>

          {/* Job Preferences Section */}
          <FormSection
            icon={<Briefcase />}
            title="Job Preferences"
            description="Define your work preferences and job types"
            iconColor="green"
          >
            <div className="space-y-6">
              {/* Work Type */}
              <div>
                <Typography
                  as="label"
                  variant="bodySm"
                  className="block font-semibold text-gray-800 mb-3"
                >
                  Work Type
                </Typography>
                <div className="grid grid-cols-3 gap-2">
                  {workTypes.map((type) => (
                    <FullWidthChip
                      key={type}
                      selected={formData.workType === type}
                      onClick={() =>
                        handleInputChange("workType", formData.workType === type ? null : type)
                      }
                      color="green"
                    >
                      {type}
                    </FullWidthChip>
                  ))}
                </div>
              </div>

              {/* Preferred Job Types */}
              <div>
                <Typography
                  as="label"
                  variant="bodySm"
                  className="block font-semibold text-gray-800 mb-3"
                >
                  Preferred Job Types
                </Typography>
                <div className="flex gap-2 mb-3">
                  <Input
                    readOnly
                    type="text"
                    value={
                      formData.preferredJobTypes.length > 0
                        ? formData.preferredJobTypes
                            .map((jobType) => {
                              const config = getJobTypeConfig(jobType);
                              return config.name;
                            })
                            .join(", ")
                        : ""
                    }
                    placeholder="Select Job Types"
                    className="flex-1 cursor-pointer"
                    onClick={() => jobTypesDialog.open()}
                  />
                </div>
              </div>
            </div>
          </FormSection>

          {/* Availability Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl shadow-gray-200/40 border border-white/50 p-5 mb-6 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500">
            <div className="mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-orange-200">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <Typography variant="headlineMd" as="h2" className="mb-2 tracking-tight">
                Availability
              </Typography>
              <Typography variant="bodySm" as="p" className="text-gray-500 text-sm font-medium">
                When are you available to work?
              </Typography>
            </div>

            <div className="space-y-6">
              {/* Day */}
              <div>
                <Typography
                  as="label"
                  variant="bodySm"
                  className="block font-semibold text-gray-800 mb-3"
                >
                  Day
                </Typography>
                <div className="flex gap-3">
                  {AVAILABLE_DAYS.map(({ value, label }) => (
                    <FullWidthChip
                      key={value}
                      selected={formData.availability.day === value}
                      onClick={() =>
                        handleInputChange("availability", {
                          ...formData.availability,
                          day: formData.availability.day === value ? null : value,
                        })
                      }
                      color="orange"
                      className="flex-1"
                    >
                      {label}
                    </FullWidthChip>
                  ))}
                </div>
              </div>

              {/* Hour */}
              <div>
                <Typography
                  as="label"
                  variant="bodySm"
                  className="block font-semibold text-gray-800 mb-3"
                >
                  Hour
                </Typography>
                <div className="flex gap-3">
                  {AVAILABLE_HOURS.map(({ value, label }) => (
                    <FullWidthChip
                      key={value}
                      selected={formData.availability.hour === value}
                      onClick={() =>
                        handleInputChange("availability", {
                          ...formData.availability,
                          hour: formData.availability.hour === value ? null : value,
                        })
                      }
                      color="orange"
                      className="flex-1"
                    >
                      {label}
                    </FullWidthChip>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl shadow-gray-200/40 border border-white/50 p-5 mb-6 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500">
            <div className="mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-200">
                <MapPin className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <Typography variant="headlineMd" as="h2" className="mb-2 tracking-tight">
                Location
              </Typography>
              <Typography variant="bodySm" as="p" className="text-gray-500 text-sm font-medium">
                Select your preferred work location
              </Typography>
            </div>

            <div className="relative">
              <Select
                value={formData.location}
                onValueChange={(value) => handleInputChange("location", value)}
              >
                <SelectTrigger className="w-full px-4 py-4 rounded-2xl border border-gray-200/80 bg-gray-50/50 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 transition-all duration-300 outline-none text-gray-900 font-medium shadow-sm hover:shadow-md hover:border-gray-300 appearance-none">
                  <SelectValue placeholder="Select preferred city" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(cities) && cities.length > 0 ? (
                    cities.map((city) => {
                      const displayName = getLocationDisplayName(city);
                      return (
                        <SelectItem key={city} value={city} selectedValue={formData.location}>
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
          </div>

          {/* Experiences Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl shadow-gray-200/40 border border-white/50 p-5 mb-6 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500">
            <div className="mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
                <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <Typography variant="headlineMd" as="h2" className="mb-2 tracking-tight">
                Experiences
              </Typography>
              <Typography variant="bodySm" as="p" className="text-gray-500 text-sm font-medium">
                Add your previous work experiences
              </Typography>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  readOnly
                  type="text"
                  className="cursor-pointer hover:bg-gray-50 hover:border-gray-300"
                  placeholder="+ Add your experience"
                  onClick={() => experienceFormDialog.open()}
                />
              </div>

              {workExperiences.length > 0 && (
                <div className="space-y-3">
                  {workExperiences.map((experience, index) => (
                    <ExperienceCard
                      key={index}
                      experience={experience}
                      onEdit={() => handleEditExperience(index)}
                      onDelete={() => removeExperience(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Language Proficiency Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl shadow-gray-200/40 border border-white/50 p-5 mb-6 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500">
            <div className="mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-teal-200">
                <Languages className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <Typography variant="headlineMd" as="h2" className="mb-2 tracking-tight">
                Language Proficiency
              </Typography>
              <Typography variant="bodySm" as="p" className="text-gray-500 text-sm font-medium">
                Select your language skill level
              </Typography>
            </div>

            <div className="flex gap-2 sm:grid sm:grid-cols-3">
              {languageLevels.map((level) => (
                <FullWidthChip
                  key={level}
                  selected={formData.languageProficiency === level}
                  onClick={() =>
                    handleInputChange(
                      "languageProficiency",
                      formData.languageProficiency === level ? null : level
                    )
                  }
                  color="teal"
                >
                  {level}
                </FullWidthChip>
              ))}
            </div>
          </div>

          {/* Self Introduction Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl shadow-gray-200/40 border border-white/50 p-5 mb-10 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500">
            <div className="mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-pink-200">
                <FileText className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <Typography variant="headlineMd" as="h2" className="mb-2 tracking-tight">
                Self Introduction
              </Typography>
              <Typography variant="bodySm" as="p" className="text-gray-500 text-sm font-medium">
                Tell employers about yourself and your experience
              </Typography>
            </div>

            <TextArea
              value={formData.selfIntroduction}
              onChange={(e) => handleInputChange("selfIntroduction", e.target.value)}
              placeholder="Description of your work experience, skills, and what makes you a great candidate..."
              rows={5}
              className="w-full"
            />
          </div>

          {/* 최종 제출 버튼 */}
          <Button
            onClick={handleSubmit}
            size="xl"
            className="w-full"
            disabled={progress < 100}
            variant="gradient"
          >
            Confirm Profile
          </Button>

          {/* Experience Form Dialog */}
          <ExperienceFormDialog
            open={experienceFormDialog.isOpen}
            onClose={handleExperienceFormClose}
            experienceForm={experienceForm}
            setExperienceForm={setExperienceForm}
            onSave={handleAddExperience}
            editingIndex={editingIndex}
            years={years.map((year) => ({ value: year, label: year }))}
            workedPeriodOptions={workedPeriodOptions.map((period) => ({
              value: period,
              label: period,
            }))}
            onJobTypeSelect={() => experienceJobTypesDialog.open()}
          />

          <JobTypesDialog
            title="Select Job Type"
            open={experienceJobTypesDialog.isOpen}
            onClose={experienceJobTypesDialog.close}
            selectedJobTypes={experienceForm.jobType ? [experienceForm.jobType as any] : []}
            onConfirm={(jobTypes) => {
              if (jobTypes.length > 0) {
                setExperienceForm((f) => ({ ...f, jobType: jobTypes[0] }));
              }
              experienceJobTypesDialog.close();
            }}
            maxSelected={1}
          />

          <RequiredSkillsDialog
            open={skillsDialog.isOpen}
            onClose={skillsDialog.close}
            selectedSkills={formData.skills}
            onConfirm={(skills) => {
              handleInputChange("skills", skills);
              skillsDialog.close();
            }}
            skills={availableSkills}
          />

          <JobTypesDialog
            title="Select Job Types"
            open={jobTypesDialog.isOpen}
            onClose={jobTypesDialog.close}
            selectedJobTypes={formData.preferredJobTypes}
            onConfirm={(jobTypes) => {
              handleInputChange("preferredJobTypes", jobTypes);
              jobTypesDialog.close();
            }}
            maxSelected={3}
          />
        </div>
      </div>
    </div>
  );
}

export default JobSeekerProfile;
