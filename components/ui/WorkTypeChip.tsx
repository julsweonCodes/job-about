import React from "react";
import { cn } from "@/lib/utils";

interface WorkTypeChipProps {
  label: string;
  className?: string; // caller passes bg/text classes
}

function extractTextColorFromClass(className?: string): string | undefined {
  if (!className) return undefined;
  // explicit overrides
  if (className.includes("text-white")) return "#ffffff";
  if (className.includes("text-black")) return "#000000";
  // common colors used in project
  if (className.includes("text-green")) return "#166534"; // green-800
  if (className.includes("text-emerald")) return "#065f46"; // emerald-700
  if (className.includes("text-blue")) return "#1d4ed8"; // blue-700
  if (className.includes("text-indigo")) return "#3730a3"; // indigo-700
  if (className.includes("text-slate")) return "#0f172a"; // slate-900
  if (className.includes("text-gray")) return "#111827"; // gray-900
  return undefined;
}

export const WorkTypeChip: React.FC<WorkTypeChipProps> = ({ label, className }) => {
  const color = extractTextColorFromClass(className) ?? "#111827";
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center justify-center rounded-full border px-3 h-7 text-xs font-semibold whitespace-nowrap",
        className
      )}
      style={{ color }}
    >
      {label}
    </span>
  );
};

export default WorkTypeChip;
