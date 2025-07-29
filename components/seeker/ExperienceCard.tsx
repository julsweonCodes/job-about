import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import Typography from "@/components/ui/Typography";
import { WORK_PERIOD_OPTIONS } from "@/constants/options";
import { getJobTypeConfig } from "@/constants/jobTypes";
import { JobType } from "@/constants/jobTypes";

interface ExperienceForm {
  company: string;
  jobType: JobType;
  startYear: string;
  workedPeriod: string;
  description: string;
}

interface ExperienceCardProps {
  experience: ExperienceForm;
  onEdit: () => void;
  onDelete: () => void;
}

export function ExperienceCard({ experience, onEdit, onDelete }: ExperienceCardProps) {
  return (
    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow">
      <div>
        <Typography as="div" className="font-bold text-gray-800 text-base mb-1">
          {experience.company}
        </Typography>
        <Typography as="div" className="text-gray-500 text-sm">
          {getJobTypeConfig(experience.jobType).name} • {experience.startYear},{" "}
          {WORK_PERIOD_OPTIONS.find((option) => option.value === experience.workedPeriod)?.label ||
            experience.workedPeriod}
        </Typography>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <button
          type="button"
          className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-indigo-500 transition-colors"
          onClick={onEdit}
          aria-label="Edit"
        >
          <Pencil className="w-5 h-5" />
        </button>
        <button
          type="button"
          className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-rose-500 transition-colors"
          onClick={onDelete}
          aria-label="Delete"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
