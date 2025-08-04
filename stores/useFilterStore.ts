import { create } from "zustand";

export interface JobFilters {
  workType: string;
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
  workType: "all",
  location: "all",
  salary: "all",
  sortBy: "date",
  searchQuery: "",
};

export const useFilterStore = create<FilterState>()((set, get) => ({
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
}));
