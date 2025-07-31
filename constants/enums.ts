// 근무 형태
export enum WorkType {
  REMOTE = "remote",
  ON_SITE = "on-site",
  HYBRID = "hybrid",
}

// 언어 수준
export enum LanguageLevel {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate",
  FLUENT = "Fluent",
}
// 채용 상태
export enum JobStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  CLOSED = "closed",
}

// 지원자 상태
export enum ApplicantStatus {
  APPLIED = "applied",
  IN_REVIEW = "in_review",
  REJECTED = "rejected",
  WITHDRAWN = "withdrawn",
  HIRED = "hired",
}

// 근무 기간
export enum WorkPeriod {
  SHORT_TERM = "short_term",
  UNDER_3_MONTHS = "under_3_months",
  UNDER_6_MONTHS = "under_6_months",
  SIX_TO_TWELVE_MONTHS = "six_to_twelve_months",
  ONE_TO_TWO_YEARS = "one_to_two_years",
  TWO_TO_THREE_YEARS = "two_to_three_years",
  THREE_TO_FIVE_YEARS = "three_to_five_years",
  FIVE_TO_SEVEN_YEARS = "five_to_seven_years",
  SEVEN_TO_TEN_YEARS = "seven_to_ten_years",
  OVER_TEN_YEARS = "over_ten_years",
}

export enum AvailableDay {
  WEEKDAYS = "weekdays",
  WEEKENDS = "weekends",
}

export enum AvailableHour {
  AM = "am",
  PM = "pm",
}

export const LANGUAGE_LEVELS = [
  LanguageLevel.BEGINNER,
  LanguageLevel.INTERMEDIATE,
  LanguageLevel.FLUENT,
] as const;

export const WORK_TYPES = [WorkType.REMOTE, WorkType.ON_SITE, WorkType.HYBRID] as const;
