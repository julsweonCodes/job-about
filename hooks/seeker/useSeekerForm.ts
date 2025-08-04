import { useState, useEffect } from "react";
import { Skill } from "@/types/profile";
import { JobType } from "@/constants/jobTypes";
import {
  LanguageLevel,
  WorkType,
  AvailableDay,
  AvailableHour,
  WorkPeriod,
} from "@/constants/enums";
import { Location } from "@/constants/location";
import { convertLocationKeyToValue } from "@/constants/location";
import { useCommonData } from "@/hooks/useCommonData";

interface JobSeekerFormData {
  skills: Skill[];
  workType: WorkType | null;
  preferredJobTypes: JobType[];
  availability: {
    day: AvailableDay | null;
    hour: AvailableHour | null;
  };
  location: Location | null;
  languageProficiency: LanguageLevel | null;
  selfIntroduction: string;
}

interface ExperienceForm {
  company: string;
  jobType: JobType | null;
  startYear: string;
  workedPeriod: WorkPeriod | null;
  workType: WorkType | null;
  description: string;
}

interface UseSeekerFormReturn {
  // 상태
  formData: JobSeekerFormData;
  workExperiences: ExperienceForm[];
  cities: string[];
  loadingStates: {
    skills: boolean;
    cities: boolean;
  };
  isLoading: boolean;

  // 액션
  updateFormData: (field: keyof JobSeekerFormData, value: any) => void;
  addExperience: (experience: ExperienceForm) => void;
  updateExperience: (index: number, experience: ExperienceForm) => void;
  removeExperience: (index: number) => void;
  calculateProgress: () => number;
}

export const useSeekerForm = (): UseSeekerFormReturn => {
  const {
    locations: availableLocations,
    isLoading: isCommonDataLoading,
  } = useCommonData();

  // 폼 데이터 상태
  const [formData, setFormData] = useState<JobSeekerFormData>({
    skills: [],
    workType: null,
    preferredJobTypes: [],
    availability: {
      day: null,
      hour: null,
    },
    location: null,
    languageProficiency: null,
    selfIntroduction: "",
  });

  // 경험 데이터 상태
  const [workExperiences, setWorkExperiences] = useState<ExperienceForm[]>([]);

  const cities = availableLocations.map(convertLocationKeyToValue);
  const loadingStates = {
    skills: isCommonDataLoading,
    cities: isCommonDataLoading,
  };

  const isLoading = Object.values(loadingStates).some((state) => state);

  // 초기화 - API 호출 제거
  useEffect(() => {
    // useCommonData에서 자동으로 로드되므로 별도 초기화 불필요
  }, []);

  // 액션 함수들
  const updateFormData = (field: keyof JobSeekerFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addExperience = (experience: ExperienceForm) => {
    setWorkExperiences((prev) => [...prev, experience]);
  };

  const updateExperience = (index: number, experience: ExperienceForm) => {
    setWorkExperiences((prev) => prev.map((exp, i) => (i === index ? experience : exp)));
  };

  const removeExperience = (index: number) => {
    setWorkExperiences((prev) => prev.filter((_, i) => i !== index));
  };

  const calculateProgress = () => {
    const totalFields = 6;
    let filledFields = 0;

    if (formData.skills.length > 0) filledFields++;
    if (formData.workType && formData.preferredJobTypes.length > 0) filledFields++;
    if (formData.availability.day !== null && formData.availability.hour !== null) filledFields++;
    if (formData.location) filledFields++;
    if (formData.languageProficiency) filledFields++;
    if (formData.selfIntroduction.trim()) filledFields++;
    // if (workExperiences.length > 0) filledFields++;

    return Math.round((filledFields / totalFields) * 100);
  };

  return {
    formData,
    workExperiences,
    cities,
    loadingStates,
    isLoading,
    updateFormData,
    addExperience,
    updateExperience,
    removeExperience,
    calculateProgress,
  };
};
