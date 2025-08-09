import React from "react";
import { cn } from "@/lib/utils";
import { getApplicationStatusConfig } from "@/utils/client/styleUtils";

interface ApplicantStatusChipProps {
  status?: string;
  className?: string;
}

function extractTextColorFromClass(className?: string): string | undefined {
  if (!className) return undefined;
  if (className.includes("text-white")) return "#ffffff";
  if (className.includes("text-black")) return "#000000";
  if (className.includes("text-amber")) return "#b45309"; // amber-700
  if (className.includes("text-blue")) return "#1d4ed8"; // blue-700
  if (className.includes("text-emerald")) return "#065f46"; // emerald-700
  if (className.includes("text-green")) return "#166534"; // green-800
  if (className.includes("text-red")) return "#b91c1c"; // red-700
  if (className.includes("text-gray")) return "#374151"; // gray-700
  if (className.includes("text-slate")) return "#0f172a"; // slate-900
  if (className.includes("text-indigo")) return "#3730a3"; // indigo-700
  return undefined;
}

const ApplicantStatusChip: React.FC<ApplicantStatusChipProps> = ({ status, className }) => {
  const cfg = getApplicationStatusConfig(status || undefined);
  if (!cfg) return null;

  // combined classes to parse color
  const combined = `${cfg.style} ${className ?? ""}`.trim();
  const color = extractTextColorFromClass(combined);

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center justify-center rounded-full border px-3 h-7 text-xs font-semibold whitespace-nowrap",
        cfg.style,
        className
      )}
      style={color ? { color } : undefined}
    >
      {cfg.text}
    </span>
  );
};

export default ApplicantStatusChip;
