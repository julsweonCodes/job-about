import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import { MapPin, Calendar } from "lucide-react";

export type JobCardJob = {
  id: number;
  type: string;
  title: string;
  rate?: string;
  city?: string;
  dateRange?: string;
  company?: string;
  imageUrl?: string;
  // employer용 확장 필드
  desc?: string;
  applicants?: number;
  views?: number;
};

export default function JobCard({
  job,
  isLatest = false,
  actionButtons,
}: {
  job: JobCardJob;
  isLatest?: boolean;
  actionButtons?: React.ReactNode;
}) {
  return (
    <Card
      className={`transition-all duration-300 hover:shadow-lg bg-background-primary ${isLatest ? "border-purple-200" : "border-gray-200"} h-full flex flex-col`}
    >
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex items-center justify-between gap-4 flex-1 min-h-0">
          <div className="flex-1 min-w-0">
            <Badge variant="secondary" className="text-xs font-medium mb-1">
              {job.type}
            </Badge>
            <Typography
              as="h3"
              variant="titleBold"
              className="text-lg mb-2 text-gray-900 line-clamp-2"
            >
              {job.title}
            </Typography>
            <div className="space-y-2 mb-2">
              {job.rate && job.city && (
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-semibold text-purple-600 mr-2">{job.rate}</span>
                  <MapPin className="w-3 h-3 mr-1" />
                  <span>{job.city}</span>
                </div>
              )}
              {job.dateRange && (
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{job.dateRange}</span>
                </div>
              )}
              {job.company && (
                <Typography as="div" variant="bodyXs" className="text-gray-500">
                  {job.company}
                </Typography>
              )}
              {job.desc && (
                <Typography as="div" variant="bodySm" className="text-gray-600">
                  {job.desc}
                </Typography>
              )}
              {(job.applicants !== undefined || job.views !== undefined) && (
                <div className="flex items-center gap-2 text-gray-500">
                  {job.applicants !== undefined && (
                    <Typography as="span" variant="bodyXs" className="flex items-center gap-1">
                      <span className="font-semibold">{job.applicants}</span> applicants
                    </Typography>
                  )}
                  {job.views !== undefined && (
                    <Typography as="span" variant="bodyXs" className="flex items-center gap-1">
                      <span className="font-semibold">{job.views}</span> views
                    </Typography>
                  )}
                </div>
              )}
            </div>
          </div>
          {!isLatest && job.imageUrl && (
            <img
              src={job.imageUrl}
              alt={job.title}
              className="w-auto max-w-20 aspect-square object-cover rounded-lg flex-shrink-0"
            />
          )}
        </div>
        {actionButtons ? (
          <div className="flex gap-2 mt-4 w-full mt-auto">{actionButtons}</div>
        ) : (
          <Button
            variant={isLatest ? "default" : "black"}
            size={isLatest ? "md" : "default"}
            className="w-full mt-2 mt-auto"
          >
            Apply Now
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
