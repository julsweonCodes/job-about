"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Dialog } from "@/components/common/Dialog";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import TimeRangePicker from "@/components/ui/TimeRangePicker";
import LogoHeader from "@/components/common/LogoHeader";
import ProgressBar from "@/components/common/ProgressBar";

export default function SeekerProfilePage() {
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [workType, setWorkType] = useState("");
  const [industry, setIndustry] = useState("");
  const [weekAvailability, setWeekAvailability] = useState("");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("17:00");
  const [location, setLocation] = useState("");
  const [language, setLanguage] = useState("");
  const [workExperiences, setWorkExperiences] = useState<any[]>([]);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [experienceForm, setExperienceForm] = useState({
    company: "",
    jobType: "",
    startYear: new Date().getFullYear().toString(),
    workedPeriod: "Short-term",
    description: "",
  });

  const skillSuggestions = [
    "Leadership",
    "Teamwork",
    "Time Management",
    "Sales",
    "Marketing",
    "Data Analysis",
    "Customer Service",
    "Communication",
    "Problem Solving",
  ];

  // Select 옵션 배열 선언
  const workedPeriodOptions = [
    "Short-term",
    "Under 3 months",
    "Under 6 months",
    "6~12 months",
    "1~2 years",
    "2~3 years",
    "Over 3 years",
  ];

  const locationOptions = [
    { value: "downtown", label: "Downtown" },
    { value: "uptown", label: "Uptown" },
    { value: "midtown", label: "Midtown" },
    { value: "suburbs", label: "Suburbs" },
    { value: "remote", label: "Remote" },
  ];

  // 공통 Select 렌더 함수 (타입 명시, 컴포넌트 바깥에 선언)
  type RenderSelectOption = string | { value: string; label: string };
  interface RenderSelectProps {
    value: string;
    onValueChange: (val: string) => void;
    options: RenderSelectOption[];
    placeholder: string;
  }
  function RenderSelect({ value, onValueChange, options, placeholder }: RenderSelectProps) {
    return (
      <Select value={value} onValueChange={(val: string) => onValueChange(val)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt: RenderSelectOption) =>
            typeof opt === "string" ? (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ) : (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            )
          )}
        </SelectContent>
      </Select>
    );
  }

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const addSuggestedSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleAddExperience = () => {
    setWorkExperiences([...workExperiences, experienceForm]);
    setExperienceForm({
      company: "",
      jobType: "",
      startYear: new Date().getFullYear().toString(),
      workedPeriod: "Short-term",
      description: "",
    });
    setShowExperienceForm(false);
  };

  const completionPercentage = Math.round(
    (((skills.length > 0 ? 1 : 0) +
      (workType ? 1 : 0) +
      (industry ? 1 : 0) +
      (startTime && endTime ? 1 : 0) +
      (location ? 1 : 0) +
      (language ? 1 : 0)) /
      6) *
      100
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white min-h-screen">
        {/* Header */}
        <LogoHeader borderless shadowless />

        {/* Sticky Progress Bar + 타이틀 */}
        <div className="sticky top-14 z-20 bg-white px-4 md:px-8 py-2 border-b border-gray-100">
          <Typography as="h1" variant="headlineSm" className="text-center mb-6">
            Create Your Profile
          </Typography>
          <ProgressBar value={completionPercentage} className="mb-4" />
        </div>

        {/* Content */}
        <div className="px-4 md:px-8 py-6 space-y-6">
          {/* Skills Section */}
          <div>
            <Typography as="h2" variant="titleBold" className="text-gray-800 mb-4">
              Skills & Expertise
            </Typography>

            <div className="space-y-4">
              <div className="relative">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="Add a skill..."
                  label={undefined}
                  className="mb-0"
                />
                {newSkill.trim() && (
                  <button
                    onClick={addSkill}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                  >
                    +
                  </button>
                )}
              </div>

              {/* Skill Suggestions */}
              <div className="space-y-2">
                <Typography as="p" variant="bodySm" className="text-gray-600 font-medium">
                  Suggested Skills:
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {skillSuggestions
                    .filter((skill) => !skills.includes(skill))
                    .map((skill) => (
                      <button
                        key={skill}
                        onClick={() => addSuggestedSkill(skill)}
                        className="px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full text-sm font-medium hover:from-indigo-200 hover:to-purple-200 transition-all duration-200"
                      >
                        + {skill}
                      </button>
                    ))}
                </div>
              </div>

              {/* Skill Tags */}
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-sm font-medium"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="p-0.5 hover:bg-white/20 rounded-full transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Job Preferences */}
          <div>
            <Typography as="h2" variant="titleBold" className="text-gray-800 mb-4">
              Job Preferences
            </Typography>

            <div className="space-y-6">
              {/* Work Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Work Type</label>
                <div className="flex gap-2">
                  {["Remote", "On-site", "Hybrid"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setWorkType(type)}
                      className={`px-4 py-2 rounded-xl font-semibold text-sm border transition-all duration-200 ${
                        workType === type
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Industries */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Preferred Industries
                </label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="hospitality">Hospitality</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Available Days */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Available Days
                </label>
                <div className="flex gap-2">
                  {["Weekdays", "Weekends"].map((option) => (
                    <button
                      key={option}
                      onClick={() => setWeekAvailability(option)}
                      className={`px-4 py-2 rounded-xl font-semibold text-sm border transition-all duration-200 ${
                        weekAvailability === option
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Available Hours */}
              <div>
                <TimeRangePicker
                  startTime={startTime}
                  endTime={endTime}
                  onStartTimeChange={setStartTime}
                  onEndTimeChange={setEndTime}
                  label="Available Hours"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Location</label>
                <RenderSelect
                  value={location}
                  onValueChange={setLocation}
                  options={locationOptions}
                  placeholder="Select location"
                />
              </div>
            </div>
          </div>

          {/* Language Proficiency */}
          <div>
            <Typography as="h2" variant="titleBold" className="text-gray-800 mb-4">
              Language Proficiency
            </Typography>
            <div className="flex gap-2">
              {["Beginner", "Intermediate", "Fluent"].map((level) => (
                <button
                  key={level}
                  onClick={() => setLanguage(level)}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm border transition-all duration-200 ${
                    language === level
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Work Experience */}
          <div>
            <div className="flex items-center mb-4 justify-between">
              <Typography as="h2" variant="titleBold" className="text-gray-800">
                Work Experience
                <span className="text-sm text-gray-500 font-normal ml-2">(Optional)</span>
              </Typography>
            </div>
            {/* Experience List (Add Experience가 첫 항목) */}
            <div className="space-y-3">
              {/* Add Experience 리스트 스타일 버튼 */}
              <div
                className="flex items-center gap-2 px-3 py-3 sm:px-4 sm:py-3  bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 hover:border-indigo-300  transition-all duration-200"
                onClick={() => setShowExperienceForm(true)}
              >
                <span className="flex-1 text-left select-none text-sm sm:text-base text-gray-500">
                  + Add Experience
                </span>
              </div>
              {/* 실제 경력 리스트 */}
              {workExperiences.map((exp, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                  <Typography as="div" variant="titleBold" className="text-gray-900">
                    {exp.company}
                  </Typography>
                  <Typography as="div" variant="bodySm" className="text-gray-700">
                    {exp.jobType}
                  </Typography>
                  <Typography as="div" variant="bodyXs" className="text-gray-500">
                    {exp.startYear} / {exp.workedPeriod}
                  </Typography>
                  <Typography as="div" variant="bodySm" className="text-gray-700 mt-2">
                    {exp.description}
                  </Typography>
                </div>
              ))}
            </div>
          </div>

          {/* Create Profile Button */}
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white mt-8"
            disabled={completionPercentage < 100}
          >
            Create My Profile
          </Button>
        </div>

        {/* Experience Form Dialog */}
        <Dialog
          open={showExperienceForm}
          onClose={() => setShowExperienceForm(false)}
          type="bottomSheet"
        >
          <div className="space-y-4">
            <Typography as="h3" variant="titleBold" className="mb-4">
              Add Job Experience
            </Typography>
            <Input
              label="Company Name"
              value={experienceForm.company}
              onChange={(e) => setExperienceForm((f) => ({ ...f, company: e.target.value }))}
              required
            />
            <Input
              label="Job Type"
              value={experienceForm.jobType}
              onChange={(e) => setExperienceForm((f) => ({ ...f, jobType: e.target.value }))}
              required
            />
            <div className="flex gap-2">
              <div className="w-1/2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Year</label>
                <RenderSelect
                  value={experienceForm.startYear}
                  onValueChange={(val) => setExperienceForm((f) => ({ ...f, startYear: val }))}
                  options={Array.from({ length: 50 }, (_, i) =>
                    (new Date().getFullYear() - i).toString()
                  )}
                  placeholder="Select year"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Worked Period
                </label>
                <RenderSelect
                  value={experienceForm.workedPeriod}
                  onValueChange={(val) => setExperienceForm((f) => ({ ...f, workedPeriod: val }))}
                  options={workedPeriodOptions}
                  placeholder="Select period"
                />
              </div>
            </div>
            <TextArea
              label="Description"
              rows={3}
              value={experienceForm.description}
              onChange={(e) => setExperienceForm((f) => ({ ...f, description: e.target.value }))}
            />
            <Button
              onClick={handleAddExperience}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
            >
              Add
            </Button>
          </div>
        </Dialog>
      </div>
    </div>
  );
}
