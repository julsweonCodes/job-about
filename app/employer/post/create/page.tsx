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
import Typography from "@/components/ui/Typography";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { FullWidthChip } from "@/components/ui/FullWidthChip";
import { LanguageLevel, LANGUAGE_LEVELS, WorkType } from "@/constants/enums";
import { getJobTypeConfig } from "@/constants/jobTypes";
import DatePickerDialog from "@/app/employer/components/DatePickerDialog";
import PreferredPersonalityDialog from "@/app/employer/components/RequiredPersonalitiesDialog";
import RequiredSkillsDialog from "@/app/employer/components/RequiredSkillsDialog";
import JobTypesDialog from "@/components/common/JobTypesDialog";
import { useRouter } from "next/navigation";
import { Skill, WorkStyle } from "@/types/profile";
import { capitalize } from "@/lib/utils";
import { WORK_TYPE_OPTIONS } from "@/constants/options";
import { FormSection } from "@/components/common/FormSection";
import { JobType } from "@/constants/jobTypes";
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
  const [geminiResState, setGeminiResState] = useState(false);
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
        workType: true,
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
    value:
      | string
      | boolean
      | Date
      | string[]
      | Skill[]
      | WorkStyle[]
      | JobType
      | WorkType
      | LanguageLevel
      | null
      | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeminiResState(true);
    // 1. AI로 공고 생성 & DB 저장 (예시: /api/employer/job-post 호출)
    const res = await fetch("/api/employer/post/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      alert("공고 생성에 실패했습니다.");
      setGeminiResState(false);
      return;
    }
    const result = await res.json();
    setGeminiResState(false);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30">
      {isLoading && <LoadingScreen message="Generating job post..." />}
      {geminiResState && <LoadingScreen message="Generating AI-powered job description..." />}
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
          <FormSection
            icon={<Briefcase />}
            title="Job Title"
            description="Define the position title"
            iconColor="blue"
          >
            <Input
              value={formData.jobTitle}
              onChange={(e: any) => handleInputChange("jobTitle", e.target.value)}
              placeholder="Enter Job Title"
              required
            />
          </FormSection>

          {/* Job Type Section */}
          <FormSection
            icon={<Settings />}
            title="Job Types"
            description="Select multiple job categories"
            iconColor="green"
          >
            <div className="space-y-6">
              {/* Work Type Selection */}
              <div>
                <Typography
                  as="label"
                  variant="bodySm"
                  className="block font-semibold text-gray-800 mb-3"
                >
                  Work Type
                </Typography>
                <div className="grid grid-cols-3 gap-2">
                  {WORK_TYPE_OPTIONS.map((option) => (
                    <FullWidthChip
                      key={option.value}
                      selected={formData.selectedWorkType === option.value}
                      onClick={() => handleInputChange("selectedWorkType", option.value)}
                      color="green"
                    >
                      {option.label}
                    </FullWidthChip>
                  ))}
                </div>
              </div>
              {/* Job Type Selection */}
              <div>
                <Typography
                  as="label"
                  variant="bodySm"
                  className="block font-semibold text-gray-800 mb-3"
                >
                  Job Type
                </Typography>
                <Input
                  readOnly
                  required
                  placeholder="Select Job Type"
                  className="cursor-pointer"
                  value={
                    formData.selectedJobType ? getJobTypeConfig(formData.selectedJobType).name : ""
                  }
                  onClick={() => setJobTypesDialogOpen(true)}
                />
              </div>
            </div>
          </FormSection>

          {/* Schedule & Timing Section */}
          <FormSection
            icon={<Calendar />}
            title="Schedule & Timing"
            description="Set deadlines and work schedule"
            iconColor="orange"
          >
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
          </FormSection>

          {/* Requirements Section */}
          <FormSection
            icon={<User />}
            title="Requirements"
            description="Define skills and personality traits"
            iconColor="purple"
          >
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
              </div>

              {/* Required Work Style */}
              <div>
                <Input
                  readOnly
                  label="Required Work Style"
                  required
                  placeholder="Select Required Work Style"
                  className="cursor-pointer"
                  rightIcon={<Smile className="w-5 h-5 text-gray-400" />}
                  value={formData.requiredWorkStyles
                    .map((ws) =>
                      typeof ws === "string" ? capitalize(ws) : capitalize((ws as any).name_en)
                    )
                    .join(", ")}
                  onClick={() => setPersonalityDialogOpen(true)}
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
                <div className="flex gap-2 sm:grid sm:grid-cols-3">
                  {LANGUAGE_LEVELS.map((level) => (
                    <FullWidthChip
                      key={level}
                      selected={formData.languageLevel === level}
                      onClick={() => handleInputChange("languageLevel", level)}
                      color="teal"
                    >
                      {level}
                    </FullWidthChip>
                  ))}
                </div>
              </div>
            </div>
          </FormSection>

          {/* Compensation Section */}
          <FormSection
            icon={<DollarSign />}
            title="Compensation"
            description="Set wage in hourly basis"
            iconColor="emerald"
          >
            <div className="space-y-4">
              {/* Wage */}
              <div className="relative">
                <Input
                  step="0.01"
                  value={formData.wage}
                  onChange={(e: any) => handleInputChange("wage", e.target.value)}
                  placeholder="Enter Wage"
                  required
                />
              </div>
            </div>
          </FormSection>

          {/* Job Description Section */}
          <FormSection
            icon={<FileText />}
            title="Job Description"
            description="Describe the role and responsibilities"
            iconColor="orange"
          >
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
                  className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                    formData.useAI
                      ? "border-purple-500 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 shadow-md"
                      : "border-gray-200 bg-white text-gray-600 hover:border-purple-300 hover:shadow-sm"
                  }`}
                >
                  <span className="font-semibold">Use AI 🤖</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange("useAI", false)}
                  className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                    !formData.useAI
                      ? "border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-md"
                      : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:shadow-sm"
                  }`}
                >
                  <span className="font-semibold">Write Manually 📝</span>
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
          </FormSection>

          {/* Submit Button */}
          <div className="pb-8">
            <Button
              //type="submit"
              onClick={handleSubmit}
              size="xl"
              variant="gradient"
              className="w-full"
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
        {/* Required Skills Dialog */}
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
        {/* Preferred Personality Dialog */}
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
    </div>
  );
}

export default JobPostCreatePage;
