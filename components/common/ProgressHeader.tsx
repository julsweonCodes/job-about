import Typography from "@/components/ui/Typography";
import ProgressBar from "@/components/common/ProgressBar";

interface ProgressHeaderProps {
  completionPercentage: number;
  title: string;
  className?: string;
}

export default function ProgressHeader({
  completionPercentage,
  title,
  className = "",
}: ProgressHeaderProps) {
  return (
    <div
      className={`sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 shadow-sm ${className}`}
    >
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <Typography
            as="h3"
            variant="bodySm"
            className="font-semibold text-gray-700 tracking-wide"
          >
            {title}
          </Typography>
          <Typography as="span" variant="bodySm" className="font-medium text-gray-500">
            {Math.round(completionPercentage)}% Complete
          </Typography>
        </div>
        <ProgressBar value={completionPercentage} className="h-2 md:h-3" />
      </div>
    </div>
  );
}
