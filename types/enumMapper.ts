import { $Enums } from "@prisma/client";
import { WorkType, LanguageLevel, JobStatus } from "@/constants/enums";
import { JobType } from "@/constants/jobTypes";

export function toPrismaWorkType(value: WorkType): $Enums.WorkType {
  const map: Record<WorkType, $Enums.WorkType> = {
    [WorkType.REMOTE]: "REMOTE",
    [WorkType.ON_SITE]: "ON_SITE",
    [WorkType.HYBRID]: "HYBRID",
  };
  return map[value];
}
export function toPrismaLanguageLevel(value: LanguageLevel): $Enums.LanguageLevel {
  const map: Record<LanguageLevel, $Enums.LanguageLevel> = {
    [LanguageLevel.BEGINNER]: "BEGINNER",
    [LanguageLevel.INTERMEDIATE]: "INTERMEDIATE",
    [LanguageLevel.FLUENT]: "FLUENT",
  };
  return map[value];
}
export function toPrismaJobStatus(value: JobStatus): $Enums.JobStatus {
  const map: Record<JobStatus, $Enums.JobStatus> = {
    [JobStatus.DRAFT]: "DRAFT",
    [JobStatus.PUBLISHED]: "PUBLISHED",
    [JobStatus.CLOSED]: "CLOSED",
  };
  return map[value];
}

export function toPrismaJobType(value: JobType): $Enums.JobType {
  const map: Record<JobType, $Enums.JobType> = {
    [JobType.SERVER]: "SERVER",
    [JobType.KITCHEN]: "KITCHEN",
    [JobType.DELIVERY]: "DELIVERY",
    [JobType.CASHIER]: "CASHIER",
    [JobType.CLEANING]: "CLEANING",
    [JobType.CUSTOMER_SERVICE]: "CUSTOMER_SERVICE",
    [JobType.SALES]: "SALES",
    [JobType.DRIVER]: "DRIVER",
    [JobType.RECEPTIONIST]: "RECEPTIONIST",
    [JobType.SECURITY]: "SECURITY",
    [JobType.MANAGER]: "MANAGER",
    [JobType.BARISTA]: "BARISTA",
    [JobType.CHEF]: "CHEF",
    [JobType.STOCKER]: "STOCKER",
    [JobType.TECH_SUPPORT]: "TECH_SUPPORT",
    [JobType.WAREHOUSE]: "WAREHOUSE",
    [JobType.ACCOUNTANT]: "ACCOUNTANT",
    [JobType.MARKETING]: "MARKETING",
    [JobType.HR]: "HR",
    [JobType.DESIGNER]: "DESIGNER",
    [JobType.DEVELOPER]: "DEVELOPER",
    [JobType.ENGINEER]: "ENGINEER",
    [JobType.TEACHER]: "TEACHER",
    [JobType.TRANSLATOR]: "TRANSLATOR",
    [JobType.PHARMACIST]: "PHARMACIST",
    [JobType.NURSE]: "NURSE",
    [JobType.DOCTOR]: "DOCTOR",
    [JobType.FARMER]: "FARMER",
    [JobType.ELECTRICIAN]: "ELECTRICIAN",
    [JobType.PLUMBER]: "PLUMBER",
    [JobType.JANITOR]: "JANITOR",
  };
  return map[value];
}
