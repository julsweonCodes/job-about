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
  Sparkles,
  PenTool,
} from "lucide-react";
import PageProgressHeader from "@/components/common/PageProgressHeader";
import LoadingScreen from "@/components/common/LoadingScreen";
import { Chip } from "@/components/ui/Chip";
import Typography from "@/components/ui/Typography";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { LanguageLevel, LANGUAGE_LEVELS, JobType, WorkType } from "@/constants/enums";
import { getJobTypeConfig } from "@/constants/jobTypes";
import DatePickerDialog from "@/app/employer/components/DatePickerDialog";
import PreferredPersonalityDialog from "@/app/employer/components/RequiredPersonalitiesDialog";
import RequiredSkillsDialog from "@/app/employer/components/RequiredSkillsDialog";
import JobTypesDialog from "@/app/employer/components/JobTypesDialog";
import { useRouter } from "next/navigation";
import { Skill, WorkStyle } from "@/types/profile";
import { capitalize } from "@/lib/utils";
import { workTypeOptions } from "@/constants/options";
function JobPostCreatePage() {
  const [tempDeadline, setTempDeadline] = useState<Date | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [personalityDialogOpen, setPersonalityDialogOpen] = useState(false);
  const [skillsDialogOpen, setSkillsDialogOpen] = useState(false);
  const [jobTypesDialogOpen, setJobTypesDialogOpen] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [workStyles, setWorkStyles] = useState<WorkStyle[]>([]);

  // 각 API 호출의 개별 상태
  const [loadingStates, setLoadingStates] = useState({
    skills: false,
    jobTypes: false,
    workStyles: false,
    workType: false,
  });

  // 전체 로딩 상태 계산
  const isLoading = Object.values(loadingStates).some((state) => state);

  const [formData, setFormData] = useState({
    jobTitle: "",
    selectedJobType: null as JobType | null,
    deadline: undefined as Date | undefined,
    workSchedule: "",
    requiredSkills: [],
    requiredWorkStyles: [],
    wage: "",
    jobDescription: "",
    languageLevel: null as LanguageLevel | null,
    selectedWorkType: null as WorkType | null,
    useAI: true, // AI 사용 여부 (기본값: true)
  });

  const fetchData = async () => {
    try {
      const res = await fetch("/api/utils");
      const data = await res.json();

      if (res.ok) {
        setSkills(data.data.skills);
        setWorkStyles(data.data.workStyles);
      } else {
        console.error("Failed to fetch data:", data.error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const initializeData = async () => {
    try {
      // 로딩 시작
      setLoadingStates({
        skills: true,
        jobTypes: true,
        workStyles: true,
        workType: true
      });

      // 모든 API 호출을 병렬로 실행
      await Promise.all([
        fetchData(),
        // 추가 API 호출들을 여기에 추가
      ]);
    } catch (error) {
      console.error("Error initializing data:", error);
    } finally {
      // 로딩 완료
      setLoadingStates({
        skills: false,
        jobTypes: false,
        workStyles: false,
        workType: false,
      });
    }
  };

  useEffect(() => {
    initializeData();
  }, []);

  const router = useRouter();

  const handleInputChange = (
    field: string,
    value: string | boolean | Date | string[] | Skill[] | WorkStyle[] | JobType | WorkType | null | undefined
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
    const result = await res.json();
    console.log(result);

    // 2. 미리보기 페이지로 이동
    if (formData.useAI) {
      router.push(`/employer/post/preview/${result.data.id}?useAI=true`);
    } else {
      router.push(`/employer/post/preview/${result.data.id}?useAI=false`);
    }

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
      formData.requiredWorkStyles.length > 0,
      formData.wage,
      formData.jobDescription,
      formData.languageLevel,
      formData.selectedWorkType,
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
                label="Job Type"
                required
                placeholder="Select Job Type"
                className="cursor-pointer"
                value={
                  formData.selectedJobType ? getJobTypeConfig(formData.selectedJobType).name : ""
                }
                onClick={() => setJobTypesDialogOpen(true)}
              />
            </div>
            <div className="py-2">
              <Typography
                variant="bodySm"
                as="label"
                className="block mb-2 font-semibold text-gray-700"
              >
                Work Type
              </Typography>
              <div className="flex flex-wrap gap-3">
                {workTypeOptions.map((option) => (
                  <Chip
                    key={option.value}
                    selected={formData.selectedWorkType === option.value}
                    onClick={() => handleInputChange("selectedWorkType", option.value)}
                  >
                    {option.label}
                  </Chip>
                ))}
              </div>
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
                        : capitalize((skill as any).name_en)
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
                  value={formData.requiredWorkStyles
                    .map((ws) =>
                      typeof ws === "string"
                        ? capitalize(ws)
                        : capitalize((ws as any).name_en)
                    )
                    .join(", ")}
                  onClick={() => setPersonalityDialogOpen(true)}
                />
                <PreferredPersonalityDialog
                  open={personalityDialogOpen}
                  onClose={() => setPersonalityDialogOpen(false)}
                  selectedTraits={formData.requiredWorkStyles}
                  onConfirm={(workStyles) => {
                    handleInputChange("requiredWorkStyles", workStyles);
                    setPersonalityDialogOpen(false);
                  }}
                  workStyles={workStyles}
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
                  className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                    formData.useAI
                      ? "border-purple-500 bg-purple-50 text-purple-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-purple-300"
                  }`}
                >
                  <Sparkles className="w-5 h-5" />
                  <span className="font-medium">Use AI</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange("useAI", false)}
                  className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                    !formData.useAI
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-blue-300"
                  }`}
                >
                  <PenTool className="w-5 h-5" />
                  <span className="font-medium">Write Manually</span>
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
              placeholder={
                formData.useAI
                  ? "AI will generate description based on your inputs..."
                  : "Write your job description manually..."
              }
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
              {formData.useAI ? "Generate Job Posting with AI" : "Create Job Posting"}
            </Button>
          </div>
        </div>

        {/* JobTypesDialog */}
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
      </div>
    </div>
  );
}

export default JobPostCreatePage;
