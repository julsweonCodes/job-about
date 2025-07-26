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
import {
  WorkType,
  AvailableDay,
  AvailableHour,
  LanguageLevel,
  WORK_TYPES,
  LANGUAGE_LEVELS,
  AVAILABLE_DAYS,
  AVAILABLE_HOURS,
} from "@/constants/enums";
import { JobType } from "@/constants/jobTypes";
import { Location, getLocationDisplayName } from "@/constants/location";
import ExperienceFormDialog from "@/components/seeker/ExperienceFormDialog";
import JobTypesDialog from "@/components/common/JobTypesDialog";
import RequiredSkillsDialog from "@/app/employer/components/RequiredSkillsDialog";
import { FormSection } from "@/components/common/FormSection";
import LoadingScreen from "@/components/common/LoadingScreen";
import { useJobSeekerForm } from "@/hooks/useJobSeekerForm";
import { useDialogState } from "@/hooks/useDialogState";
import { ExperienceCard } from "@/components/seeker/ExperienceCard";
import { showErrorToast, showSuccessToast } from "@/utils/client/toastUtils";
import { API_URLS } from "@/constants/api";
import { ApplicantProfileMapper } from "@/types/profile";

interface LocalExperienceForm {
  company: string;
  jobType: string;
  startYear: string;
  workedPeriod: string;
  description: string;
}

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
  const [experienceForm, setExperienceForm] = useState<LocalExperienceForm>({
    company: "",
    jobType: "" as string,
    startYear: new Date().getFullYear().toString(),
    workedPeriod: workedPeriodOptions[0],
    description: "",
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      jobType: "" as string,
      startYear: new Date().getFullYear().toString(),
      workedPeriod: workedPeriodOptions[0],
      description: "",
    } as LocalExperienceForm);
  };

  const handleAddExperience = () => {
    if (experienceForm.company.trim() && experienceForm.jobType.trim()) {
      if (editingIndex !== null) {
        updateExperience(editingIndex, experienceForm as any);
      } else {
        addExperience(experienceForm as any);
      }
      handleExperienceFormClose();
    }
  };

  const handleEditExperience = (index: number) => {
    setEditingIndex(index);
    setExperienceForm(workExperiences[index] as any);
    experienceFormDialog.open();
  };

  const handleSubmit = async () => {
    if (isSubmitting) return; // 중복 제출 방지

    setIsSubmitting(true);
    try {
      // TODO
      // skill 추가 필요
      // work experience 수정 필요
      const profileData = ApplicantProfileMapper.toApi({
        preferredJobTypes: formData.preferredJobTypes.filter(Boolean),
        workType: formData.workType || WorkType.REMOTE,
        availableDay: [formData.availability.day || AvailableDay.WEEKDAYS],
        availableHour: [formData.availability.hour || AvailableHour.AM],
        location: formData.location || Location.TORONTO,
        englishLevel: formData.languageProficiency || LanguageLevel.BEGINNER,
        description: formData.selfIntroduction,
        experiences: workExperiences.map((exp) => ({
          company: exp.company,
          jobType: exp.jobType || JobType.SERVER,
          startDate: new Date(parseInt(exp.startYear), 0, 1), // 년도만 있으므로 1월 1일로 설정
          endDate: new Date(parseInt(exp.startYear) + parseInt(exp.workedPeriod), 0, 1),
          workType: (exp.jobType || WorkType.REMOTE) as any,
          description: exp.description,
        })),
      });

      const response = await fetch(API_URLS.SEEKER.PROFILES, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        showSuccessToast("Profile saved successfully!");
      } else {
        showErrorToast("Error saving profile");
      }
    } catch (error) {
      showErrorToast("Error submitting profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
      {/* Submit Loading Overlay */}
      {isSubmitting && (
        <LoadingScreen overlay={true} spinnerSize="lg" spinnerColor="purple" opacity="light" />
      )}

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
          <FormSection
            icon={<Clock />}
            title="Availability"
            description="When are you available to work?"
            iconColor="orange"
          >
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
          </FormSection>

          {/* Location Section */}
          <FormSection
            icon={<MapPin />}
            title="Location"
            description="Select your preferred work location"
            iconColor="purple"
          >
            <div className="relative">
              <Select
                value={formData.location || ""}
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
                        <SelectItem key={city} value={city} selectedValue={formData.location || ""}>
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
          </FormSection>

          {/* Experiences Section */}
          <FormSection
            icon={<Briefcase />}
            title="Experiences (Optional)"
            description="Add your previous work experiences"
            iconColor="indigo"
          >
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
                      experience={experience as any}
                      onEdit={() => handleEditExperience(index)}
                      onDelete={() => removeExperience(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          </FormSection>

          {/* Language Proficiency Section */}
          <FormSection
            icon={<Languages />}
            title="Language Proficiency"
            description="Select your language skill level"
            iconColor="teal"
          >
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
          </FormSection>

          {/* Self Introduction Section */}
          <FormSection
            icon={<FileText />}
            title="Self Introduction"
            description="Tell employers about yourself and your experience"
            iconColor="pink"
          >
            <TextArea
              value={formData.selfIntroduction}
              onChange={(e) => handleInputChange("selfIntroduction", e.target.value)}
              placeholder="Description of your work experience, skills, and what makes you a great candidate..."
              rows={5}
              className="w-full"
            />
          </FormSection>

          {/* 최종 제출 버튼 */}
          <Button
            onClick={handleSubmit}
            size="xl"
            className="w-full"
            disabled={progress < 100 || isSubmitting}
            variant="gradient"
          >
            {isSubmitting ? "Saving..." : "Confirm Profile"}
          </Button>

          {/* Experience Form Dialog */}
          <ExperienceFormDialog
            open={experienceFormDialog.isOpen}
            onClose={handleExperienceFormClose}
            experienceForm={experienceForm as any}
            setExperienceForm={setExperienceForm as any}
            onSave={handleAddExperience}
            editingIndex={editingIndex}
            onJobTypeSelect={() => experienceJobTypesDialog.open()}
          />

          <JobTypesDialog
            title="Select Job Type"
            open={experienceJobTypesDialog.isOpen}
            onClose={experienceJobTypesDialog.close}
            selectedJobTypes={experienceForm.jobType ? [experienceForm.jobType] : ([] as any)}
            onConfirm={(jobTypes) => {
              if (jobTypes.length > 0) {
                setExperienceForm((f) => ({ ...f, jobType: jobTypes[0] as any }));
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
