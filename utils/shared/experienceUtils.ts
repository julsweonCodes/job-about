import { WorkPeriod } from "@/constants/enums";
import { WorkExperience } from "@/types/profile";

// 각 기간 구간의 '상한(최대치)' 기준(월)으로 추정
const WORK_PERIOD_TO_MONTHS_MAX: Record<WorkPeriod, number> = {
  [WorkPeriod.SHORT_TERM]: 1,
  [WorkPeriod.UNDER_3_MONTHS]: 3,
  [WorkPeriod.UNDER_6_MONTHS]: 6,
  [WorkPeriod.SIX_TO_TWELVE_MONTHS]: 12,
  [WorkPeriod.ONE_TO_TWO_YEARS]: 24,
  [WorkPeriod.TWO_TO_THREE_YEARS]: 36,
  [WorkPeriod.THREE_TO_FIVE_YEARS]: 60,
  [WorkPeriod.FIVE_TO_SEVEN_YEARS]: 84,
  [WorkPeriod.SEVEN_TO_TEN_YEARS]: 120,
  [WorkPeriod.OVER_TEN_YEARS]: 120,
};

export function estimateExperienceMonths(exps: Pick<WorkExperience, "work_period">[] = []): number {
  return exps.reduce((sum, exp) => {
    const m = WORK_PERIOD_TO_MONTHS_MAX[exp.work_period as WorkPeriod] ?? 0;
    return sum + m;
  }, 0);
}

export function formatExperience(totalMonths: number): string {
  if (totalMonths <= 0) return "0 mo";
  if (totalMonths < 12) return `${totalMonths} mo`;
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  return months ? `${years} yr ${months} mo` : `${years} yr`;
}

export function getExperienceBandEn(totalMonths: number): string {
  if (totalMonths <= 3) return "under 3 months";
  if (totalMonths <= 6) return "under 6 months";
  if (totalMonths < 12) return "under 1 year";
  if (totalMonths < 24) return "at least 1 year";
  if (totalMonths < 36) return "at least 2 years";
  if (totalMonths < 48) return "at least 3 years";
  if (totalMonths < 60) return "at least 4 years";
  return "at least 5 years";
}
