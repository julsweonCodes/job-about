import { getLocationDisplayName } from "./location";

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
    { key: "toronto", label: "Toronto" },
    { key: "north_york", label: "North York" },
    { key: "scarborough", label: "Scarborough" },
    { key: "mississauga", label: "Mississauga" },
    { key: "brampton", label: "Brampton" },
    { key: "vaughan", label: "Vaughan" },
    { key: "etobicoke", label: "Etobicoke" },
    { key: "richmond_hill", label: "Richmond Hill" },
    { key: "markham", label: "Markham" },
    { key: "thornhill", label: "Thornhill" },
    { key: "pickering", label: "Pickering" },
    { key: "ajax", label: "Ajax" },
    { key: "whitby", label: "Whitby" },
    { key: "oshawa", label: "Oshawa" },
    { key: "oakville", label: "Oakville" },
    { key: "burlington", label: "Burlington" },
    { key: "milton", label: "Milton" },
    { key: "newhamburg", label: "New Hamburg" },
  ],
};

// Location 필터 옵션 (추천 페이지용 - 제한된 옵션)
export const locationFilterLimited: FilterDefinition = {
  id: "location",
  label: "Location",
  iconType: "location",
  options: [{ key: "all", label: "All" }],
};

// 동적 필터 생성 함수
export const createLocationFilterFromData = (locations: any[]): FilterDefinition => {
  const locationOptions = [
    { key: "all", label: "All" },
    ...locations.map((location) => {
      // API에서 오는 데이터 구조에 맞게 처리
      const locationValue =
        typeof location === "string" ? location : location.value || location.key;
      const locationLabel =
        typeof location === "string"
          ? getLocationDisplayName(location)
          : location.label || location.name || getLocationDisplayName(locationValue);

      return {
        key: locationValue,
        label: locationLabel,
      };
    }),
  ];

  return {
    id: "location",
    label: "Location",
    iconType: "location",
    options: locationOptions,
  };
};

// 모든 필터 정의를 한 곳에서 관리
export const filterDefinitions = {
  workType: workTypeFilter,
  location: locationFilter,
  locationLimited: locationFilterLimited,
} as const;
