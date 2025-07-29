import { AvailableDay, AvailableHour, WorkType, WorkPeriod } from "./enums";

export const WORK_TYPE_OPTIONS = [
  { value: WorkType.REMOTE, label: "Remote" },
  { value: WorkType.ON_SITE, label: "On-site" },
  { value: WorkType.HYBRID, label: "Hybrid" },
];

export const WORK_PERIOD_OPTIONS = [
  { value: WorkPeriod.SHORT_TERM, label: "Short-term" },
  { value: WorkPeriod.UNDER_3_MONTHS, label: "Under 3 months" },
  { value: WorkPeriod.UNDER_6_MONTHS, label: "Under 6 months" },
  { value: WorkPeriod.SIX_TO_TWELVE_MONTHS, label: "6~12 months" },
  { value: WorkPeriod.ONE_TO_TWO_YEARS, label: "1~2 years" },
  { value: WorkPeriod.TWO_TO_THREE_YEARS, label: "2~3 years" },
  { value: WorkPeriod.THREE_TO_FIVE_YEARS, label: "Over 3 years" },
  { value: WorkPeriod.FIVE_TO_SEVEN_YEARS, label: "5~7 years" },
  { value: WorkPeriod.SEVEN_TO_TEN_YEARS, label: "7~10 years" },
  { value: WorkPeriod.OVER_TEN_YEARS, label: "Over 10 years" },
];

export const AVAILABLE_DAY_OPTIONS = [
  { value: AvailableDay.WEEKDAYS, label: "Weekdays" },
  { value: AvailableDay.WEEKENDS, label: "Weekends" },
] as const;

export const AVAILABLE_HOUR_OPTIONS = [
  { value: AvailableHour.AM, label: "AM" },
  { value: AvailableHour.PM, label: "PM" },
] as const;
