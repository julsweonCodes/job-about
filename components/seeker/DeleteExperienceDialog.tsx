import React from "react";
import BaseDialog from "@/components/common/BaseDialog";
import { Button } from "@/components/ui/Button";

interface DeleteExperienceDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  companyName: string;
}

export const DeleteExperienceDialog: React.FC<DeleteExperienceDialogProps> = ({
  open,
  onClose,
  onConfirm,
  companyName,
}) => {
  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title="Delete Experience"
      size="sm"
      type="bottomSheet"
      actions={
        <div className="flex gap-3 w-full">
          <Button variant="secondary" size="lg" onClick={onClose} className="w-full">
            Cancel
          </Button>
          <Button onClick={onConfirm} className="w-full" variant="red" size="lg">
            Delete
          </Button>
        </div>
      }
    >
      <div className="text-center py-6">
        <p className="text-sm text-gray-600 leading-relaxed text-sm sm:text-base">
          Are you sure you want to delete your experience at{" "}
          <span className="font-semibold text-gray-900">{companyName}</span>? This action cannot be
          undone.
        </p>
      </div>
    </BaseDialog>
  );
};
