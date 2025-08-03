import React from "react";

interface InfiniteScrollLoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: "purple" | "blue" | "green" | "gray";
  count?: number;
}

export const InfiniteScrollLoader: React.FC<InfiniteScrollLoaderProps> = ({
  className = "",
  size = "md",
  color = "purple",
  count = 3,
}) => {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const colorClasses = {
    purple: "bg-purple-600",
    blue: "bg-blue-600",
    green: "bg-green-600",
    gray: "bg-gray-600",
  };

  return (
    <div className={`mt-8 flex justify-center ${className}`}>
      <div className="flex items-center space-x-2">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}
            style={{ animationDelay: `${index * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
};
