import React from "react";
import { Edit3 } from "lucide-react";
import MypageActionButtons from "./MypageActionButtons";
import { Button } from "@/components/ui/Button";

interface InfoSectionProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onEdit?: () => void;
  isEditing?: boolean;
  className?: string;
  iconClassName?: string;
  onSave?: () => void;
  onCancel?: () => void;
}

const InfoSection: React.FC<InfoSectionProps> = ({
  icon,
  title,
  subtitle,
  children,
  onEdit,
  isEditing = false,
  className = "",
  iconClassName = "",
  onSave,
  onCancel,
}) => {
  return (
    <div
      className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-white/50 p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconClassName}`}>
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-500">{subtitle}</p>
          </div>
        </div>
        {onEdit && !isEditing && (
          <Button
            onClick={onEdit}
            variant="ghost"
            size="icon"
            className="p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-200 touch-manipulation"
          >
            <Edit3 size={16} className="text-slate-600" />
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {children}

        {/* Action Buttons */}
        {isEditing && onSave && onCancel && (
          <MypageActionButtons
            onCancel={onCancel}
            onSave={onSave}
            cancelText="Cancel"
            saveText="Save Changes"
          />
        )}
      </div>
    </div>
  );
};

export default InfoSection;
