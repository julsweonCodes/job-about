import React from "react";
import { Dialog } from "@/components/common/Dialog";
import { Button } from "@/components/ui/Button";
import { ApplicantStatus } from "@/constants/enums";
import { Eye, XCircle, CheckCircle } from "lucide-react";

interface ApplicantStatusDialogProps {
  open: boolean;
  selectedStatus: ApplicantStatus | null;
  currentStatus?: ApplicantStatus | null;
  onSelect: (status: ApplicantStatus) => void;
  onSave: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const statusList = [
  {
    value: ApplicantStatus.IN_REVIEW,
    label: "In Review",
    icon: Eye,
    color: "border-blue-500",
    selectedBg: "bg-blue-50",
    selectedColor: "text-blue-500",
    iconColor: "text-blue-500",
  },
  {
    value: ApplicantStatus.REJECTED,
    label: "Rejected",
    icon: XCircle,
    color: "border-red-500",
    selectedBg: "bg-red-50",
    selectedColor: "text-red-500",
    iconColor: "text-red-500",
  },
  {
    value: ApplicantStatus.HIRED,
    label: "Hired",
    icon: CheckCircle,
    color: "border-green-500",
    selectedBg: "bg-green-50",
    selectedColor: "text-green-500",
    iconColor: "text-green-500",
  },
];

const ApplicantStatusDialog: React.FC<ApplicantStatusDialogProps> = ({
  open,
  selectedStatus,
  currentStatus,
  onSelect,
  onSave,
  onCancel,
  isLoading = false,
}) => {
  return (
    <Dialog open={open} onClose={onCancel} type="bottomSheet">
      <div className="flex flex-col w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-left mb-8">
          <h2 className="mb-3 text-gray-900 font-bold text-xl sm:text-2xl">Update Status</h2>
          <p className="text-gray-500 text-sm sm:text-base">
            Select the new status of the application.
          </p>
        </div>

        {/* Status Options */}
        <div className="grid grid-cols-3 gap-4 mb-8 w-full">
          {statusList.map((status) => {
            const Icon = status.icon;
            const isSelected = selectedStatus === status.value;
            return (
              <button
                key={status.value}
                type="button"
                className={`group relative w-full aspect-square flex flex-col items-center justify-center px-3 py-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  isSelected
                    ? `${status.selectedBg} ${status.color} shadow-lg scale-105`
                    : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-md"
                }`}
                onClick={() => onSelect(status.value)}
              >
                {/* Background glow effect for selected */}
                {isSelected && (
                  <div
                    className={`absolute inset-0 rounded-2xl ${status.selectedBg} opacity-20`}
                  ></div>
                )}

                {/* Icon */}
                <div
                  className={`relative z-10 p-3 rounded-full transition-all duration-300 ${
                    isSelected
                      ? `${status.selectedBg} shadow-sm`
                      : "bg-gray-50 group-hover:bg-gray-100"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 transition-all duration-300 ${
                      isSelected ? status.iconColor : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                </div>

                {/* Label */}
                <span
                  className={`relative z-10 mt-3 text-sm font-semibold transition-all duration-300 ${
                    isSelected ? status.selectedColor : "text-gray-600 group-hover:text-gray-800"
                  }`}
                >
                  {status.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 w-full">
          <Button
            variant="secondary"
            size="lg"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 h-12 font-semibold"
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            size="lg"
            onClick={onSave}
            disabled={!selectedStatus || isLoading || selectedStatus === currentStatus}
            className="flex-1 h-12 font-semibold"
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ApplicantStatusDialog;
