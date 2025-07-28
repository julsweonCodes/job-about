import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface JobFilters {
  jobType: string;
  location: string;
  salary: string;
  sortBy: string;
  searchQuery: string;
}

interface FilterState {
  filters: JobFilters;
  setFilter: (key: keyof JobFilters, value: string) => void;
  setFilters: (filters: Partial<JobFilters>) => void;
  resetFilters: () => void;
  getActiveFilters: () => Partial<JobFilters>;
}

const defaultFilters: JobFilters = {
  jobType: "all",
  location: "all",
  salary: "all",
  sortBy: "date",
  searchQuery: "",
};

export const useFilterStore = create<FilterState>()(
  persist(
    (set, get) => ({
      filters: defaultFilters,

      setFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),

      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),

      resetFilters: () =>
        set({
          filters: defaultFilters,
        }),

      getActiveFilters: () => {
        const { filters } = get();
        const activeFilters: Partial<JobFilters> = {};

        Object.entries(filters).forEach(([key, value]) => {
          if (value !== "all" && value !== "") {
            activeFilters[key as keyof JobFilters] = value;
          }
        });

        return activeFilters;
      },
    }),
    {
      name: "job-filters",
      partialize: (state) => ({ filters: state.filters }),
    }
  )
);
