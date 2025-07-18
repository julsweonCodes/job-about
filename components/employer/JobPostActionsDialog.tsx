import * as React from "react";
import { Dialog } from "@/components/common/Dialog";
import { Button } from "@/components/ui/Button";
import { Edit, Eye, EyeOff, X } from "lucide-react";
import { JobStatus } from "@/constants/enums";
import Typography from "../ui/Typography";

// Action Button Component
interface ActionButtonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

function ActionButton({ icon, title, description, onClick }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 rounded-xl transition-colors border border-gray-200"
    >
      {icon}
      <div className="flex-1">
        <div className="text-sm font-medium md:text-base text-gray-900">{title}</div>
        <div className="text-xs md:text-base text-gray-500">{description}</div>
      </div>
    </button>
  );
}

interface JobPost {
  id: string;
  title: string;
  status: JobStatus;
  // 기타 필요한 속성들...
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
    // TODO: API call to update job post status
    const newStatus =
      jobPost.status === JobStatus.Published ? JobStatus.Closed : JobStatus.Published;
    onStatusChange(newStatus);
    onClose();
  };

  const handleEdit = () => {
    // TODO: Navigate to edit page
    onEdit();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} type="bottomSheet" size="md">
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex flex-col items-start  gap-3">
          <Typography as="h2" variant="headlineMd" className="text-left sm:text-center">
            Job Post Actions
          </Typography>
          <Typography as="p" variant="bodySm" className="text-gray-500 text-center">
            Select the current status of the job post.
          </Typography>
        </div>
        <div className="flex flex-col gap-3">
          {/* Status Change Button */}
          <ActionButton
            icon={
              jobPost.status === JobStatus.Published ? (
                <EyeOff className="w-5 h-5 text-red-500" />
              ) : (
                <Eye className="w-5 h-5 text-green-600" />
              )
            }
            title={jobPost.status === JobStatus.Published ? "Close Job Post" : "Open Job Post"}
            description={
              jobPost.status === JobStatus.Published
                ? "Stop accepting new applications"
                : "Start accepting applications"
            }
            onClick={handleStatusChange}
          />

          {/* Edit Job Post Button */}
          <ActionButton
            icon={<Edit className="w-5 h-5 text-gray-600" />}
            title="Edit Job Post"
            description="Modify job details and requirements"
            onClick={handleEdit}
          />
        </div>

        {/* Footer */}
        <div>
          <Button variant="secondary" size="lg" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
