import React from "react";
import { Edit3, Trash2 } from "lucide-react";

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
    <div className="p-4 bg-slate-50 rounded-lg relative group">
      <div className="absolute top-2 right-2 flex gap-1">
        <button
          onClick={() => onEdit(index, experience)}
          className="p-1 bg-white rounded-full shadow-sm hover:bg-slate-50 transition-colors duration-200"
        >
          <Edit3 size={14} className="text-slate-600" />
        </button>
        {onDelete && (
          <button
            onClick={() => onDelete(index)}
            className="p-1 bg-white rounded-full shadow-sm hover:bg-red-50 transition-colors duration-200"
          >
            <Trash2 size={14} className="text-red-600" />
          </button>
        )}
      </div>
      <h4 className="font-medium text-slate-900">{experience.company}</h4>
      <p className="text-sm text-slate-600">{experience.jobType}</p>
      <p className="text-xs text-slate-500">
        {experience.startYear} ~ {experience.workedPeriod}
      </p>
      {experience.description && (
        <p className="text-xs text-slate-500 mt-2">{experience.description}</p>
      )}
    </div>
  );
};
