"use client";

import React, { useState } from "react";
import "react-day-picker/dist/style.css";
import {
  ArrowLeft,
  Server,
  Utensils,
  Truck,
  CreditCard,
  MoreHorizontal,
  Calendar,
  DollarSign,
  User,
  FileText,
  Briefcase,
  Smile,
  Settings,
} from "lucide-react";
import PageProgressHeader from "@/components/common/PageProgressHeader";
import { Chip } from "@/components/ui/Chip";
import Typography from "@/components/ui/Typography";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { LanguageLevel, LANGUAGE_LEVELS } from "@/constants/enums";
import DatePickerDialog from "@/app/employer/components/DatePickerDialog";
import PreferredPersonalityDialog from "@/app/employer/components/RequiredPersonalitiesDialog";
import RequiredSkillsDialog from "@/app/employer/components/RequiredSkillsDialog";

interface JobType {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

const jobTypes: JobType[] = [
  { id: "server", label: "Server", icon: Server },
  { id: "kitchen", label: "Kitchen Help", icon: Utensils },
  { id: "delivery", label: "Delivery", icon: Truck },
  { id: "cashier", label: "Cashier", icon: CreditCard },
  { id: "other", label: "Other", icon: MoreHorizontal },
];

function JobPostCreatePage() {
  const [tempDeadline, setTempDeadline] = useState<Date | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [personalityDialogOpen, setPersonalityDialogOpen] = useState(false);
  const [skillsDialogOpen, setSkillsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    jobTitle: "",
    jobType: "",
    deadline: undefined as Date | undefined,
    workSchedule: "",
    requiredSkills: [],
    requiredPersonalities: [],
    wage: "",
    jobDescription: "",
    languageLevel: null as LanguageLevel | null,
  });

  const handleJobTypeSelect = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      jobType: prev.jobType === type ? "" : type,
    }));
  };

  const handleInputChange = (
    field: string,
    value: string | boolean | Date | string[] | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleBack = () => {
    window.history.back();
  };

  // Calculate completion percentage
  const calculateCompletion = () => {
    const fields = [
      formData.jobTitle,
      formData.jobType,
      formData.deadline,
      formData.workSchedule,
      formData.requiredSkills.length > 0,
      formData.requiredPersonalities.length > 0,
      formData.wage,
      formData.jobDescription,
      formData.languageLevel,
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  const progress = calculateCompletion();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
      {/* Header */}
      <PageProgressHeader
        title="Generate a Job Post with AI"
        progress={progress}
        leftIcon={<ArrowLeft />}
        onClickLeft={handleBack}
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <Typography as="h3" variant="headlineMd" className="font-semibold text-gray-900">
                  Job Title
                </Typography>
                <Typography as="p" variant="bodySm" className="text-gray-600">
                  Define the position title
                </Typography>
              </div>
            </div>

            <Input
              label="Job Title"
              value={formData.jobTitle}
              onChange={(e: any) => handleInputChange("jobTitle", e.target.value)}
              placeholder="Input"
              required
            />
          </div>

          {/* Job Type Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Settings className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <Typography as="h3" variant="headlineMd" className="font-semibold text-gray-900">
                  Job Type
                </Typography>
                <Typography as="p" variant="bodySm" className="text-gray-600">
                  Select applicable job categories
                </Typography>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {jobTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = formData.jobType === type.id;
                return (
                  <Chip
                    key={type.id}
                    selected={isSelected}
                    onClick={() => handleJobTypeSelect(type.id)}
                    size="md"
                    variant="outline"
                    className="font-medium flex items-center gap-2"
                  >
                    <Icon size={16} />
                    <span className="text-sm font-medium">{type.label}</span>
                  </Chip>
                );
              })}
            </div>
          </div>

          {/* Schedule & Timing Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <Typography as="h3" variant="headlineMd" className="font-semibold text-gray-900">
                  Schedule & Timing
                </Typography>
                <Typography as="p" variant="bodySm" className="text-gray-600">
                  Set deadlines and work schedule
                </Typography>
              </div>
            </div>

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
                />
                {/* 날짜 선택 다이얼로그 */}
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
              </div>

              {/* Work Schedule */}
              <div>
                <div className="relative">
                  <Input
                    type="text"
                    label="Work Schedule"
                    value={formData.workSchedule}
                    onChange={(e: any) => handleInputChange("workSchedule", e.target.value)}
                    placeholder="Weekends only, 10am–2pm"
                    required
                    rightIcon={<Calendar className="w-5 h-5 text-gray-400" />}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Requirements Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <Typography as="h3" variant="headlineMd" className="font-semibold text-gray-900">
                  Requirements
                </Typography>
                <Typography as="p" variant="bodySm" className="text-gray-600">
                  Define skills and personality traits
                </Typography>
              </div>
            </div>

            <div className="space-y-4">
              {/* Required Skills */}
              <div>
                <Input
                  readOnly
                  label="Required Skills"
                  required
                  placeholder="Select Required Skills"
                  className="cursor-pointer"
                  value={formData.requiredSkills.join(", ")}
                  onClick={() => setSkillsDialogOpen(true)}
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
              </div>

              {/* Required Personality */}
              <div>
                <Input
                  readOnly
                  label="Required Personality"
                  required
                  placeholder="Select Preferred Personality"
                  className="cursor-pointer"
                  rightIcon={<Smile className="w-5 h-5 text-gray-400" />}
                  value={formData.requiredPersonalities.join(", ")}
                  onClick={() => setPersonalityDialogOpen(true)}
                />
                <PreferredPersonalityDialog
                  open={personalityDialogOpen}
                  onClose={() => setPersonalityDialogOpen(false)}
                  selectedTraits={formData.requiredPersonalities}
                  onConfirm={(traits) => {
                    handleInputChange("requiredPersonalities", traits as string[]);
                    setPersonalityDialogOpen(false);
                  }}
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
                <div className="flex flex-wrap gap-3">
                  {LANGUAGE_LEVELS.map((level) => (
                    <Chip
                      key={level}
                      selected={formData.languageLevel === level}
                      onClick={() => handleInputChange("languageLevel", level)}
                    >
                      {level}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Compensation Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <Typography as="h3" variant="headlineMd" className="font-semibold text-gray-900">
                  Compensation
                </Typography>
                <Typography as="p" variant="bodySm" className="text-gray-600">
                  Set wage in hourly basis
                </Typography>
              </div>
            </div>

            <div className="space-y-4">
              {/* Wage */}
              <div className="relative">
                <Input
                  step="0.01"
                  label="Wage"
                  value={formData.wage}
                  onChange={(e: any) => handleInputChange("wage", e.target.value)}
                  placeholder="15.00"
                  required
                />
              </div>
            </div>
          </div>

          {/* Job Description Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <Typography as="h3" variant="headlineMd" className="font-semibold text-gray-900">
                  Job Description
                </Typography>
                <Typography as="p" variant="bodySm" className="text-gray-600">
                  Describe the role and responsibilities
                </Typography>
              </div>
            </div>
            <TextArea
              label="Job Description"
              value={formData.jobDescription}
              onChange={(e: any) => handleInputChange("jobDescription", e.target.value)}
              placeholder="Describe the job responsibilities and requirements..."
              rows={4}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="pb-8">
            <Button
              type="submit"
              size="xl"
              className="w-full bg-[#7C3AED] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-[#6D28D9] active:bg-[#5B21B6] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              Generate Job Posting with AI
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JobPostCreatePage;
