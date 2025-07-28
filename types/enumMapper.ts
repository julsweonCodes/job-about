import { $Enums } from "@prisma/client";
import { WorkType, LanguageLevel, JobStatus, AvailableDay, AvailableHour, WorkPeriod } from "@/constants/enums";
import { JobType } from "@/constants/jobTypes";
import { Location } from "@/constants/location";

// enum to Prisma enum
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

export function toPrismaWorkPeriod(value: WorkPeriod): $Enums.WorkPeriod {
  const map: Record<WorkPeriod, $Enums.WorkPeriod> = {
    [WorkPeriod.SHORT_TERM]: "SHORT_TERM",
    [WorkPeriod.UNDER_3_MONTHS]: "UNDER_3_MONTHS",
    [WorkPeriod.UNDER_6_MONTHS]: "UNDER_6_MONTHS",
    [WorkPeriod.SIX_TO_TWELVE_MONTHS]: "SIX_TO_TWELVE_MONTHS",
    [WorkPeriod.ONE_TO_TWO_YEARS]: "ONE_TO_TWO_YEARS",
    [WorkPeriod.TWO_TO_THREE_YEARS]: "TWO_TO_THREE_YEARS",
    [WorkPeriod.THREE_TO_FIVE_YEARS]: "THREE_TO_FIVE_YEARS",
    [WorkPeriod.FIVE_TO_SEVEN_YEARS]: "FIVE_TO_SEVEN_YEARS",
    [WorkPeriod.SEVEN_TO_TEN_YEARS]: "SEVEN_TO_TEN_YEARS",
    [WorkPeriod.OVER_TEN_YEARS]: "OVER_TEN_YEARS",
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

export function toPrismaAvailableDay(value: AvailableDay): $Enums.AvailableDay {
  const map: Record<AvailableDay, $Enums.AvailableDay> = {
    [AvailableDay.WEEKDAYS]: "WEEKDAYS",
    [AvailableDay.WEEKENDS]: "WEEKENDS",
  };
  return map[value];
}

export function toPrismaAvailableHour(value: AvailableHour): $Enums.AvailableHour {
  const map: Record<AvailableHour, $Enums.AvailableHour> = {
    [AvailableHour.AM]: "AM",
    [AvailableHour.PM]: "PM",
  };
  return map[value];
}

export function toPrismaLocation(value: string): string {
  // Location enum의 key값을 반환
  const map: Record<string, string> = {
    toronto: "TORONTO",
    north_york: "NORTH_YORK",
    scarborough: "SCARBOROUGH",
    etobicoke: "ETOBICOKE",
    mississauga: "MISSISSAUGA",
    brampton: "BRAMPTON",
    vaughan: "VAUGHAN",
    richmond_hill: "RICHMOND_HILL",
    markham: "MARKHAM",
    thornhill: "THORNHILL",
    pickering: "PICKERING",
    ajax: "AJAX",
    whitby: "WHITBY",
    oshawa: "OSHAWA",
    oakville: "OAKVILLE",
    burlington: "BURLINGTON",
    milton: "MILTON",
    newhamburg: "NEWHAMBURG",
  };
  return map[value] || value;
}

// Prisma enum to enum
export function fromPrismaWorkType(value: string): WorkType {
  const map: Record<string, WorkType> = {
    REMOTE: WorkType.REMOTE,
    ON_SITE: WorkType.ON_SITE,
    HYBRID: WorkType.HYBRID,
  };
  return map[value] || WorkType.REMOTE;
}

export function fromPrismaWorkPeriod(value: string): WorkPeriod {
  const map: Record<string, WorkPeriod> = {
    SHORT_TERM: WorkPeriod.SHORT_TERM,
    UNDER_3_MONTHS: WorkPeriod.UNDER_3_MONTHS,
    UNDER_6_MONTHS: WorkPeriod.UNDER_6_MONTHS,
    SIX_TO_TWELVE_MONTHS: WorkPeriod.SIX_TO_TWELVE_MONTHS,
    ONE_TO_TWO_YEARS: WorkPeriod.ONE_TO_TWO_YEARS,
    TWO_TO_THREE_YEARS: WorkPeriod.TWO_TO_THREE_YEARS,
    THREE_TO_FIVE_YEARS: WorkPeriod.THREE_TO_FIVE_YEARS,
    FIVE_TO_SEVEN_YEARS: WorkPeriod.FIVE_TO_SEVEN_YEARS,
    SEVEN_TO_TEN_YEARS: WorkPeriod.SEVEN_TO_TEN_YEARS,
    OVER_TEN_YEARS: WorkPeriod.OVER_TEN_YEARS,
  };
  return map[value] || WorkPeriod.SHORT_TERM;
}

export function fromPrismaLanguageLevel(value: string): LanguageLevel {
  const map: Record<string, LanguageLevel> = {
    BEGINNER: LanguageLevel.BEGINNER,
    INTERMEDIATE: LanguageLevel.INTERMEDIATE,
    FLUENT: LanguageLevel.FLUENT,
  };
  return map[value] || LanguageLevel.BEGINNER;
}

export function fromPrismaJobType(value: string): JobType {
  const map: Record<string, JobType> = {
    SERVER: JobType.SERVER,
    KITCHEN: JobType.KITCHEN,
    DELIVERY: JobType.DELIVERY,
    CASHIER: JobType.CASHIER,
    CLEANING: JobType.CLEANING,
    CUSTOMER_SERVICE: JobType.CUSTOMER_SERVICE,
    SALES: JobType.SALES,
    DRIVER: JobType.DRIVER,
    RECEPTIONIST: JobType.RECEPTIONIST,
    SECURITY: JobType.SECURITY,
    MANAGER: JobType.MANAGER,
    BARISTA: JobType.BARISTA,
    CHEF: JobType.CHEF,
    STOCKER: JobType.STOCKER,
    TECH_SUPPORT: JobType.TECH_SUPPORT,
    WAREHOUSE: JobType.WAREHOUSE,
    ACCOUNTANT: JobType.ACCOUNTANT,
    MARKETING: JobType.MARKETING,
    HR: JobType.HR,
    DESIGNER: JobType.DESIGNER,
    DEVELOPER: JobType.DEVELOPER,
    ENGINEER: JobType.ENGINEER,
    TEACHER: JobType.TEACHER,
    TRANSLATOR: JobType.TRANSLATOR,
    PHARMACIST: JobType.PHARMACIST,
    NURSE: JobType.NURSE,
    DOCTOR: JobType.DOCTOR,
    FARMER: JobType.FARMER,
    ELECTRICIAN: JobType.ELECTRICIAN,
    PLUMBER: JobType.PLUMBER,
    JANITOR: JobType.JANITOR,
  };
  return map[value] || JobType.SERVER;
}

export function fromPrismaLocation(value: string): string {
  const map: Record<string, string> = {
    TORONTO: Location.TORONTO,
    NORTH_YORK: Location.NORTH_YORK,
    SCARBOROUGH: Location.SCARBOROUGH,
    ETOBICOKE: Location.ETOBICOKE,
    MISSISSAUGA: Location.MISSISSAUGA,
    BRAMPTON: Location.BRAMPTON,
    VAUGHAN: Location.VAUGHAN,
    RICHMOND_HILL: Location.RICHMOND_HILL,
    MARKHAM: Location.MARKHAM,
    THORNHILL: Location.THORNHILL,
    PICKERING: Location.PICKERING,
    AJAX: Location.AJAX,
    WHITBY: Location.WHITBY,
    OSHAWA: Location.OSHAWA,
    OAKVILLE: Location.OAKVILLE,
    BURLINGTON: Location.BURLINGTON,
    MILTON: Location.MILTON,
    NEWHAMBURG: Location.NEWHAMBURG,
  };
  return map[value] || value;
}

export function fromPrismaAvailableDay(value: string): AvailableDay {
  const map: Record<string, AvailableDay> = {
    WEEKDAYS: AvailableDay.WEEKDAYS,
    WEEKENDS: AvailableDay.WEEKENDS,
  };
  return map[value] || AvailableDay.WEEKDAYS;
}

export function fromPrismaAvailableHour(value: string): AvailableHour {
  const map: Record<string, AvailableHour> = {
    AM: AvailableHour.AM,
    PM: AvailableHour.PM,
  };
  return map[value] || AvailableHour.AM;
}
