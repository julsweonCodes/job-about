"use client";
import React, { useState } from "react";
import { User, MapPin, Clock, Briefcase, Languages, FileText, Pencil, Trash2 } from "lucide-react";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import { Chip } from "@/components/ui/Chip";
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
import { LanguageLevel, WorkType, LANGUAGE_LEVELS, WORK_TYPES } from "@/constants/enums";
import ExperienceFormDialog from "@/components/seeker/ExperienceFormDialog";
import JobTypesDialog from "@/app/employer/components/JobTypesDialog";
import { FormSection } from "@/components/common/FormSection";

interface JobSeekerFormData {
  skills: string[];
  currentSkillInput: string;
  workType: WorkType | null;
  preferredJobTypes: string[];
  currentJobTypeInput: string;
  availability: {
    days: {
      weekdays: boolean;
      weekends: boolean;
    };
    time: {
      am: boolean;
      pm: boolean;
    };
  };
  location: string;
  experiences: ExperienceForm[];
  currentExperienceInput: string;
  languageProficiency: LanguageLevel | null;
  selfIntroduction: string;
}

interface ExperienceForm {
  company: string;
  jobType: string;
  startYear: string;
  workedPeriod: string;
  description: string;
}

// ExperienceCard
type ExperienceCardProps = {
  experience: ExperienceForm;
  onEdit: () => void;
  onDelete: () => void;
};

function ExperienceCard({ experience, onEdit, onDelete }: ExperienceCardProps) {
  return (
    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow">
      <div>
        <Typography as="div" className="font-bold text-gray-800 text-base mb-1">
          {experience.company}
        </Typography>
        <Typography as="div" className="text-gray-500 text-sm">
          {experience.startYear}, {experience.workedPeriod}
        </Typography>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <button
          type="button"
          className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-indigo-500 transition-colors"
          onClick={onEdit}
          aria-label="Edit"
        >
          <Pencil className="w-5 h-5" />
        </button>
        <button
          type="button"
          className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-rose-500 transition-colors"
          onClick={onDelete}
          aria-label="Delete"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function JobSeekerProfile() {
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [showJobTypesDialog, setShowJobTypesDialog] = useState(false);
  const [formData, setFormData] = useState<JobSeekerFormData>({
    skills: [],
    currentSkillInput: "",
    workType: null,
    preferredJobTypes: [],
    currentJobTypeInput: "",
    availability: {
      days: {
        weekdays: false,
        weekends: false,
      },
      time: {
        am: false,
        pm: false,
      },
    },
    location: "",
    experiences: [],
    currentExperienceInput: "",
    languageProficiency: null,
    selfIntroduction: "",
  });

  const [workExperiences, setWorkExperiences] = useState<ExperienceForm[]>([]);

  const [experienceForm, setExperienceForm] = useState<ExperienceForm>({
    company: "",
    jobType: "",
    startYear: new Date().getFullYear().toString(),
    workedPeriod: workedPeriodOptions[0],
    description: "",
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Select 옵션 배열 선언 (컴포넌트 함수 바깥, 파일 import 바로 아래)
  const years = Array.from({ length: 50 }, (_, i) => (new Date().getFullYear() - i).toString());

  const handleInputChange = (field: keyof JobSeekerFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleExperienceFormClose = () => {
    setShowExperienceForm(false);
    setEditingIndex(null);
    document.body.style.overflow = "";
  };

  const handleJobTypesDialogOpen = () => {
    setShowJobTypesDialog(true);
    // ExperienceFormDialog가 열려있으므로 스크롤은 이미 잠겨있음
  };

  const handleJobTypesDialogClose = () => {
    setShowJobTypesDialog(false);
    // ExperienceFormDialog가 여전히 열려있다면 스크롤 잠금 유지
    if (showExperienceForm) {
      document.body.style.overflow = "hidden";
    }
  };

  const handleAddExperience = () => {
    if (editingIndex === null) {
      // 새로 추가
      setWorkExperiences([...workExperiences, experienceForm]);
    } else {
      // 수정
      setWorkExperiences((prev) =>
        prev.map((exp, idx) => (idx === editingIndex ? experienceForm : exp))
      );
    }
    setExperienceForm({
      company: "",
      jobType: "",
      startYear: new Date().getFullYear().toString(),
      workedPeriod: workedPeriodOptions[0],
      description: "",
    });
    setShowExperienceForm(false);
    setEditingIndex(null);
  };

  const addSkill = () => {
    if (
      formData.currentSkillInput.trim() &&
      !formData.skills.includes(formData.currentSkillInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, prev.currentSkillInput.trim()],
        currentSkillInput: "",
      }));
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const addJobType = () => {
    if (
      formData.currentJobTypeInput.trim() &&
      !formData.preferredJobTypes.includes(formData.currentJobTypeInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        preferredJobTypes: [...prev.preferredJobTypes, prev.currentJobTypeInput.trim()],
        currentJobTypeInput: "",
      }));
    }
  };

  const removeJobType = (jobTypeToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredJobTypes: prev.preferredJobTypes.filter((jobType) => jobType !== jobTypeToRemove),
    }));
  };

  const removeExperience = (index: number) => {
    setWorkExperiences((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAvailabilityChange = (category: "days" | "time", key: string) => {
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [category]: {
          ...prev.availability[category],
          [key]:
            !prev.availability[category][key as keyof (typeof prev.availability)[typeof category]],
        },
      },
    }));
  };

  const handleSubmit = () => {
    console.log("Job Seeker Profile submitted:", formData);
    // Handle form submission logic here
  };

  const workTypes = WORK_TYPES;
  const languageLevels = LANGUAGE_LEVELS;
  const cities = [
    "Toronto",
    "North York",
    "Scarborough",
    "Etobicoke",
    "Mississauga",
    "Brampton",
    "Vaughan",
    "Richmond Hill",
    "Markham",
    "Thornhill",
  ];

  // Calculate progress based on filled fields
  const calculateProgress = () => {
    let filledFields = 0;
    const totalFields = 7; // Required sections count

    if (formData.skills.length > 0) filledFields++;
    if (formData.workType && formData.preferredJobTypes.length > 0) filledFields++;
    if (
      Object.values(formData.availability.days).some(Boolean) &&
      Object.values(formData.availability.time).some(Boolean)
    )
      filledFields++;
    if (formData.location.trim()) filledFields++;
    if (formData.experiences.length > 0) filledFields++;
    if (formData.languageProficiency) filledFields++;
    if (formData.selfIntroduction.trim()) filledFields++;

    return Math.round((filledFields / totalFields) * 100);
  };

  const progress = calculateProgress();

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
              <div className="flex gap-2">
                <Input
                  value={formData.currentSkillInput}
                  onChange={(e) => handleInputChange("currentSkillInput", e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSkill()}
                  placeholder="e.g., communication"
                  className="flex-1"
                />
              </div>

              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <Chip key={index} selected onClick={() => removeSkill(skill)}>
                      {skill} <span className="ml-1">×</span>
                    </Chip>
                  ))}
                </div>
              )}
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
                    <Button
                      key={type}
                      onClick={() =>
                        handleInputChange("workType", formData.workType === type ? null : type)
                      }
                      className={`px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 border-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0 ${
                        formData.workType === type
                          ? "bg-gradient-to-r from-green-500 to-green-600 text-white border-green-500 shadow-lg shadow-green-200"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      {type}
                    </Button>
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
                    type="text"
                    value={formData.currentJobTypeInput}
                    onChange={(e) => handleInputChange("currentJobTypeInput", e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addJobType()}
                    placeholder="e.g., Serving, Hotel Manager"
                    className="flex-1"
                  />
                </div>

                {formData.preferredJobTypes.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.preferredJobTypes.map((jobType, index) => (
                      <Chip key={index} selected onClick={() => removeJobType(jobType)}>
                        {jobType} <span className="ml-1">×</span>
                      </Chip>
                    ))}
                  </div>
                )}
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
              {/* Days */}
              <div>
                <Typography
                  as="label"
                  variant="bodySm"
                  className="block font-semibold text-gray-800 mb-3"
                >
                  Days
                </Typography>
                <div className="flex gap-3">
                  {[
                    { key: "weekdays", label: "Weekdays" },
                    { key: "weekends", label: "Weekends" },
                  ].map(({ key, label }) => (
                    <Button
                      key={key}
                      onClick={() => handleAvailabilityChange("days", key)}
                      className={`flex-1 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 border-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0 ${
                        formData.availability.days[key as keyof typeof formData.availability.days]
                          ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-500 shadow-lg shadow-orange-200"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Time */}
              <div>
                <Typography
                  as="label"
                  variant="bodySm"
                  className="block font-semibold text-gray-800 mb-3"
                >
                  Time
                </Typography>
                <div className="flex gap-3">
                  {[
                    { key: "am", label: "AM" },
                    { key: "pm", label: "PM" },
                  ].map(({ key, label }) => (
                    <Button
                      key={key}
                      onClick={() => handleAvailabilityChange("time", key)}
                      className={`flex-1 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 border-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0 ${
                        formData.availability.time[key as keyof typeof formData.availability.time]
                          ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-500 shadow-lg shadow-orange-200"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      {label}
                    </Button>
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
                  {cities.map((city) => (
                    <SelectItem key={city} value={city} selectedValue={formData.location}>
                      {city}
                    </SelectItem>
                  ))}
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
                  onClick={() => setShowExperienceForm(true)}
                />
              </div>

              {workExperiences.length > 0 && (
                <div className="space-y-3">
                  {workExperiences.map((experience, index) => (
                    <ExperienceCard
                      key={index}
                      experience={experience}
                      onEdit={() => {
                        setEditingIndex(index);
                        setExperienceForm(experience);
                        setShowExperienceForm(true);
                      }}
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
                <Chip
                  key={level}
                  size="lg"
                  onClick={() =>
                    handleInputChange(
                      "languageProficiency",
                      formData.languageProficiency === level ? null : level
                    )
                  }
                  className={`px-2 w-full sm:py-6 rounded-2xl font-semibold text-sm sm:text-base transition-all duration-300 border-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0 ${
                    formData.languageProficiency === level
                      ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white border-teal-500 shadow-lg shadow-teal-200"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  {level}
                </Chip>
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
            open={showExperienceForm}
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
            onJobTypeSelect={handleJobTypesDialogOpen}
          />

          <JobTypesDialog
            title="Select Job Type"
            open={showJobTypesDialog}
            onClose={handleJobTypesDialogClose}
            selectedJobTypes={experienceForm.jobType ? [experienceForm.jobType as any] : []}
            onConfirm={(jobTypes) => {
              if (jobTypes.length > 0) {
                setExperienceForm((f) => ({ ...f, jobType: jobTypes[0] }));
              }
              handleJobTypesDialogClose();
            }}
            maxSelected={1}
          />
        </div>
      </div>
    </div>
  );
}

export default JobSeekerProfile;
