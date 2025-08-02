import { create } from "zustand";
import { API_URLS } from "@/constants/api";
import { apiGetData } from "@/utils/client/API";
import { fromPrismaLocation } from "@/types/enumMapper";

interface CommonData {
  skills: any[];
  locations: any[];
  jobTypes: any[];
  workStyles: any[];
}

interface CommonDataStore extends CommonData {
  isLoading: boolean;
  hasLoaded: boolean;
  error: string | null;
  fetchCommonData: () => Promise<void>;
  reset: () => void;
}

export const useCommonDataStore = create<CommonDataStore>((set, get) => ({
  skills: [],
  locations: [],
  jobTypes: [],
  workStyles: [],
  isLoading: false,
  hasLoaded: false,
  error: null,

  fetchCommonData: async () => {
    const state = get();

    // 이미 로드 중이거나 로드된 경우 중복 요청 방지
    if (state.isLoading || state.hasLoaded) return;

    set({ isLoading: true, error: null });

    try {
      // 병렬로 API 호출하여 성능 최적화
      const [utilsData, locationData, jobTypeData] = await Promise.all([
        apiGetData(API_URLS.UTILS),
        apiGetData(API_URLS.ENUM.BY_NAME("Location")),
        apiGetData(API_URLS.ENUM.BY_NAME("JobType")),
      ]);

      set({
        skills: utilsData?.skills || [],
        locations: locationData?.values?.map(fromPrismaLocation) || [],
        jobTypes: jobTypeData?.values || [],
        workStyles: utilsData?.workStyles || [],
        isLoading: false,
        hasLoaded: true,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching common data:", error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to fetch common data",
      });
    }
  },

  reset: () => {
    set({
      skills: [],
      locations: [],
      jobTypes: [],
      workStyles: [],
      isLoading: false,
      hasLoaded: false,
      error: null,
    });
  },
}));
