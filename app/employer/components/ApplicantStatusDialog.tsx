import React from "react";
import { Dialog } from "@/components/common/Dialog";
import { Button } from "@/components/ui/Button";
import { ApplicantStatus } from "@/constants/enums";
import { Eye, XCircle, CheckCircle } from "lucide-react";
import Typography from "@/components/ui/Typography";

interface ApplicantStatusDialogProps {
  open: boolean;
  selectedStatus: ApplicantStatus | null;
  onSelect: (status: ApplicantStatus) => void;
  onSave: () => void;
  onCancel: () => void;
}

const statusList = [
  {
    value: ApplicantStatus.InReview,
    label: "In Review",
    icon: Eye,
    color: "border-blue-500",
    selectedBg: "bg-blue-50",
    selectedColor: "text-blue-500",
    iconColor: "text-blue-500",
  },
  {
    value: ApplicantStatus.Rejected,
    label: "Rejected",
    icon: XCircle,
    color: "border-red-500",
    selectedBg: "bg-red-50",
    selectedColor: "text-red-500",
    iconColor: "text-red-500",
  },
  {
    value: ApplicantStatus.Hired,
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
  onSelect,
  onSave,
  onCancel,
}) => {
  return (
    <Dialog open={open} onClose={onCancel} type="bottomSheet">
      <div className="flex flex-col items-start  w-full max-w-md">
        <Typography as="h2" variant="headlineMd" className="mb-2 text-left sm:text-center">
          Update Status
        </Typography>
        <Typography as="p" variant="bodySm" className="text-gray-500 text-center mb-6">
          Select the current status of the applicant.
        </Typography>
        <div className="grid grid-cols-3 gap-3 mb-6 w-full">
          {statusList.map((status) => {
            const Icon = status.icon;
            return (
              <button
                key={status.value}
                type="button"
                className={`w-full aspect-square flex flex-col items-center justify-center px-4 py-5 rounded-xl border transition-all
                  ${selectedStatus === status.value ? `${status.selectedBg} ${status.color} border-2 font-semibold` : "bg-white border-gray-200 hover:bg-gray-50"}`}
                onClick={() => onSelect(status.value)}
              >
                <Icon
                  className={`w-5 h-5 ${selectedStatus === status.value ? status.iconColor : "text-gray-300"}`}
                />
                <span
                  className={`mt-4 text-sm sm:text-base font-medium ${selectedStatus === status.value ? `${status.selectedColor} font-semibold` : "text-gray-500"}`}
                >
                  {status.label}
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex gap-3 w-full">
          <Button variant="secondary" size="lg" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="black" size="lg" onClick={onSave} disabled={!selectedStatus}>
            Save
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ApplicantStatusDialog;
