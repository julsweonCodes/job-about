import * as React from "react";
import { Dialog } from "@/components/common/Dialog";
import { JobStatus } from "@/constants/enums";

interface JobPost {
  id: string;
  title: string;
  status: JobStatus;
}

interface JobPostActionsDialogProps {
  open: boolean;
  onClose: () => void;
  jobPost: JobPost;
  onStatusChange: (status: JobStatus) => void;
  onEdit: () => void;
}

export function JobPostActionsDialog({
  open,
  onClose,
  jobPost,
  onStatusChange,
  onEdit,
}: JobPostActionsDialogProps) {
  const handleStatusChange = () => {
    const newStatus =
      jobPost.status === JobStatus.PUBLISHED ? JobStatus.CLOSED : JobStatus.PUBLISHED;
    onStatusChange(newStatus);
    onClose();
  };

  const handleEdit = () => {
    onEdit();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} type="alert" size="sm" showCloseButton>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Job Post Actions</h3>
          <p className="text-sm sm:text-base text-gray-500">Choose what you'd like to do</p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleEdit}
            className="w-full p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 text-left"
          >
            <div className="font-medium text-gray-900">Edit Job Post ✏️</div>
            <div className="text-sm text-gray-500 mt-1">Modify details and requirements</div>
          </button>

          <button
            onClick={handleStatusChange}
            className="w-full p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 text-left"
          >
            <div className="font-medium text-gray-900">
              {jobPost.status === JobStatus.PUBLISHED ? "Close Job Post ❌" : "Open Job Post ✅"}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {jobPost.status === JobStatus.PUBLISHED
                ? "Stop accepting applications"
                : "Start accepting applications"}
            </div>
          </button>
        </div>
      </div>
    </Dialog>
  );
}
