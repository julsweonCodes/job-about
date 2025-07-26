// 근무 형태
export enum WorkType {
  Remote = "remote",
  OnSite = "on-site",
  Hybrid = "hybrid",
}

// 언어 수준
export enum LanguageLevel {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Fluent = "Fluent",
}
// 채용 상태
export enum JobStatus {
  Draft = "draft",
  Published = "published",
  Closed = "closed",
}

// 지원자 상태
export enum ApplicantStatus {
  Applied = "applied",
  InReview = "in_review",
  Rejected = "rejected",
  Withdrawn = "withdrawn",
  Hired = "hired",
}

// 근무 기간
export enum WorkPeriod {
  ShortTerm = "short_term",
  Under3Months = "under_3_months",
  Under6Months = "under_6_months",
  SixToTwelveMonths = "six_to_twelve_months",
  OneToTwoYears = "one_to_two_years",
  TwoToThreeYears = "two_to_three_years",
  OverThreeYears = "over_three_years",
}

// 근무 지역
export enum Location {
  TORONTO = "toronto",
  NORTH_YORK = "north_york",
  SCARBOROUGH = "scarborough",
  ETOBICOKE = "etobicoke",
  MISSISSAUGA = "mississauga",
  BRAMPTON = "brampton",
  VAUGHAN = "vaughan",
  RICHMOND_HILL = "richmond_hill",
  MARKHAM = "markham",
  THORNHILL = "thornhill",
  PICKERING = "pickering",
  AJAX = "ajax",
  WHITBY = "whitby",
  OSHAWA = "oshawa",
  OAKVILLE = "oakville",
  BURLINGTON = "burlington",
  MILTON = "milton",
  NEWHAMBURG = "newhamburg",
}

export enum AvailableDay {
  WEEKDAYS = "weekdays",
  WEEKENDS = "weekends",
}

export enum AvailableHour {
  AM = "am",
  PM = "pm",
}

// 근무 타입
export enum JobType {
  SERVER = "server",
  KITCHEN = "kitchen",
  DELIVERY = "delivery",
  CASHIER = "cashier",
  CLEANING = "cleaning",
  CUSTOMER_SERVICE = "customer_service",
  SALES = "sales",
  DRIVER = "driver",
  RECEPTIONIST = "receptionist",
  SECURITY = "security",
  MANAGER = "manager",
  BARISTA = "barista",
  CHEF = "chef",
  STOCKER = "stocker",
  TECH_SUPPORT = "tech_support",
  WAREHOUSE = "warehouse",
  ACCOUNTANT = "accountant",
  MARKETING = "marketing",
  HR = "hr",
  DESIGNER = "designer",
  DEVELOPER = "developer",
  ENGINEER = "engineer",
  TEACHER = "teacher",
  TRANSLATOR = "translator",
  PHARMACIST = "pharmacist",
  NURSE = "nurse",
  DOCTOR = "doctor",
  FARMER = "farmer",
  ELECTRICIAN = "electrician",
  PLUMBER = "plumber",
  JANITOR = "janitor",
}

// JobType을 위한 클라이언트 매핑 인터페이스
export interface JobTypeConfig {
  id: JobType;
  name: string;
  category: string;
  icon: React.ComponentType<any>;
  isCommon: boolean;
}

// JobType 카테고리
export const JOB_CATEGORIES = {
  RESTAURANT: "Restaurant",
  RETAIL: "Retail",
  SERVICE: "Service",
  TECHNICAL: "Technical",
  MEDICAL: "Medical",
  TRADES: "Trades",
  OFFICE: "Office",
  OTHER: "Other",
} as const;

export const LANGUAGE_LEVELS = [
  LanguageLevel.Beginner,
  LanguageLevel.Intermediate,
  LanguageLevel.Fluent,
] as const;

export const WORK_TYPES = [WorkType.Remote, WorkType.OnSite, WorkType.Hybrid] as const;

export const AVAILABLE_DAYS = [
  { value: AvailableDay.WEEKDAYS, label: "Weekdays" },
  { value: AvailableDay.WEEKENDS, label: "Weekends" },
] as const;

export const AVAILABLE_HOURS = [
  { value: AvailableHour.AM, label: "AM" },
  { value: AvailableHour.PM, label: "PM" },
] as const;
