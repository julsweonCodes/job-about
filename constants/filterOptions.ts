export interface FilterOption {
  key: string;
  label: string;
}

export interface FilterDefinition {
  id: string;
  label: string;
  iconType: "workType" | "location";
  options: FilterOption[];
}

// Work Type 필터 옵션
export const workTypeFilter: FilterDefinition = {
  id: "workType",
  label: "Work Type",
  iconType: "workType",
  options: [
    { key: "all", label: "All" },
    { key: "on-site", label: "On-Site" },
    { key: "remote", label: "Remote" },
    { key: "hybrid", label: "Hybrid" },
  ],
};

// Location 필터 옵션 (기본)
export const locationFilter: FilterDefinition = {
  id: "location",
  label: "Location",
  iconType: "location",
  options: [
    { key: "all", label: "All" },
    { key: "Vancouver", label: "Vancouver" },
    { key: "Toronto", label: "Toronto" },
    { key: "Montreal", label: "Montreal" },
    { key: "Calgary", label: "Calgary" },
  ],
};

// Location 필터 옵션 (추천 페이지용 - 제한된 옵션)
export const locationFilterLimited: FilterDefinition = {
  id: "location",
  label: "Location",
  iconType: "location",
  options: [{ key: "all", label: "All" }],
};

// 모든 필터 정의를 한 곳에서 관리
export const filterDefinitions = {
  workType: workTypeFilter,
  location: locationFilter,
  locationLimited: locationFilterLimited,
} as const;
