import React from "react";
import { cn } from "@/lib/utils";

interface DDayChipProps {
  deadline: string; // YYYY-MM-DD
  className?: string;
}

function calculateDDay(deadlineDate: string): number {
  const deadline = new Date(deadlineDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);
  const diffTime = deadline.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function getLocalDDayConfig(deadlineDate: string) {
  const dDay = calculateDDay(deadlineDate);
  if (dDay < 0) {
    return {
      text: "Overdue",
      bgClass: "bg-red-100",
      borderClass: "border-red-200",
      textColor: "#7f1d1d", // red-900
    };
  }
  if (dDay === 0) {
    return {
      text: "D-day",
      bgClass: "bg-red-100",
      borderClass: "border-red-200",
      textColor: "#7f1d1d",
    };
  }
  if (dDay <= 3) {
    return {
      text: `D-${dDay}`,
      bgClass: "bg-amber-100",
      borderClass: "border-amber-200",
      textColor: "#7c2d12", // amber-900
    };
  }
  return {
    text: `D-${dDay}`,
    bgClass: "bg-slate-100",
    borderClass: "border-slate-200",
    textColor: "#0f172a", // slate-900
  };
}

export const DDayChip: React.FC<DDayChipProps> = ({ deadline, className }) => {
  const cfg = getLocalDDayConfig(deadline);
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center justify-center rounded-full border px-3 h-7 text-xs font-semibold whitespace-nowrap",
        cfg.bgClass,
        cfg.borderClass,
        className
      )}
      style={{ color: cfg.textColor }}
    >
      {cfg.text}
    </span>
  );
};

export default DDayChip;
