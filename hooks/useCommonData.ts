import { useEffect, useRef } from "react";
import { useCommonDataStore } from "@/stores/useCommonDataStore";

interface UseCommonDataReturn {
  skills: any[];
  locations: any[];
  jobTypes: any[];
  workStyles: any[];
  isLoading: boolean;
  hasLoaded: boolean;
  refetch: () => Promise<void>;
}

// Zustand를 사용하는 실무 표준 방법
export const useCommonData = (): UseCommonDataReturn => {
  const { skills, locations, jobTypes, workStyles, isLoading, hasLoaded, fetchCommonData } =
    useCommonDataStore();

  // 중복 호출 방지를 위한 ref
  const hasInitialized = useRef(false);

  // 초기 데이터 로딩
  useEffect(() => {
    if (!hasLoaded && !hasInitialized.current) {
      hasInitialized.current = true;
      fetchCommonData();
    }
  }, [hasLoaded, fetchCommonData]);

  // 강제 새로고침 함수
  const refetch = async () => {
    hasInitialized.current = false;
    await fetchCommonData();
  };

  return {
    skills,
    locations,
    jobTypes,
    workStyles,
    isLoading: isLoading || !hasLoaded,
    hasLoaded,
    refetch,
  };
};
