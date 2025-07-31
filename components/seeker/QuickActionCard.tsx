import React from "react";
import { LucideIcon, ChevronRight } from "lucide-react";

interface QuickActionCardProps {
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  title: string;
  description: string;
  onClick: () => void;
  className?: string;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon: Icon,
  iconBgColor,
  iconColor,
  title,
  description,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`bg-white/80 w-full backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-white/50 p-6 hover:bg-slate-50 transition-colors duration-200 ${className}`}
    >
      <div className="w-full flex items-center gap-4 rounded-xl p-2">
        <div className={`w-12 h-12 ${iconBgColor} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div className="flex-1 text-left">
          <h3 className="font-semibold text-slate-900 text-base">{title}</h3>
          <p className="text-sm text-slate-600">{description}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-400" />
      </div>
    </button>
  );
};
