import React from "react";
import { LANGUAGE_LEVEL_OPTIONS } from "@/constants/options";

interface LanguageLevelSelectorProps {
  value: string | null;
  onChange: (level: string) => void;
  className?: string;
}

const LanguageLevelSelector: React.FC<LanguageLevelSelectorProps> = ({
  value,
  onChange,
  className = "",
}) => {
  return (
    <div className={`grid grid-cols-1 gap-3 ${className}`}>
      {LANGUAGE_LEVEL_OPTIONS.map((option) => {
        const isSelected = value === option.label;

        return (
          <button
            key={option.value}
            onClick={() => onChange(option.label)}
            className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
              isSelected
                ? "border-purple-500 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-md"
                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`font-medium text-base ${
                  isSelected ? "text-purple-700" : "text-gray-700"
                }`}
              >
                {option.label}
              </span>
              {isSelected && (
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default LanguageLevelSelector;
