import { WorkType } from "./enums";

export const workTypeOptions = [
  { value: WorkType.REMOTE, label: "Remote" },
  { value: WorkType.ON_SITE, label: "On-site" },
  { value: WorkType.HYBRID, label: "Hybrid" },
];

export const workedPeriodOptions = [
  "Short-term",
  "Under 3 months",
  "Under 6 months",
  "6~12 months",
  "1~2 years",
  "2~3 years",
  "Over 3 years",
];
