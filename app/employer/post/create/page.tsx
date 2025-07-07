"use client";

import React, { useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import Typography from "@/components/ui/Typography";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";
import TextArea from "@/components/ui/TextArea";
import { Switch } from "@/components/ui/Switch";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import ProgressBar from "@/components/common/ProgressBar";

const JOB_TYPES = ["Server", "Kitchen Help", "Delivery", "Cashier", "Other"];
const LOCATIONS = [
  { value: "toronto", label: "Toronto" },
  { value: "vancouver", label: "Vancouver" },
  { value: "montreal", label: "Montreal" },
  { value: "calgary", label: "Calgary" },
  { value: "edmonton", label: "Edmonton" },
  { value: "ottawa", label: "Ottawa" },
  { value: "winnipeg", label: "Winnipeg" },
  { value: "quebec_city", label: "Quebec City" },
  { value: "hamilton", label: "Hamilton" },
  { value: "kitchener", label: "Kitchener" },
];

const LANGUAGE_LEVELS = [
  { value: "basic", label: "Basic English" },
  { value: "intermediate", label: "Intermediate" },
  { value: "bilingual", label: "Bilingual" },
];

export default function JobPostCreatePage() {
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState("");
  const [jobType, setJobType] = useState<string[]>([]);
  const [deadline, setDeadline] = useState("");
  const [workSchedule, setWorkSchedule] = useState("");
  const [skills, setSkills] = useState("");
  const [personality, setPersonality] = useState("");
  const [wage, setWage] = useState("");
  const [location, setLocation] = useState("");
  const [languageLevel, setLanguageLevel] = useState("");
  const [description, setDescription] = useState("");

  const handleJobTypeClick = (type: string) => {
    setJobType((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
  };

  // 진행률 계산 (총 10개)
  const totalFields = 10;
  let filledCount = 0;
  if (jobTitle) filledCount++;
  if (jobType.length > 0) filledCount++;
  if (deadline) filledCount++;
  if (workSchedule) filledCount++;
  if (skills) filledCount++;
  if (personality) filledCount++;
  if (wage) filledCount++;
  if (location) filledCount++;
  if (languageLevel) filledCount++;
  if (description) filledCount++;
  const progressPercent = Math.round((filledCount / totalFields) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {" "}
      <div className="max-w-6xl mx-auto bg-white min-h-screen">
        <PageHeader title={"Generate a Job Post with AI"} leftIcon={<ArrowLeftIcon />} />
        <div className="sticky top-14 z-20 bg-white px-4 md:px-8 py-2 border-b border-gray-100">
          <ProgressBar value={progressPercent} className="mb-4" />
        </div>
        {/* 본문 폼 */}
        <div className="w-full mx-auto flex-1 flex flex-col px-4 pb-32 bg-white">
          <form className="flex flex-col gap-6 mt-2">
            <div>
              <Typography variant="titleBold" className="mb-1">
                Job Title
              </Typography>
              <Input
                placeholder="Input"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>
            <div>
              <Typography variant="titleBold" className="mb-2">
                Job Type
              </Typography>
              <div className="grid grid-cols-3 gap-2">
                {JOB_TYPES.map((type) => (
                  <Button
                    key={type}
                    type="button"
                    variant={jobType.includes(type) ? "default" : "outline"}
                    className={`flex items-center gap-2 ${jobType.includes(type) ? "bg-black text-white" : ""}`}
                    onClick={() => handleJobTypeClick(type)}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Typography variant="titleBold" className="mb-1">
                Deadline for applications
              </Typography>
              <Input
                placeholder="e.g., August 15"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
            <div>
              <Typography variant="titleBold" className="mb-1">
                Work Schedule
              </Typography>
              <Input
                placeholder="e.g., Weekends only, 10am-2pm"
                value={workSchedule}
                onChange={(e) => setWorkSchedule(e.target.value)}
              />
            </div>
            <div>
              <Typography variant="titleBold" className="mb-1">
                Required Skills
              </Typography>
              <Input
                placeholder="e.g., Customer Service, Serving Skill"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>
            <div>
              <Typography variant="titleBold" className="mb-1">
                Required Personality
              </Typography>
              <Input
                placeholder="e.g., Friendly, Quick learner"
                value={personality}
                onChange={(e) => setPersonality(e.target.value)}
              />
            </div>
            <div>
              <Typography variant="titleBold" className="mb-1">
                Wage
              </Typography>
              <Input placeholder="hr." value={wage} onChange={(e) => setWage(e.target.value)} />
            </div>
            <div>
              <Typography variant="titleBold" className="mb-1">
                Location
              </Typography>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map((loc) => (
                    <SelectItem key={loc.value} value={loc.value} selectedValue={location}>
                      {loc.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Typography variant="titleBold" className="mb-1">
                Language Requirement
              </Typography>
              <div className="flex gap-2">
                {LANGUAGE_LEVELS.map((level) => (
                  <Button
                    key={level.value}
                    type="button"
                    variant={languageLevel === level.value ? "default" : "outline"}
                    className={
                      languageLevel === level.value
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    }
                    onClick={() => setLanguageLevel(level.value)}
                  >
                    {level.label}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Typography variant="titleBold" className="mb-1">
                Job Description
              </Typography>
              <TextArea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
