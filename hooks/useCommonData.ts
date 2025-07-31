import { useCommonDataStore } from "@/stores/useCommonDataStore";

// Zustand를 사용하는 실무 표준 방법
export const useCommonData = () => {
  const { skills, locations, jobTypes, workStyles, isLoading, hasLoaded } = useCommonDataStore();

  return {
    skills,
    locations,
    jobTypes,
    workStyles,
    isLoading: isLoading || !hasLoaded,
  };
};
