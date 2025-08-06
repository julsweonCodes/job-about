import React from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary";
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  size = "md",
  className = "",
}: EmptyStateProps) {
  const sizeClasses = {
    sm: {
      container: "py-8",
      icon: "w-12 h-12",
      iconSize: "w-6 h-6",
      title: "text-lg",
      description: "text-sm",
      maxWidth: "max-w-sm",
    },
    md: {
      container: "py-12",
      icon: "w-16 h-16",
      iconSize: "w-8 h-8",
      title: "text-lg",
      description: "text-sm",
      maxWidth: "max-w-md",
    },
    lg: {
      container: "py-16",
      icon: "w-20 h-20",
      iconSize: "w-10 h-10",
      title: "text-xl",
      description: "text-base",
      maxWidth: "max-w-md",
    },
  };

  const variantClasses = {
    primary: "bg-purple-600 text-white hover:bg-purple-700",
    secondary: "border border-gray-300 text-gray-700 hover:bg-gray-50",
  };

  const classes = sizeClasses[size];

  return (
    <div className={`text-center px-4 ${classes.container} ${className}`}>
      <div className={`${classes.maxWidth} mx-auto`}>
        {/* 아이콘 */}
        {Icon && (
          <div className="mb-4">
            <div
              className={`${classes.icon} mx-auto bg-gray-100 rounded-full flex items-center justify-center`}
            >
              <Icon className={`${classes.iconSize} text-gray-400`} />
            </div>
          </div>
        )}

        {/* 제목 */}
        <h3 className={`${classes.title} font-semibold text-gray-900 mb-2`}>{title}</h3>

        {/* 설명 */}
        <p
          className={`${classes.description} text-gray-500 mb-6 leading-relaxed`}
          dangerouslySetInnerHTML={{ __html: description }}
        />

        {/* 액션 버튼들 */}
        {(primaryAction || secondaryAction) && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {primaryAction && (
              <button
                onClick={primaryAction.onClick}
                className={`px-6 py-3 rounded-lg transition-colors font-medium ${
                  variantClasses[primaryAction.variant || "primary"]
                }`}
              >
                {primaryAction.label}
              </button>
            )}
            {secondaryAction && (
              <button
                onClick={secondaryAction.onClick}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                {secondaryAction.label}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
