import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0~100
  className?: string;
}

export default function ProgressBar({ value, className }: ProgressBarProps) {
  return (
    <div className={cn("w-full bg-gray-200 rounded-full h-2 overflow-hidden", className)}>
      <div
        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700 ease-out"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
