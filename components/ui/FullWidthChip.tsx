import React from "react";
import { Chip } from "@/components/ui/Chip";

interface FullWidthChipProps {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  color?: "teal" | "green" | "blue" | "purple" | "orange" | "pink";
}

export function FullWidthChip({
  children,
  selected = false,
  onClick,
  disabled = false,
  className = "",
  color = "teal",
}: FullWidthChipProps) {
  const colorClasses = {
    teal: selected
      ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white border-teal-500 shadow-lg shadow-teal-200"
      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300",
    green: selected
      ? "bg-gradient-to-r from-green-500 to-green-600 text-white border-green-500 shadow-lg shadow-green-200"
      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300",
    blue: selected
      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-500 shadow-lg shadow-blue-200"
      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300",
    purple: selected
      ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-500 shadow-lg shadow-purple-200"
      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300",
    orange: selected
      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-500 shadow-lg shadow-orange-200"
      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300",
    pink: selected
      ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white border-pink-500 shadow-lg shadow-pink-200"
      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300",
  };

  return (
    <Chip
      size="lg"
      selected={selected}
      onClick={onClick}
      disabled={disabled}
      className={`px-2 w-full sm:py-6 rounded-2xl font-semibold text-sm sm:text-base transition-all duration-300 border-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0 ${colorClasses[color]} ${className}`}
    >
      {children}
    </Chip>
  );
}
