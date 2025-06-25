"use client";

import React, { useState } from "react";
import { Plus, X, ChevronDown } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import Header from "@/components/Header";
import Typography from "@/components/ui/Typography";

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

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
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

  return (
    <PageLayout header={<Header title="Create Profile" />}>
      <div className="pb-24 space-y-8">
        {/* Skills Section */}
        <div className="space-y-4">
          <div>
            <Typography as="h2" variant="headlineSm" className="block mb-2">
              Skills
            </Typography>
            {/*<label className="block text-lg font-semibold text-gray-700 mb-2">Skills</label>*/}
            <div className="relative">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g, communication"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
              {newSkill.trim() && (
                <button
                  onClick={addSkill}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                >
                  <Plus size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Skill Tags */}
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="p-0.5 hover:bg-purple-200 rounded-full transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Job Preferences */}
        <div className="space-y-6">
          <Typography as="h2" variant="headlineSm">
            Job Preferences
          </Typography>

          {/* Work Type */}
          <div>
            <Typography as="span" variant="titleRegular">
              Work Type
            </Typography>

            <div className="grid grid-cols-3 gap-2 mt-3">
              {["Remote", "On-site", "Hybrid"].map((type) => (
                <button
                  key={type}
                  onClick={() => setWorkType(type)}
                  className={`py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 ${
                    workType === type
                      ? "bg-purple-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Industries */}
          <div>
            <Typography as="span" variant="titleRegular">
              Preferred Industries
            </Typography>

            <div className="relative mt-3">
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white transition-all duration-200"
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
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </div>

          {/* Available Days/Hours */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Available Days/Hours</label>
            <div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {["Weekdays", "Weekends"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setWeekAvailability(option)}
                    className={`py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 ${
                      weekAvailability === option
                        ? "bg-purple-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {["AM", "PM"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setTimeAvailability(option)}
                    className={`py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 ${
                      timeAvailability === option
                        ? "bg-purple-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location (City or Neighborhood)
            </label>
            <div className="relative">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white transition-all duration-200"
              >
                <option value="">Select location</option>
                <option value="downtown">Downtown</option>
                <option value="uptown">Uptown</option>
                <option value="midtown">Midtown</option>
                <option value="suburbs">Suburbs</option>
                <option value="remote">Remote</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </div>
        </div>

        {/* Language Proficiency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Language Proficiency
          </label>
          <div className="grid grid-cols-3 gap-2">
            {["Beginner", "Intermediate", "Fluent"].map((level) => (
              <button
                key={level}
                onClick={() => setLanguage(level)}
                className={`py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 ${
                  language === level
                    ? "bg-purple-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Work Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Work Experience <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <textarea
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="Describe your relevant work experience..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all duration-200"
          />
        </div>
      </div>
    </PageLayout>
  );
}

export default App;
