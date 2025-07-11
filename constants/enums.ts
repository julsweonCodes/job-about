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

export enum WorkPeriod {
  ShortTerm = "short_term",
  Under3Months = "under_3_months",
  Under6Months = "under_6_months",
  SixToTwelveMonths = "six_to_twelve_months",
  OneToTwoYears = "one_to_two_years",
  TwoToThreeYears = "two_to_three_years",
  OverThreeYears = "over_three_years",
}

export const LANGUAGE_LEVELS = [
  LanguageLevel.Beginner,
  LanguageLevel.Intermediate,
  LanguageLevel.Fluent,
] as const;

export const WORK_TYPES = [WorkType.Remote, WorkType.OnSite, WorkType.Hybrid] as const;
