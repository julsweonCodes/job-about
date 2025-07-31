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
  fetchCommonData: () => Promise<void>;
}

export const useCommonDataStore = create<CommonDataStore>((set, get) => ({
  skills: [],
  locations: [],
  jobTypes: [],
  workStyles: [],
  isLoading: false,
  hasLoaded: false,

  fetchCommonData: async () => {
    // 이미 로드된 경우 다시 로드하지 않음
    if (get().hasLoaded) return;

    set({ isLoading: true });

    try {
      const [utilsData, locationData, jobTypeData] = await Promise.all([
        apiGetData(API_URLS.UTILS),
        apiGetData(API_URLS.ENUM.BY_NAME("Location")),
        apiGetData(API_URLS.ENUM.BY_NAME("JobType")),
      ]);

      set({
        skills: utilsData.skills || [],
        locations: locationData.values.map(fromPrismaLocation),
        jobTypes: jobTypeData.values || [],
        workStyles: utilsData.workStyles || [],
        isLoading: false,
        hasLoaded: true,
      });
    } catch (error) {
      console.error("Error fetching common data:", error);
      set({ isLoading: false });
    }
  },
}));
