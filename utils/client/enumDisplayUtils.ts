import { JobType, getJobTypeConfig } from "@/constants/jobTypes";
import {
  WORK_TYPE_OPTIONS,
  AVAILABLE_DAY_OPTIONS,
  AVAILABLE_HOUR_OPTIONS,
  LANGUAGE_LEVEL_OPTIONS,
} from "@/constants/options";

/**
 * Work Type enum 값을 사용자 친화적인 label로 변환
 */
export const getWorkTypeLabel = (value: string): string => {
  const option = WORK_TYPE_OPTIONS.find((opt) => opt.value === value);
  return option?.label || value;
};

/**
 * Availability Day enum 값을 사용자 친화적인 label로 변환
 */
export const getAvailabilityDayLabel = (value: string): string => {
  const option = AVAILABLE_DAY_OPTIONS.find((opt) => opt.value === value);
  return option?.label || value;
};

/**
 * Availability Hour enum 값을 사용자 친화적인 label로 변환
 */
export const getAvailabilityHourLabel = (value: string): string => {
  const option = AVAILABLE_HOUR_OPTIONS.find((opt) => opt.value === value);
  return option?.label || value;
};

/**
 * Language Level enum 값을 사용자 친화적인 label로 변환
 */
export const getLanguageLevelLabel = (value: string): string => {
  const option = LANGUAGE_LEVEL_OPTIONS.find((opt) => opt.value === value);
  return option?.label || value;
};

/**
 * Job Type enum 값을 사용자 친화적인 name으로 변환
 */
export const getJobTypeName = (value: string): string => {
  const config = getJobTypeConfig(value as JobType);
  return config?.name || value;
};

/**
 * 모든 enum 값을 한 번에 변환하는 헬퍼 함수
 */
export const getEnumDisplayValue = (
  type: "workType" | "availabilityDay" | "availabilityHour" | "languageLevel" | "jobType",
  value: string
): string => {
  switch (type) {
    case "workType":
      return getWorkTypeLabel(value);
    case "availabilityDay":
      return getAvailabilityDayLabel(value);
    case "availabilityHour":
      return getAvailabilityHourLabel(value);
    case "languageLevel":
      return getLanguageLevelLabel(value);
    case "jobType":
      return getJobTypeName(value);
    default:
      return value;
  }
};
