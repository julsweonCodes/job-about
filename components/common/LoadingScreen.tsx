import React from "react";
import LoadingSpinner from "./LoadingSpinner";

interface LoadingScreenProps {
  message?: string;
  overlay?: boolean;
  spinnerSize?: "sm" | "md" | "lg" | "xl";
  spinnerColor?: "primary" | "white" | "gray" | "purple" | "purple-circle";
  opacity?: "light" | "medium" | "dark";
  className?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  overlay = true,
  spinnerSize = "md",
  spinnerColor = "purple-circle",
  opacity = "medium",
  className = "",
  message,
}) => {
  const content = (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <LoadingSpinner size={spinnerSize} color={spinnerColor} />
      {message !== undefined && <p className="text-gray-600 text-xs sm:text-xl">{message}</p>}
    </div>
  );

  const opacityClasses = {
    light: "bg-white/40",
    medium: "bg-white/80",
    dark: "bg-black/20",
  };

  if (overlay) {
    return (
      <div
        className={cn(
          "fixed inset-0 backdrop-blur-sm z-[9999] flex items-center justify-center",
          opacityClasses[opacity]
        )}
      >
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
