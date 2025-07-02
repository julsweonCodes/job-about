"use client";

import React, { useState } from "react";
import { Plus, X, Briefcase, Globe, Clock, MapPin, Award, FileText } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/Select";
import { Dialog } from "@/components/common/Dialog";

function App() {
  const [skills, setSkills] = useState(["Customer Service", "Communication", "Problem Solving"]);
  const [newSkill, setNewSkill] = useState("");
  const [workType, setWorkType] = useState("Remote");
  const [industry, setIndustry] = useState("");
  const [weekAvailability, setWeekAvailability] = useState("Weekdays");
  const [timeAvailability, setTimeAvailability] = useState("AM");
  const [location, setLocation] = useState("");
  const [language, setLanguage] = useState("Intermediate");
  const [experience, setExperience] = useState("");
  const [focusedInput, setFocusedInput] = useState("");
  const [workExperiences, setWorkExperiences] = useState<any[]>([]);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [expForm, setExpForm] = useState({
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const completionPercentage = Math.round(
    (((skills.length > 0 ? 1 : 0) +
      (workType ? 1 : 0) +
      (industry ? 1 : 0) +
      (location ? 1 : 0) +
      (language ? 1 : 0)) /
      5) *
      100
  );

  const handleAddExperience = () => {
    setWorkExperiences([...workExperiences, expForm]);
    setExpForm({ company: "", jobType: "", startDate: "", endDate: "", description: "" });
    setBottomSheetOpen(false);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-[576px] mx-auto bg-white/80 min-h-screen relative">
        {/* Sticky Header with Progress */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md">
          <div className="px-6 py-4">
            <span className="text-xl font-bold md:text-2xl">job:about</span>
            <div className="flex items-center justify-center mt-2 mb-3">
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Create Profile
              </h1>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="px-5 py-6 pb-6 space-y-8">
          {/* Skills Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl  ">
            <div className="flex items-center mb-4">
              <Award className="w-5 h-5 text-indigo-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">Skills & Expertise</h2>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setFocusedInput("skills")}
                  onBlur={() => setFocusedInput("")}
                  placeholder="Add a skill..."
                  className={`w-full px-4 py-3 bg-white/80 border-2 rounded-2xl transition-all duration-300 ${
                    focusedInput === "skills"
                      ? "border-indigo-400 shadow-lg shadow-indigo-100 bg-white"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                />
                {newSkill.trim() && (
                  <button
                    onClick={addSkill}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 active:scale-95"
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>

              {/* Skill Suggestions */}
              {focusedInput === "skills" && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                  <p className="text-sm text-gray-600 font-medium">Suggested Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {skillSuggestions
                      .filter((skill) => !skills.includes(skill))
                      .map((skill) => (
                        <button
                          key={skill}
                          onClick={() => addSuggestedSkill(skill)}
                          className="px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full text-sm font-medium hover:from-indigo-200 hover:to-purple-200 transition-all duration-200 active:scale-95"
                        >
                          + {skill}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Skill Tags */}
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 group"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="p-0.5 hover:bg-white/20 rounded-full transition-colors group-hover:scale-110"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Job Preferences */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl  ">
            <div className="flex items-center mb-6">
              <Briefcase className="w-5 h-5 text-indigo-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">Job Preferences</h2>
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
                      className={`py-3 px-3 rounded-2xl font-semibold text-sm transition-all duration-300 active:scale-95 ${
                        workType === type
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-200"
                          : "bg-white/80 text-gray-700 hover:bg-white hover:shadow-md border border-gray-200"
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
                <div className="relative">
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-2xl focus:border-indigo-400 focus:shadow-lg focus:shadow-indigo-100 appearance-none transition-all duration-300 font-medium h-auto min-h-[48px]">
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
              </div>

              {/* Available Days/Hours */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Available Days/Hours
                </label>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {["Weekdays", "Weekends"].map((option) => (
                      <button
                        key={option}
                        onClick={() => setWeekAvailability(option)}
                        className={`py-3 px-3 rounded-2xl font-semibold text-sm transition-all duration-300 active:scale-95 ${
                          weekAvailability === option
                            ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-200"
                            : "bg-white/80 text-gray-700 hover:bg-white hover:shadow-md border border-gray-200"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {["AM", "PM"].map((option) => (
                      <button
                        key={option}
                        onClick={() => setTimeAvailability(option)}
                        className={`py-3 px-3 rounded-2xl font-semibold text-sm transition-all duration-300 active:scale-95 ${
                          timeAvailability === option
                            ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-200"
                            : "bg-white/80 text-gray-700 hover:bg-white hover:shadow-md border border-gray-200"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  Location
                </label>
                <div className="relative">
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-2xl focus:border-indigo-400 focus:shadow-lg focus:shadow-indigo-100 appearance-none transition-all duration-300 font-medium h-auto min-h-[48px]">
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
          </div>

          {/* Language Proficiency */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl  ">
            <div className="flex items-center mb-4">
              <Globe className="w-5 h-5 text-indigo-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">Language Proficiency</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {["Beginner", "Intermediate", "Fluent"].map((level) => (
                <button
                  key={level}
                  onClick={() => setLanguage(level)}
                  className={`py-3 px-3 rounded-2xl font-semibold text-sm transition-all duration-300 active:scale-95 ${
                    language === level
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-200"
                      : "bg-white/80 text-gray-700 hover:bg-white hover:shadow-md border border-gray-200"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Work Experience */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl  ">
            <div className="flex items-center mb-4 justify-between">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-indigo-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Work Experience
                  <span className="text-sm text-gray-500 font-normal ml-2">(Optional)</span>
                </h2>
              </div>
              <button
                className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-sm font-medium hover:from-indigo-600 hover:to-purple-600 transition"
                onClick={() => setBottomSheetOpen(true)}
              >
                + Add Experience
              </button>
            </div>
            {/* 경험 리스트 */}
            <ul className="space-y-2">
              {workExperiences.map((exp, idx) => (
                <li key={idx} className="p-3 bg-gray-100 rounded-xl">
                  <div className="font-bold">{exp.company}</div>
                  <div className="text-sm">{exp.jobType}</div>
                  <div className="text-xs text-gray-500">
                    {exp.startDate} ~ {exp.endDate}
                  </div>
                  <div className="text-sm">{exp.description}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sticky Confirm Button */}
        <div className="w-full px-5 py-5 max-w-[576px] bg-gradient-to-t from-white via-white/95 to-transparent ">
          <button className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-3xl hover:from-indigo-700 hover:to-purple-700 active:scale-98 transition-all duration-300 shadow-2xl shadow-indigo-200 hover:shadow-3xl">
            Create My Profile
          </button>
        </div>

        {/* Dialog for Work Experience */}
        <Dialog open={bottomSheetOpen} onClose={() => setBottomSheetOpen(false)} type="bottomSheet">
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-2">Add Job Experience</h3>
            <input
              className="w-full border rounded p-2"
              placeholder="Company Name"
              value={expForm.company}
              onChange={(e) => setExpForm((f) => ({ ...f, company: e.target.value }))}
            />
            <input
              className="w-full border rounded p-2"
              placeholder="Job Type"
              value={expForm.jobType}
              onChange={(e) => setExpForm((f) => ({ ...f, jobType: e.target.value }))}
            />
            <div className="flex gap-2">
              <input
                className="w-1/2 border rounded p-2"
                placeholder="Start Date"
                type="date"
                value={expForm.startDate}
                onChange={(e) => setExpForm((f) => ({ ...f, startDate: e.target.value }))}
              />
              <input
                className="w-1/2 border rounded p-2"
                placeholder="End Date"
                type="date"
                value={expForm.endDate}
                onChange={(e) => setExpForm((f) => ({ ...f, endDate: e.target.value }))}
              />
            </div>
            <textarea
              className="w-full border rounded p-2"
              placeholder="Description"
              rows={3}
              value={expForm.description}
              onChange={(e) => setExpForm((f) => ({ ...f, description: e.target.value }))}
            />
            <button
              className="w-full py-2 bg-indigo-500 text-white rounded font-semibold hover:bg-indigo-600 transition"
              onClick={handleAddExperience}
            >
              저장
            </button>
          </div>
        </Dialog>
      </div>
    </div>
  );
}

export default App;
