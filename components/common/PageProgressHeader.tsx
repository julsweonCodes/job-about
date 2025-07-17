import React from "react";
import Typography from "@/components/ui/Typography";
import ProgressBar from "@/components/common/ProgressBar";
import PageHeader from "@/components/common/PageHeader";

interface PageProgressHeaderProps {
  title: string;
  progress: number;
  progressLabel?: string;
  leftIcon?: React.ReactNode;
  onClickLeft?: () => void;
  className?: string;
}

const PageProgressHeader: React.FC<PageProgressHeaderProps> = ({
  title,
  progress,
  progressLabel = "Complete",
  leftIcon,
  onClickLeft,
  className,
}) => {
  return (
    <div
      className={`sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 shadow-sm ${className || ""}`}
    >
      <div className="flex flex-col max-w-4xl mx-auto px-2 md:px-4 py-4 gap-3">
        <PageHeader title={title} leftIcon={leftIcon} onClickLeft={onClickLeft} />

        {/* Progress Bar */}
        <div className="flex flex-col px-5 md:px-0">
          <div className="flex items-center justify-between mb-3">
            <Typography
              as="h3"
              variant="bodySm"
              className="font-semibold text-gray-700 tracking-wide"
            >
              Job Post Setup
            </Typography>
            <Typography as="span" variant="bodySm" className="font-medium text-gray-500">
              {progress}% {progressLabel}
            </Typography>
          </div>

          <ProgressBar value={progress} className="h-2 mb-2" />
        </div>
      </div>
    </div>
  );
};

export default PageProgressHeader;
