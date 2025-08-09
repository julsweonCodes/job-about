import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AppliedFilterState {
  status: string; // "all" | ApplicantStatus-like string
  setStatus: (status: string) => void;
  reset: () => void;
}

export const useAppliedFilterStore = create<AppliedFilterState>()(
  persist(
    (set) => ({
      status: "all",
      setStatus: (status) => set({ status }),
      reset: () => set({ status: "all" }),
    }),
    {
      name: "applied-filter-store",
      storage: createJSONStorage(() => sessionStorage),
      version: 1,
    }
  )
);
