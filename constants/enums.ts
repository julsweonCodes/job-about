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

export const LANGUAGE_LEVELS = [
  LanguageLevel.Beginner,
  LanguageLevel.Intermediate,
  LanguageLevel.Fluent,
] as const;

export const WORK_TYPES = [WorkType.Remote, WorkType.OnSite, WorkType.Hybrid] as const;
