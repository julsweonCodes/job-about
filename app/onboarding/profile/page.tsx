"use client";

import React, { useState } from "react";
import {
  Plus,
  X,
  ChevronDown,
  Briefcase,
  Globe,
  Clock,
  MapPin,
  Award,
  FileText,
} from "lucide-react";

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
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-2xl focus:border-indigo-400 focus:shadow-lg focus:shadow-indigo-100 appearance-none transition-all duration-300 font-medium"
                  >
                    <option value="">Select industry</option>
                    <option value="technology">Technology</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance</option>
                    <option value="retail">Retail</option>
                    <option value="education">Education</option>
                    <option value="hospitality">Hospitality</option>
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={20}
                  />
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
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-2xl focus:border-indigo-400 focus:shadow-lg focus:shadow-indigo-100 appearance-none transition-all duration-300 font-medium"
                  >
                    <option value="">Select location</option>
                    <option value="downtown">Downtown</option>
                    <option value="uptown">Uptown</option>
                    <option value="midtown">Midtown</option>
                    <option value="suburbs">Suburbs</option>
                    <option value="remote">Remote</option>
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={20}
                  />
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
            <div className="flex items-center mb-4">
              <FileText className="w-5 h-5 text-indigo-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">
                Work Experience
                <span className="text-sm text-gray-500 font-normal ml-2">(Optional)</span>
              </h2>
            </div>
            <textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              onFocus={() => setFocusedInput("experience")}
              onBlur={() => setFocusedInput("")}
              placeholder="Tell us about your relevant work experience, achievements, and what makes you unique..."
              rows={4}
              className={`w-full px-4 py-3 bg-white/80 border-2 rounded-2xl resize-none transition-all duration-300 ${
                focusedInput === "experience"
                  ? "border-indigo-400 shadow-lg shadow-indigo-100 bg-white"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            />
          </div>
        </div>

        {/* Sticky Confirm Button */}
        <div className="w-full px-5 py-5 max-w-[576px] bg-gradient-to-t from-white via-white/95 to-transparent ">
          <button className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-3xl hover:from-indigo-700 hover:to-purple-700 active:scale-98 transition-all duration-300 shadow-2xl shadow-indigo-200 hover:shadow-3xl">
            Create My Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
