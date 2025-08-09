import { ApplicantStatus } from "./enums";
import { getLocationLabel } from "./location";

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

// Job Type 필터 옵션
export const jobTypeFilter: FilterDefinition = {
  id: "jobType",
  label: "Job Type",
  iconType: "workType", // 임시로 workType 아이콘 사용
  options: [
    { key: "all", label: "All" },
    { key: "KITCHEN", label: "Kitchen" },
    { key: "SERVER", label: "Server" },
    { key: "DRIVER", label: "Driver" },
    { key: "SECURITY", label: "Security" },
    { key: "JANITOR", label: "Janitor" },
    { key: "CASHIER", label: "Cashier" },
    { key: "WAREHOUSE", label: "Warehouse" },
    { key: "CONSTRUCTION", label: "Construction" },
    { key: "OFFICE", label: "Office" },
    { key: "SALES", label: "Sales" },
    { key: "OTHER", label: "Other" },
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

export const applicantStatusFilter: FilterOption[] = [
  { key: "all", label: "All" },
  { key: ApplicantStatus.APPLIED, label: "Applied" },
  { key: ApplicantStatus.IN_REVIEW, label: "In Review" },
  { key: ApplicantStatus.HIRED, label: "Hired" },
  { key: ApplicantStatus.REJECTED, label: "Rejected" },
  { key: ApplicantStatus.WITHDRAWN, label: "Withdrawn" },
];

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
          ? getLocationLabel(location)
          : location.label || location.name || getLocationLabel(locationValue);

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
