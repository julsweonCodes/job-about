import { WorkType, LanguageLevel, AvailableDay, AvailableHour } from "@/constants/enums";
import { JobType } from "@/constants/jobTypes";
import { Location } from "@/constants/location";

const mapEnumValueToKey = <T extends Record<string, string>>(
  enumObj: T,
  value: string | null
): string | null => {
  if (!value) return null;
  const key = Object.keys(enumObj).find((k) => enumObj[k as keyof T] === value);
  return key || null;
};

export const mapWorkTypeToServer = (workType: string | null): string | null => {
  return mapEnumValueToKey(WorkType, workType);
};

export const mapLanguageLevelToServer = (level: string | null): string | null => {
  return mapEnumValueToKey(LanguageLevel, level);
};

export const mapAvailableDayToServer = (day: string | null): string | null => {
  return mapEnumValueToKey(AvailableDay, day);
};

export const mapAvailableHourToServer = (hour: string | null): string | null => {
  return mapEnumValueToKey(AvailableHour, hour);
};

export const mapJobTypeToServer = (jobType: string | null): string | null => {
  return mapEnumValueToKey(JobType, jobType);
};

export const mapLocationToServer = (location: string | null): string | null => {
  return mapEnumValueToKey(Location, location);
};
