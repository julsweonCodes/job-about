import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { EMPLOYER_QUERY_KEYS } from "@/constants/queryKeys";
import { useCommonData } from "@/hooks/useCommonData";
import { JobType } from "@/constants/jobTypes";
import { LanguageLevel, WorkType } from "@/constants/enums";
import { Skill, WorkStyle } from "@/types/profile";
import { API_URLS, PAGE_URLS } from "@/constants/api";
import { showErrorToast } from "@/utils/client/toastUtils";

interface JobPostFormData {
  jobTitle: string;
  selectedJobType: JobType | null;
  deadline: Date | undefined;
  workSchedule: string;
  requiredSkills: Skill[];
  requiredWorkStyles: WorkStyle[];
  wage: string;
  jobDescription: string;
  languageLevel: LanguageLevel | null;
  selectedWorkType: WorkType | null;
  useAI: boolean;
}

interface UseJobPostCreateReturn {
  // Form Data
  formData: JobPostFormData;
  setFormData: React.Dispatch<React.SetStateAction<JobPostFormData>>;

  // UI States
  tempDeadline: Date | null;
  setTempDeadline: (date: Date | null) => void;
  calendarOpen: boolean;
  setCalendarOpen: (open: boolean) => void;
  personalityDialogOpen: boolean;
  setPersonalityDialogOpen: (open: boolean) => void;
  skillsDialogOpen: boolean;
  setSkillsDialogOpen: (open: boolean) => void;
  jobTypesDialogOpen: boolean;
  setJobTypesDialogOpen: (open: boolean) => void;

  // Loading States
  isLoading: boolean;
  geminiResState: boolean;
  setGeminiResState: (loading: boolean) => void;

  // Validation
  touched: {
    jobTitle: boolean;
    selectedJobType: boolean;
    deadline: boolean;
    workSchedule: boolean;
    requiredSkills: boolean;
    requiredWorkStyles: boolean;
    wage: boolean;
    jobDescription: boolean;
    languageLevel: boolean;
    selectedWorkType: boolean;
  };
  setTouched: React.Dispatch<
    React.SetStateAction<{
      jobTitle: boolean;
      selectedJobType: boolean;
      deadline: boolean;
      workSchedule: boolean;
      requiredSkills: boolean;
      requiredWorkStyles: boolean;
      wage: boolean;
      jobDescription: boolean;
      languageLevel: boolean;
      selectedWorkType: boolean;
    }>
  >;
  validateRequired: (val: string, msg: string) => string;
  isFormValid: () => boolean;

  // Actions
  handleInputChange: (
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
  ) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleBack: () => void;

  // Computed Values
  progress: number;
}

export const useEmployerJobPostCreate = (): UseJobPostCreateReturn => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { skills, workStyles, isLoading: commonDataLoading } = useCommonData();

  // Form Data
  const [formData, setFormData] = useState<JobPostFormData>({
    jobTitle: "",
    selectedJobType: null,
    deadline: undefined,
    workSchedule: "",
    requiredSkills: [],
    requiredWorkStyles: [],
    wage: "",
    jobDescription: "",
    languageLevel: null,
    selectedWorkType: null,
    useAI: true,
  });

  // UI States
  const [tempDeadline, setTempDeadline] = useState<Date | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [personalityDialogOpen, setPersonalityDialogOpen] = useState(false);
  const [skillsDialogOpen, setSkillsDialogOpen] = useState(false);
  const [jobTypesDialogOpen, setJobTypesDialogOpen] = useState(false);

  // Loading States
  const [geminiResState, setGeminiResState] = useState(false);

  // Validation
  const [touched, setTouched] = useState({
    jobTitle: false,
    selectedJobType: false,
    deadline: false,
    workSchedule: false,
    requiredSkills: false,
    requiredWorkStyles: false,
    wage: false,
    jobDescription: false,
    languageLevel: false,
    selectedWorkType: false,
  });

  // Validation functions
  const validateRequired = (val: string, msg: string) => (!val ? msg : "");

  // Form validation
  const isFormValid = () => {
    return !!(
      formData.jobTitle &&
      formData.selectedJobType &&
      formData.deadline &&
      formData.workSchedule &&
      formData.requiredSkills.length > 0 &&
      formData.requiredWorkStyles.length > 0 &&
      formData.wage &&
      formData.jobDescription &&
      formData.languageLevel &&
      formData.selectedWorkType
    );
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

  // Actions
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

    try {
      const res = await fetch(API_URLS.EMPLOYER.POST.CREATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        showErrorToast("Failed to create job post.");
        return;
      }

      const result = await res.json();
      console.log(result);

      // Job posts 캐시 무효화 (새로운 job post가 생성되었으므로)
      queryClient.invalidateQueries({ queryKey: EMPLOYER_QUERY_KEYS.ACTIVE_JOB_POSTS });
      queryClient.invalidateQueries({ queryKey: EMPLOYER_QUERY_KEYS.DRAFT_JOB_POSTS });
      queryClient.invalidateQueries({ queryKey: EMPLOYER_QUERY_KEYS.DASHBOARD });

      // 미리보기 페이지로 이동
      if (formData.useAI) {
        router.replace(PAGE_URLS.EMPLOYER.POST.PREVIEW(result.data.id, true));
      } else {
        router.replace(PAGE_URLS.EMPLOYER.POST.PREVIEW(result.data.id, false));
      }
    } catch (error) {
      console.error("Error creating job post:", error);
      showErrorToast("Failed to create job post.");
    } finally {
      setGeminiResState(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  return {
    // Form Data
    formData,
    setFormData,

    // UI States
    tempDeadline,
    setTempDeadline,
    calendarOpen,
    setCalendarOpen,
    personalityDialogOpen,
    setPersonalityDialogOpen,
    skillsDialogOpen,
    setSkillsDialogOpen,
    jobTypesDialogOpen,
    setJobTypesDialogOpen,

    // Loading States
    isLoading: commonDataLoading,
    geminiResState,
    setGeminiResState,

    // Validation
    touched,
    setTouched,
    validateRequired,
    isFormValid,

    // Actions
    handleInputChange,
    handleSubmit,
    handleBack,

    // Computed Values
    progress: calculateCompletion(),
  };
};
