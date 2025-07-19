import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "white" | "gray" | "purple" | "purple-circle";
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = "md", className }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-12 h-12 sm:w-[100px] sm:h-[100px]",
    lg: "w-12 h-12 sm:w-[120px] sm:h-[120px]",
    xl: "w-16 h-16 sm:w-[140px] sm:h-[140px]",
  };

  // 커스텀 원형 스피너
  // 원의 둘레 = 2 * π * r = 2 * π * 10 = 62.83
  const circumference = 2 * Math.PI * 10;
  const quarterLength = circumference / 4; // 약 15.7
  const strokeWidth = size === "sm" ? 2 : 2.5;

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <svg
        className="animate-spin w-full h-full"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 회색 배경 원 */}
        <circle cx="12" cy="12" r="10" stroke="#e5e7eb" strokeWidth={strokeWidth} fill="none" />
        {/* 보라색 포인트 원 (정확히 1/4) */}
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="#8b5cf6"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${quarterLength} ${circumference - quarterLength}`}
          strokeDashoffset="0"
          style={{
            transformOrigin: "center",
            transform: "rotate(-90deg)",
          }}
        />
      </svg>
    </div>
  );
};

export default LoadingSpinner;
