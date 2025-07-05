"use client";

import React, { useState } from "react";
import { Award, Briefcase, Globe, Clock, MapPin, FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import PageHeader from "@/components/common/PageHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Dialog } from "@/components/common/Dialog";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import TimeRangePicker from "@/components/ui/TimeRangePicker";

export default function SeekerProfilePage() {
  const router = useRouter();
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
    startDate: "",
    endDate: "",
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
      startDate: "",
      endDate: "",
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
        <PageHeader
          title="Create Profile"
          leftIcon={<ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />}
          onClickLeft={() => router.back()}
        />

        {/* Sticky Progress Bar */}
        <div className="sticky top-14 z-20 bg-white px-4 md:px-8 py-4 border-b border-gray-100">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <Typography as="p" variant="bodySm" className="text-gray-600 mt-2">
            {completionPercentage}% Complete
          </Typography>
        </div>

        {/* Content */}
        <div className="px-4 md:px-8 py-6 space-y-6">
          {/* Skills Section */}
          <div>
            <div className="flex items-center mb-4">
              <Award className="w-5 h-5 text-indigo-600 mr-2" />
              <Typography as="h2" variant="headlineSm" className="text-gray-800">
                Skills & Expertise
              </Typography>
            </div>

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
            <div className="flex items-center mb-6">
              <Briefcase className="w-5 h-5 text-indigo-600 mr-2" />
              <Typography as="h2" variant="headlineSm" className="text-gray-800">
                Job Preferences
              </Typography>
            </div>

            <div className="space-y-6">
              {/* Work Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Globe className="w-4 h-4 mr-1" />
                  Work Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["Remote", "On-site", "Hybrid"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setWorkType(type)}
                      className={`py-3 px-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                        workType === type
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
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
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Available Days
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["Weekdays", "Weekends"].map((option) => (
                    <button
                      key={option}
                      onClick={() => setWeekAvailability(option)}
                      className={`py-3 px-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                        weekAvailability === option
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
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
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  Location
                </label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="downtown">Downtown</SelectItem>
                    <SelectItem value="uptown">Uptown</SelectItem>
                    <SelectItem value="midtown">Midtown</SelectItem>
                    <SelectItem value="suburbs">Suburbs</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Language Proficiency */}
          <div>
            <div className="flex items-center mb-4">
              <Globe className="w-5 h-5 text-indigo-600 mr-2" />
              <Typography as="h2" variant="headlineSm" className="text-gray-800">
                Language Proficiency
              </Typography>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {["Beginner", "Intermediate", "Fluent"].map((level) => (
                <button
                  key={level}
                  onClick={() => setLanguage(level)}
                className={`py-3 px-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    language === level
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
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
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-indigo-600 mr-2" />
                <Typography as="h2" variant="headlineSm" className="text-gray-800">
                  Work Experience
                  <span className="text-sm text-gray-500 font-normal ml-2">(Optional)</span>
                </Typography>
              </div>
              <Button
                size="sm"
                onClick={() => setShowExperienceForm(true)}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
              >
                + Add Experience
              </Button>
            </div>

            {/* Experience List */}
            <div className="space-y-3">
              {workExperiences.map((exp, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                  <Typography as="div" variant="titleBold" className="text-gray-900">
                    {exp.company}
                  </Typography>
                  <Typography as="div" variant="bodySm" className="text-gray-700">
                    {exp.jobType}
                  </Typography>
                  <Typography as="div" variant="bodyXs" className="text-gray-500">
                    {exp.startDate} ~ {exp.endDate}
                  </Typography>
                  <Typography as="div" variant="bodySm" className="text-gray-700 mt-2">
                    {exp.description}
                  </Typography>
                </div>
              ))}
            </div>
          </div>

          {/* Create Profile Button (고정 해제, 진행률 100% 아니면 비활성화) */}
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
            <Typography as="h3" variant="headlineSm" className="mb-4">
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
              <Input
                label="Start Date"
                type="date"
                value={experienceForm.startDate}
                onChange={(e) => setExperienceForm((f) => ({ ...f, startDate: e.target.value }))}
                required
                className="w-1/2"
              />
              <Input
                label="End Date"
                type="date"
                value={experienceForm.endDate}
                onChange={(e) => setExperienceForm((f) => ({ ...f, endDate: e.target.value }))}
                required
                className="w-1/2"
              />
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
              저장
            </Button>
          </div>
        </Dialog>
      </div>
    </div>
  );
}
