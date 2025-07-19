import React from "react";
import LoadingSpinner from "./LoadingSpinner";

interface LoadingScreenProps {
  message?: string;
  overlay?: boolean;
  spinnerSize?: "sm" | "md" | "lg" | "xl";
  spinnerColor?: "primary" | "white" | "gray" | "purple" | "purple-circle";
  className?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  overlay = true,
  spinnerSize = "md",
  spinnerColor = "purple-circle",
  className = "",
}) => {
  const content = (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <LoadingSpinner size={spinnerSize} color={spinnerColor} />
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[9999] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return <div className="flex items-center justify-center min-h-[200px]">{content}</div>;
};

// cn 함수가 없을 경우를 대비한 fallback
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default LoadingScreen;
