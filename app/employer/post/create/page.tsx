"use client";
import React from "react";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  User,
  FileText,
  Briefcase,
  Smile,
  Settings,
} from "lucide-react";
import PageProgressHeader from "@/components/common/PageProgressHeader";
import LoadingScreen from "@/components/common/LoadingScreen";
import Typography from "@/components/ui/Typography";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { FullWidthChip } from "@/components/ui/FullWidthChip";
import { LANGUAGE_LEVELS } from "@/constants/enums";
import { getJobTypeConfig } from "@/constants/jobTypes";
import DatePickerDialog from "@/app/employer/components/DatePickerDialog";
import PreferredPersonalityDialog from "@/app/employer/components/RequiredPersonalitiesDialog";
import RequiredSkillsDialog from "@/app/employer/components/RequiredSkillsDialog";
import JobTypesDialog from "@/components/common/JobTypesDialog";
import { capitalize } from "@/lib/utils";
import { WORK_TYPE_OPTIONS } from "@/constants/options";
import { FormSection } from "@/components/common/FormSection";
import { useEmployerJobPostCreate } from "@/hooks/employer/useEmployerJobPostCreate";

function JobPostCreatePage() {
  const {
    // Form Data
    formData,
    handleInputChange,

    // UI States
    tempDeadline,
    setTempDeadline,
    calendarOpen,
    setCalendarOpen,
    personalityDialogOpen,
    setPersonalityDialogOpen,
    skillsDialogOpen,
    setSkillsDialogOpen,
    jobTypesDialogOpen,
    setJobTypesDialogOpen,

    // Loading States
    isLoading,
    geminiResState,

    // Validation
    touched,
    setTouched,
    validateRequired,
    isFormValid,

    // Actions
    handleSubmit,
    handleBack,

    // Computed Values
    progress,
  } = useEmployerJobPostCreate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30">
      {isLoading && <LoadingScreen message="Generating job post..." />}
      {geminiResState && <LoadingScreen message="Generating AI-powered job description..." />}

      {/* Header */}
      <PageProgressHeader
        title="Generate a Job Post with AI"
        progress={progress}
        leftIcon={<ArrowLeft />}
        onClickLeft={handleBack}
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Job Title Section */}
          <FormSection
            icon={<Briefcase />}
            title="Job Title"
            description="Define the position title"
            iconColor="blue"
          >
            <Input
              value={formData.jobTitle}
              onChange={(e: any) => handleInputChange("jobTitle", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, jobTitle: true }))}
              placeholder="Enter Job Title"
              required
              error={
                touched.jobTitle ? validateRequired(formData.jobTitle, "Job title is required") : ""
              }
            />
          </FormSection>

          {/* Job Type Section */}
          <FormSection
            icon={<Settings />}
            title="Job Types"
            description="Select multiple job categories"
            iconColor="green"
          >
            <div className="space-y-6">
              {/* Work Type Selection */}
              <div>
                <Typography
                  as="label"
                  variant="bodySm"
                  className="block font-semibold text-gray-800 mb-3"
                >
                  Work Type
                </Typography>
                <div className="grid grid-cols-3 gap-2">
                  {WORK_TYPE_OPTIONS.map((option) => (
                    <FullWidthChip
                      key={option.value}
                      selected={formData.selectedWorkType === option.value}
                      onClick={() => {
                        handleInputChange("selectedWorkType", option.value);
                        setTouched((t) => ({ ...t, selectedWorkType: true }));
                      }}
                      color="green"
                    >
                      {option.label}
                    </FullWidthChip>
                  ))}
                </div>
                {touched.selectedWorkType && !formData.selectedWorkType && (
                  <p className="text-red-500 text-sm mt-1">Work type is required</p>
                )}
              </div>

              {/* Job Type Selection */}
              <div>
                <Typography
                  as="label"
                  variant="bodySm"
                  className="block font-semibold text-gray-800 mb-3"
                >
                  Job Type
                </Typography>
                <Input
                  readOnly
                  required
                  placeholder="Select Job Type"
                  className="cursor-pointer"
                  value={
                    formData.selectedJobType ? getJobTypeConfig(formData.selectedJobType).name : ""
                  }
                  onClick={() => setJobTypesDialogOpen(true)}
                  onBlur={() => setTouched((t) => ({ ...t, selectedJobType: true }))}
                  error={
                    touched.selectedJobType
                      ? validateRequired(
                          formData.selectedJobType ? "selected" : "",
                          "Job type is required"
                        )
                      : ""
                  }
                />
              </div>
            </div>
          </FormSection>

          {/* Schedule & Timing Section */}
          <FormSection
            icon={<Calendar />}
            title="Schedule & Timing"
            description="Set deadlines and work schedule"
            iconColor="orange"
          >
            <div className="space-y-4">
              {/* Deadline */}
              <div>
                <Input
                  readOnly
                  label="Deadline for applications"
                  required
                  placeholder="Select Date"
                  className="cursor-pointer"
                  value={
                    formData.deadline
                      ? new Date(formData.deadline).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : ""
                  }
                  onClick={() => setCalendarOpen(true)}
                  onBlur={() => setTouched((t) => ({ ...t, deadline: true }))}
                  error={
                    touched.deadline
                      ? validateRequired(
                          formData.deadline ? "selected" : "",
                          "Deadline is required"
                        )
                      : ""
                  }
                />
              </div>

              {/* Work Schedule */}
              <div>
                <div className="relative">
                  <Input
                    type="text"
                    label="Work Schedule"
                    value={formData.workSchedule}
                    onChange={(e: any) => handleInputChange("workSchedule", e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, workSchedule: true }))}
                    placeholder="Weekends only, 10am–2pm"
                    required
                    rightIcon={<Calendar className="w-5 h-5 text-gray-400" />}
                    error={
                      touched.workSchedule
                        ? validateRequired(formData.workSchedule, "Work schedule is required")
                        : ""
                    }
                  />
                </div>
              </div>
            </div>
          </FormSection>

          {/* Requirements Section */}
          <FormSection
            icon={<User />}
            title="Requirements"
            description="Define skills and personality traits"
            iconColor="purple"
          >
            <div className="space-y-4">
              {/* Required Skills */}
              <div>
                <Input
                  readOnly
                  label="Required Skills"
                  required
                  placeholder="Select Required Skills"
                  className="cursor-pointer"
                  value={formData.requiredSkills
                    .map((skill) =>
                      typeof skill === "string"
                        ? capitalize(skill)
                        : capitalize((skill as any).name_en)
                    )
                    .join(", ")}
                  onClick={() => setSkillsDialogOpen(true)}
                  onBlur={() => setTouched((t) => ({ ...t, requiredSkills: true }))}
                  error={
                    touched.requiredSkills
                      ? validateRequired(
                          formData.requiredSkills.length > 0 ? "selected" : "",
                          "Required skills are required"
                        )
                      : ""
                  }
                />
              </div>

              {/* Required Work Style */}
              <div>
                <Input
                  readOnly
                  label="Required Work Style"
                  required
                  placeholder="Select Required Work Style"
                  className="cursor-pointer"
                  rightIcon={<Smile className="w-5 h-5 text-gray-400" />}
                  value={formData.requiredWorkStyles
                    .map((ws) =>
                      typeof ws === "string" ? capitalize(ws) : capitalize((ws as any).name_en)
                    )
                    .join(", ")}
                  onClick={() => setPersonalityDialogOpen(true)}
                  onBlur={() => setTouched((t) => ({ ...t, requiredWorkStyles: true }))}
                  error={
                    touched.requiredWorkStyles
                      ? validateRequired(
                          formData.requiredWorkStyles.length > 0 ? "selected" : "",
                          "Required work style is required"
                        )
                      : ""
                  }
                />
              </div>

              {/* Language Requirement */}
              <div className="py-2">
                <Typography
                  variant="bodySm"
                  as="label"
                  className="block mb-2 font-semibold text-gray-700"
                >
                  Required Language Level
                </Typography>
                <div className="flex gap-2 flex-wrap sm:grid sm:grid-cols-4">
                  {LANGUAGE_LEVELS.map((level) => (
                    <FullWidthChip
                      key={level}
                      selected={formData.languageLevel === level}
                      onClick={() => {
                        handleInputChange("languageLevel", level);
                        setTouched((t) => ({ ...t, languageLevel: true }));
                      }}
                      color="teal"
                    >
                      {level}
                    </FullWidthChip>
                  ))}
                </div>
                {touched.languageLevel && !formData.languageLevel && (
                  <p className="text-red-500 text-sm mt-1">Language level is required</p>
                )}
              </div>
            </div>
          </FormSection>

          {/* Compensation Section */}
          <FormSection
            icon={<DollarSign />}
            title="Compensation"
            description="Set wage in hourly basis"
            iconColor="emerald"
          >
            <div className="space-y-4">
              {/* Wage */}
              <div className="relative">
                <Input
                  step="0.01"
                  value={formData.wage}
                  onChange={(e: any) => handleInputChange("wage", e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, wage: true }))}
                  placeholder="Enter Wage"
                  required
                  error={touched.wage ? validateRequired(formData.wage, "Wage is required") : ""}
                />
              </div>
            </div>
          </FormSection>

          {/* Job Description Section */}
          <FormSection
            icon={<FileText />}
            title="Job Description"
            description="Describe the role and responsibilities"
            iconColor="orange"
          >
            {/* AI 사용 여부 선택 */}
            <div className="mb-6">
              <Typography
                variant="bodySm"
                as="label"
                className="block mb-3 font-semibold text-gray-700"
              >
                Description Generation Method
              </Typography>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange("useAI", true)}
                  className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                    formData.useAI
                      ? "border-purple-500 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 shadow-md"
                      : "border-gray-200 bg-white text-gray-600 hover:border-purple-300 hover:shadow-sm"
                  }`}
                >
                  <span className="font-semibold">Use AI 🤖</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange("useAI", false)}
                  className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                    !formData.useAI
                      ? "border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-md"
                      : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:shadow-sm"
                  }`}
                >
                  <span className="font-semibold">Write Manually 📝</span>
                </button>
              </div>
              <p className="text-bodySm sm:text-bodyMd text-gray-500 mt-2">
                {formData.useAI
                  ? "AI will generate a job description based on your inputs"
                  : "You can write the job description manually"}
              </p>
            </div>

            <TextArea
              label="Job Description"
              value={formData.jobDescription}
              onChange={(e: any) => handleInputChange("jobDescription", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, jobDescription: true }))}
              placeholder={
                formData.useAI
                  ? "AI will generate description based on your inputs..."
                  : "Write your job description manually..."
              }
              rows={4}
              required
              error={
                touched.jobDescription
                  ? validateRequired(formData.jobDescription, "Job description is required")
                  : ""
              }
            />
          </FormSection>

          {/* Submit Button */}
          <div className="pb-8">
            <Button
              onClick={handleSubmit}
              size="xl"
              variant="gradient"
              className="w-full"
              disabled={!isFormValid()}
            >
              {formData.useAI ? "Generate Job Posting with AI" : "Create Job Posting"}
            </Button>
          </div>
        </div>

        {/* Dialogs */}
        <JobTypesDialog
          title="Select Job Type"
          open={jobTypesDialogOpen}
          onClose={() => setJobTypesDialogOpen(false)}
          selectedJobTypes={formData.selectedJobType ? [formData.selectedJobType] : []}
          onConfirm={(jobTypes) => {
            handleInputChange("selectedJobType", jobTypes.length > 0 ? jobTypes[0] : null);
            setJobTypesDialogOpen(false);
          }}
          maxSelected={1}
        />

        <DatePickerDialog
          open={calendarOpen}
          onClose={() => setCalendarOpen(false)}
          value={tempDeadline}
          onChange={(date) => {
            handleInputChange("deadline", date ?? undefined);
            setTempDeadline(date);
          }}
          confirmLabel="Select"
          required
        />

        <RequiredSkillsDialog
          open={skillsDialogOpen}
          onClose={() => setSkillsDialogOpen(false)}
          selectedSkills={formData.requiredSkills}
          onConfirm={(skills) => {
            handleInputChange("requiredSkills", skills);
            setSkillsDialogOpen(false);
          }}
        />

        <PreferredPersonalityDialog
          open={personalityDialogOpen}
          onClose={() => setPersonalityDialogOpen(false)}
          selectedTraits={formData.requiredWorkStyles}
          onConfirm={(workStyles) => {
            handleInputChange("requiredWorkStyles", workStyles);
            setPersonalityDialogOpen(false);
          }}
        />
      </div>
    </div>
  );
}

export default JobPostCreatePage;
