import React from "react";
import { Edit, Trash2, Building2, Calendar } from "lucide-react";
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
    <div className="group bg-white rounded-xl border border-slate-100 p-3 sm:p-5 hover:shadow-md hover:border-slate-200 transition-all duration-200 hover:scale-[1.01] sm:hover:scale-[1.02]">
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
          {/* Job Title */}
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex-shrink-0"></div>
            <h4 className="font-bold text-slate-900 text-base sm:text-lg tracking-tight truncate">
              {getJobTypeName(experience.jobType)}
            </h4>
          </div>

          {/* Company & Period */}
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center gap-1.5 sm:gap-2 text-slate-600">
              <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base truncate">
                {experience.company}
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-slate-500 text-xs sm:text-sm">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
              <span className="truncate">
                {experience.startYear} ~ {getWorkPeriodLabel(experience.workedPeriod)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1 ml-2 sm:ml-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(index, experience)}
            className="p-1.5 sm:p-2 h-7 w-7 sm:h-8 sm:w-8 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-600" />
          </Button>
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(index)}
              className="p-1.5 sm:p-2 h-7 w-7 sm:h-8 sm:w-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Description - flex 컨테이너 밖으로 이동 */}
      {experience.description && (
        <div className="mt-3 sm:mt-4">
          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed bg-slate-50 rounded-lg p-2.5 sm:p-3 border-l-4 border-slate-200 line-clamp-3 w-full">
            {experience.description}
          </p>
        </div>
      )}
    </div>
  );
};
