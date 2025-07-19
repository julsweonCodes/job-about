import React from "react";

interface ActionButtonsProps {
  onCancel: () => void;
  onSave: () => void;
  showCancel?: boolean;
  showSave?: boolean;
  cancelText?: string;
  saveText?: string;
  className?: string;
}

const ActionButtons = ({
  onCancel,
  onSave,
  showCancel = true,
  showSave = true,
  cancelText = "Cancel",
  saveText = "Save Changes",
  className = "",
}: ActionButtonsProps) => {
  if (!showCancel && !showSave) return null;

  return (
    <div className={`flex gap-2 justify-end ${className}`}>
      {showCancel && (
        <button
          onClick={onCancel}
          className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-200 hover:shadow-xl touch-manipulation active:scale-[0.98]"
        >
          <span className="text-sm sm:text-base">{cancelText}</span>
        </button>
      )}
      {showSave && (
        <button
          onClick={onSave}
          className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl shadow-purple-500/25 hover:shadow-purple-500/30 touch-manipulation active:scale-[0.98]"
        >
          <span className="text-sm sm:text-base">{saveText}</span>
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
