import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getJobTypeName, getWorkPeriodLabel } from "@/utils/client/enumDisplayUtils";

interface Experience {
  company: string;
  jobType: string;
  startYear: string;
  workedPeriod: string;
  workType: string;
  description: string;
}

interface ExperienceCardProps {
  experience: Experience;
  index: number;
  onEdit: (index: number, experience: Experience) => void;
  onDelete?: (index: number) => void;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({
  experience,
  index,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-semibold text-slate-900">{experience.company}</h4>
          <p className="text-sm text-slate-600">{getJobTypeName(experience.jobType)}</p>
          <p className="text-xs text-slate-500">
            {experience.startYear} ~ {getWorkPeriodLabel(experience.workedPeriod)}
          </p>
          {experience.description && (
            <p className="text-sm text-slate-700 mt-2">{experience.description}</p>
          )}
        </div>
        <div className="flex gap-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(index, experience)}
            className="p-2 h-8 w-8"
          >
            <Edit className="h-4 w-4" />
          </Button>
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(index)}
              className="p-2 h-8 w-8 text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
