import React from "react";
import { Check } from "lucide-react";
import { getJobTypeConfig, JobType } from "@/constants/jobTypes";

interface JobTypeChipProps {
  jobType: JobType;
  isSelected: boolean;
  onClick: () => void;
}

const JobTypeChip: React.FC<JobTypeChipProps> = ({ jobType, isSelected, onClick }) => {
  const Icon = getJobTypeConfig(jobType).icon;

  return (
    <button
      onClick={onClick}
      className={`
        group relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] text-left w-full min-h-[72px]
        ${
          isSelected
            ? "bg-blue-50 border-blue-200 shadow-md shadow-blue-100/50"
            : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-md hover:bg-gray-50/50"
        }
      `}
    >
      {/* Icon Container */}
      <div
        className={`
        flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200
        ${
          isSelected
            ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
            : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
        }
      `}
      >
        {Icon && <Icon className="w-6 h-6" />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3
          className={`
          font-semibold text-base mb-1 transition-colors duration-200
          ${isSelected ? "text-blue-900" : "text-gray-900"}
        `}
        >
          {getJobTypeConfig(jobType).name}
        </h3>
        <p
          className={`
          text-sm transition-colors duration-200
          ${isSelected ? "text-blue-600" : "text-gray-500"}
        `}
        >
          {getJobTypeConfig(jobType).category}
        </p>
      </div>

      {/* Selection Indicator */}
      <div
        className={`
        flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-200 flex items-center justify-center
        ${
          isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300 group-hover:border-gray-400"
        }
      `}
      >
        {isSelected && <Check className="w-4 h-4 text-white" />}
      </div>

      {/* Hover Glow Effect */}
      <div
        className={`
        absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none
        ${isSelected ? "bg-blue-500/5" : "bg-gray-500/5"}
      `}
      />
    </button>
  );
};

export default JobTypeChip;
