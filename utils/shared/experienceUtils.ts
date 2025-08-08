import { WorkPeriod } from "@/constants/enums";
import { WorkExperience } from "@/types/profile";

// 각 기간 구간의 '중간값' 기준(월)으로 추정
const WORK_PERIOD_TO_MONTHS: Record<WorkPeriod, number> = {
  [WorkPeriod.SHORT_TERM]: 1,
  [WorkPeriod.UNDER_3_MONTHS]: 2,
  [WorkPeriod.UNDER_6_MONTHS]: 4,
  [WorkPeriod.SIX_TO_TWELVE_MONTHS]: 9,
  [WorkPeriod.ONE_TO_TWO_YEARS]: 18,
  [WorkPeriod.TWO_TO_THREE_YEARS]: 30,
  [WorkPeriod.THREE_TO_FIVE_YEARS]: 48,
  [WorkPeriod.FIVE_TO_SEVEN_YEARS]: 72,
  [WorkPeriod.SEVEN_TO_TEN_YEARS]: 102,
  [WorkPeriod.OVER_TEN_YEARS]: 120, // 최소치(10년)로 보수적 추정
};

export function estimateExperienceMonths(exps: Pick<WorkExperience, "work_period">[] = []): number {
  return exps.reduce((sum, exp) => {
    const m = WORK_PERIOD_TO_MONTHS[exp.work_period as WorkPeriod] ?? 0;
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

export function getExperienceLevel(
  totalMonths: number
): "beginner" | "intermediate" | "experienced" | "senior" {
  if (totalMonths < 6) return "beginner";
  if (totalMonths < 24) return "intermediate";
  if (totalMonths < 60) return "experienced";
  return "senior";
}
