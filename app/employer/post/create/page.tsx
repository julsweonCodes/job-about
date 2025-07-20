"use client";
import React, { useEffect, useState } from "react";
import "react-day-picker/dist/style.css";
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
import { Chip } from "@/components/ui/Chip";
import Typography from "@/components/ui/Typography";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { LanguageLevel, LANGUAGE_LEVELS, JobType } from "@/constants/enums";
import { getJobTypeConfig } from "@/constants/jobTypes";
import DatePickerDialog from "@/app/employer/components/DatePickerDialog";
import PreferredPersonalityDialog from "@/app/employer/components/RequiredPersonalitiesDialog";
import RequiredSkillsDialog from "@/app/employer/components/RequiredSkillsDialog";
import JobTypesDialog from "@/app/employer/components/JobTypesDialog";
import { useRouter } from "next/navigation";
import { Skill } from "@/types/profile";
import { capitalize } from "@/lib/utils";
function JobPostCreatePage() {
  const [tempDeadline, setTempDeadline] = useState<Date | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [personalityDialogOpen, setPersonalityDialogOpen] = useState(false);
  const [skillsDialogOpen, setSkillsDialogOpen] = useState(false);
  const [jobTypesDialogOpen, setJobTypesDialogOpen] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);

  // 각 API 호출의 개별 상태
  const [loadingStates, setLoadingStates] = useState({
    skills: false,
    jobTypes: false,
    personalities: false,
  });

  // 전체 로딩 상태 계산
  const isLoading = Object.values(loadingStates).some((state) => state);

  const [formData, setFormData] = useState({
    jobTitle: "",
    jobType: "",
    selectedJobType: null as JobType | null,
    deadline: undefined as Date | undefined,
    workSchedule: "",
    requiredSkills: [],
    requiredPersonalities: [],
    wage: "",
    jobDescription: "",
    languageLevel: null as LanguageLevel | null,
  });

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/utils");
      const data = await res.json();

      if (res.ok) {
        setSkills(data.skills);
      } else {
        console.error("Failed to fetch skills:", data.error);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  const initializeData = async () => {
    try {
      // 로딩 시작
      setLoadingStates({
        skills: true,
        jobTypes: true,
        personalities: true,
      });

      // 모든 API 호출을 병렬로 실행
      await Promise.all([
        fetchSkills(),
        // 추가 API 호출들을 여기에 추가
      ]);
    } catch (error) {
      console.error("Error initializing data:", error);
    } finally {
      // 로딩 완료
      setLoadingStates({
        skills: false,
        jobTypes: false,
        personalities: false,
      });
    }
  };

  useEffect(() => {
    initializeData();
  }, []);

  const router = useRouter();

  const handleInputChange = (
    field: string,
    value: string | boolean | Date | string[] | Skill[] | JobType | null | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 1. AI로 공고 생성 & DB 저장 (예시: /api/employer/job-post 호출)
    const res = await fetch("/api/employer/post/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      alert("공고 생성에 실패했습니다.");
      return;
    }
    const { postId } = await res.json();
    // 2. 미리보기 페이지로 이동
    router.push(`/employer/post/preview/${postId}`);
  };

  const handleBack = () => {
    window.history.back();
  };

  // Calculate completion percentage
  const calculateCompletion = () => {
    const fields = [
      formData.jobTitle,
      formData.selectedJobType,
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
      {isLoading && <LoadingScreen message="Generating job post..." />}

      {/* Header */}
      <PageProgressHeader
        title="Generate a Job Post with AI"
        progress={progress}
        leftIcon={<ArrowLeft />}
        onClickLeft={handleBack}
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/*<form onSubmit={handleSubmit} className="space-y-6"> */}
        <div className="space-y-6">
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
              placeholder="Enter Job Title"
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
                  Job Types
                </Typography>
                <Typography as="p" variant="bodySm" className="text-gray-600">
                  Select multiple job categories
                </Typography>
              </div>
            </div>

            <div>
              <Input
                readOnly
                label="Job Types"
                required
                placeholder="Select Job Types"
                className="cursor-pointer"
                value={
                  formData.selectedJobType ? getJobTypeConfig(formData.selectedJobType).name : ""
                }
                onClick={() => setJobTypesDialogOpen(true)}
              />
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
                  value={formData.requiredSkills
                    .map((skill) =>
                      typeof skill === "string"
                        ? capitalize(skill)
                        : capitalize((skill as any).name)
                    )
                    .join(", ")}
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
                  skills={skills}
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
                  placeholder="Enter Wage"
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
              //type="submit"
              onClick={handleSubmit}
              size="xl"
              className="w-full bg-[#7C3AED] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-[#6D28D9] active:bg-[#5B21B6] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              Generate Job Posting with AI
            </Button>
          </div>
        </div>

        {/* JobTypesDialog */}
        <JobTypesDialog
          open={jobTypesDialogOpen}
          onClose={() => setJobTypesDialogOpen(false)}
          selectedJobTypes={formData.selectedJobType ? [formData.selectedJobType] : []}
          onConfirm={(jobTypes) => {
            handleInputChange("selectedJobType", jobTypes.length > 0 ? jobTypes[0] : null);
            setJobTypesDialogOpen(false);
          }}
          maxSelected={1}
        />
      </div>
    </div>
  );
}

export default JobPostCreatePage;
