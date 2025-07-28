import { useState, useEffect } from "react";
import { JobType } from "@/constants/jobTypes";
import { Skill } from "@/types/profile";
import { LanguageLevel, WorkType, AvailableDay, AvailableHour } from "@/constants/enums";
import { Location } from "@/constants/location";
import { convertLocationKeyToValue } from "@/constants/location";
import { API_URLS } from "@/constants/api";
import { WorkPeriod } from "@prisma/client";

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
  workedPeriod: WorkPeriod;
  description: string;
}

interface UseJobSeekerFormReturn {
  // 상태
  formData: JobSeekerFormData;
  workExperiences: ExperienceForm[];
  availableSkills: Skill[];
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

export const useJobSeekerForm = (): UseJobSeekerFormReturn => {
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

  // API 데이터 상태
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  // 로딩 상태
  const [loadingStates, setLoadingStates] = useState({
    skills: false,
    cities: false,
  });

  const isLoading = Object.values(loadingStates).some((state) => state);

  // API 호출 함수들
  const fetchSkills = async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, skills: true }));
      const res = await fetch("/api/utils");
      const data = await res.json();

      if (res.ok) {
        setAvailableSkills(data.data.skills);
      } else {
        console.error("Failed to fetch skills:", data.error);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, skills: false }));
    }
  };

  const fetchCities = async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, cities: true }));
      const res = await fetch(API_URLS.ENUM.BY_NAME("Location"));
      const data = await res.json();

      if (res.ok) {
        const citiesData = data.data?.values || data.values || [];
        if (Array.isArray(citiesData)) {
          const convertedCities = citiesData.map(convertLocationKeyToValue);
          setCities(convertedCities);
        } else {
          setCities([]);
        }
      } else {
        console.error("Failed to fetch cities:", data.error);
        setCities([]);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, cities: false }));
    }
  };

  // 초기화
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoadingStates({ skills: true, cities: true });
        await Promise.all([fetchSkills(), fetchCities()]);
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setLoadingStates({ skills: false, cities: false });
      }
    };

    initializeData();
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
    availableSkills,
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
