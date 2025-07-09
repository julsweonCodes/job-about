"use client";

import React, { useState } from "react";
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
import { Chip } from "@/components/ui/Chip";
import Typography from "@/components/ui/Typography";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/Select";
import ProgressBar from "@/components/common/ProgressBar";
import PageHeader from "@/components/common/PageHeader";

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

const cities = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
  "San Antonio, TX",
  "San Diego, CA",
  "Dallas, TX",
  "San Jose, CA",
];

function JobPostCreatePage() {
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobType: "",
    deadline: "",
    workSchedule: "",
    requiredSkills: "",
    requiredPersonality: "",
    wage: "",
    location: "",
    englishRequired: false,
    jobDescription: "",
  });

  const handleJobTypeSelect = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      jobType: prev.jobType === type ? "" : type,
    }));
  };

  const handleInputChange = (field: string, value: string | boolean) => {
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
      formData.requiredSkills,
      formData.requiredPersonality,
      formData.wage,
      formData.location,
      formData.jobDescription,
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  const progress = calculateCompletion();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <PageHeader
            title={"Generate a Job Post with AI"}
            leftIcon={<ArrowLeft />}
            onClickLeft={handleBack}
          />

          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-3">
            <Typography
              as="h3"
              variant="bodySm"
              className="font-semibold text-gray-700 tracking-wide"
            >
              Job Post Setup
            </Typography>
            <Typography as="span" variant="bodySm" className="font-medium text-gray-500">
              {progress}% Complete
            </Typography>
          </div>

          <ProgressBar value={progress} className="h-2 mb-6" />
        </div>
      </div>

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
                    className="font-medium"
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
                  type="date"
                  label="Deadline for Applications"
                  value={formData.deadline}
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
                  type="text"
                  label="Required Skills"
                  required
                  value={formData.requiredSkills}
                  onChange={(e: any) => handleInputChange("requiredSkills", e.target.value)}
                  placeholder="Customer Service, Serving Skill"
                />
              </div>

              {/* Required Personality */}
              <div>
                <Input
                  type="text"
                  label="Required Personality"
                  value={formData.requiredPersonality}
                  onChange={(e: any) => handleInputChange("requiredPersonality", e.target.value)}
                  placeholder="Friendly, Quick learner"
                  required
                  rightIcon={<Smile className="w-5 h-5 text-gray-400" />}
                />
              </div>

              {/* Language Requirement */}
              <div className="flex items-center justify-between py-2">
                <Typography as="label" variant="bodySm" className="text-gray-700">
                  English Required
                </Typography>
                <Button
                  type="button"
                  onClick={() => handleInputChange("englishRequired", !formData.englishRequired)}
                  variant="outline"
                  size="sm"
                  className="relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:ring-offset-2 touch-manipulation"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${formData.englishRequired ? "translate-x-6" : "translate-x-1"}`}
                  />
                </Button>
              </div>
            </div>
          </div>

          {/* Compensation & Location Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <Typography as="h3" variant="headlineMd" className="font-semibold text-gray-900">
                  Compensation & Location
                </Typography>
                <Typography as="p" variant="bodySm" className="text-gray-600">
                  Set wage and work location
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

              {/* Location */}
              <div>
                <Typography as="label" variant="bodySm" className="mb-2 block">
                  Location <span className="text-red-500">*</span>
                </Typography>
                <Select
                  value={formData.location}
                  onValueChange={(value) => handleInputChange("location", value)}
                >
                  <SelectTrigger className="w-full px-4 py-4 rounded-2xl border border-gray-200/80 bg-gray-50/50 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 transition-all duration-300 outline-none text-gray-900 font-medium shadow-sm hover:shadow-md hover:border-gray-300 appearance-none">
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
