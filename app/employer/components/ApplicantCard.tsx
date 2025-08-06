import React from "react";
import { Calendar, Clock, Eye, CheckCircle, XCircle } from "lucide-react";
import { Applicant } from "@/types/job";
import { ApplicantStatus } from "@/constants/enums";
import { Button } from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import { formatYYYYMMDDtoMonthDayYear } from "@/lib/utils";
import { STORAGE_URLS } from "@/constants/storage";

interface ApplicantCardProps {
  applicant: Applicant;
  onReview?: () => void;
  onViewProfile?: () => void;
}

const ApplicantCard: React.FC<ApplicantCardProps> = ({ applicant, onReview, onViewProfile }) => {
  const statusConfig: Record<ApplicantStatus, { color: string; icon: React.ReactNode }> = {
    [ApplicantStatus.APPLIED]: {
      color: "bg-amber-100 text-amber-700 border-amber-200",
      icon: <Clock className="w-3 h-3" />,
    },
    [ApplicantStatus.IN_REVIEW]: {
      color: "bg-blue-100 text-blue-700 border-blue-200",
      icon: <Eye className="w-3 h-3" />,
    },
    [ApplicantStatus.HIRED]: {
      color: "bg-green-100 text-green-700 border-green-200",
      icon: <CheckCircle className="w-3 h-3" />,
    },
    [ApplicantStatus.REJECTED]: {
      color: "bg-red-100 text-red-700 border-red-200",
      icon: <XCircle className="w-3 h-3" />,
    },
    [ApplicantStatus.WITHDRAWN]: {
      color: "bg-gray-100 text-gray-700 border-gray-200",
      icon: <Clock className="w-3 h-3" />,
    },
  };

  const currentStatus = statusConfig[applicant.status as ApplicantStatus];
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 lg:p-6 hover:shadow-md hover:border-gray-200 transition-all duration-200 lg:hover:scale-[1.02] h-full flex flex-col">
      {/* Applicant Header */}
      <div className="flex items-start gap-4 mb-4">
        <img
          src={
            applicant.profile_image_url
              ? `${STORAGE_URLS.USER.PROFILE_IMG}${applicant.profile_image_url}`
              : `${STORAGE_URLS.USER.PROFILE_IMG}/default_profile.png` // 혹은 빈 문자열 "" 등 대체 이미지 경로
          }
          alt={applicant.name || ""}
          className="w-14 h-14 lg:w-16 lg:h-16 rounded-full object-cover border border-gray-100 shadow-sm flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <Typography as="h3" variant="headlineSm" className="mb-1 text-gray-900">
            {applicant.name}
          </Typography>
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs lg:text-sm font-medium border ${currentStatus.color}`}
            >
              {currentStatus.icon}
              <span className="capitalize">{String(applicant.status).replace("_", " ")}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Applicant Info */}
      <div className="flex-1 mb-4">
        <p className="text-sm md:text-base text-gray-600 mb-3 leading-relaxed">
          {applicant.description}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-gray-400" />
          <Typography as="span" variant="bodyXs" className="text-gray-500">
            Applied{" "}
            {applicant.applied_date ? formatYYYYMMDDtoMonthDayYear(applicant.applied_date) : ""}
          </Typography>
          <span className="text-gray-300">•</span>
          <Typography as="span" variant="bodyXs" className="text-gray-500">
            {applicant.experience} experience
          </Typography>
        </div>

        {/* Skills
        <div className="flex flex-wrap gap-2">
          {applicant.skills?.map((skill, index) => (
            <Chip
              key={index}
              asChild={true}
              size="sm"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs lg:text-sm font-medium"
            >
              <span>{skill}</span>
            </Chip>
          ))}
        </div> */}
      </div>

      {/* Action Buttons */}
      {(onReview || onViewProfile) && (
        <div className="flex gap-3 mt-auto">
          {onViewProfile && (
            <Button className="flex-1 h-10 md:h-14" variant="secondary" onClick={onViewProfile}>
              View Profile
            </Button>
          )}
          {onReview && (
            <Button className="flex-1 h-10 md:h-14" variant="default" onClick={onReview}>
              Update Status
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ApplicantCard;
