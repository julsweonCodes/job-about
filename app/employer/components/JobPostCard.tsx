import React, { useState } from "react";
import { MapPin, Calendar, CircleDollarSign, Tag, Users } from "lucide-react";
import Typography from "@/components/ui/Typography";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { JobPost } from "@/types/employer";
import { $Enums } from "@prisma/client";
import { formatDescription } from "@/utils/client/textUtils";

interface JobPostCardProps {
  job: JobPost;
  onView: (id: string) => void;
  onViewApplicants?: (id: string) => void;
  isDraft?: boolean;
}

// JobPostCard 스켈레톤 컴포넌트
export const JobPostCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col p-5 lg:p-8">
      {/* 상단: 썸네일 + 제목/타입 */}
      <div className="flex items-center gap-4 mb-4 min-w-0 flex-shrink-0">
        <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-xl bg-gray-200 animate-pulse flex-shrink-0 shadow-sm"></div>
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="h-5 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* 상태 칩들 */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
      </div>

      {/* 위치, 기간, 급여 */}
      <div className="space-y-2 mb-5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export const JobPostCard: React.FC<JobPostCardProps> = ({
  job,
  onView,
  onViewApplicants,
  isDraft = false,
}) => {
  const [imageError, setImageError] = useState(false);

  // WorkType 설정
  const getWorkTypeConfig = (workType: $Enums.WorkType) => {
    switch (workType) {
      case $Enums.WorkType.ON_SITE:
        return {
          label: "On-Site",
          className: "bg-blue-100 text-blue-800 hover:bg-blue-100/80",
        };
      case $Enums.WorkType.REMOTE:
        return {
          label: "Remote",
          className: "bg-green-100 text-green-800 hover:bg-green-100/80",
        };
      default:
        return {
          label: "Hybrid",
          className: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white",
        };
    }
  };

  const { label: typeLabel, className: typeClass } = getWorkTypeConfig(
    job.type || $Enums.WorkType.ON_SITE
  );

  const defaultImage = "/images/img-default-part-time-work.png";

  const handleImageError = () => {
    setImageError(true);
  };

  const getImageSrc = () => {
    if (imageError || !job.coverImage) {
      return defaultImage;
    }
    return job.coverImage;
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col p-5 lg:p-8">
      {/* 상단: 썸네일 + 제목/타입 */}
      <div className="flex items-center gap-4 mb-4 min-w-0 flex-shrink-0">
        <div className="relative w-14 h-14 lg:w-20 lg:h-20 rounded-xl flex-shrink-0 overflow-hidden bg-gray-100 shadow-sm">
          <img
            src={getImageSrc()}
            alt={job.title}
            className="w-full h-full object-cover rounded-xl border border-gray-100"
            onError={handleImageError}
          />
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-gray-900 text-md text-lg sm:text-xl font-bold">{job.title}</span>
          </div>
          <span className="text-gray-500 text-md text-sm sm:text-lg font-medium">
            {job.businessName}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        {isDraft && (
          <Chip
            size="sm"
            className="bg-orange-100 text-orange-800 hover:bg-orange-100/80 font-semibold"
          >
            Draft
          </Chip>
        )}
        <Chip size="sm" className={`${typeClass} font-semibold`}>
          {typeLabel}
        </Chip>
      </div>

      {/* 위치, 기간, 급여 */}
      <div className="space-y-2 mb-5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" />
          <span className="text-gray-600 text-xs sm:text-sm font-medium">
            {job.strt_date} - {job.deadline_date}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" />
          <span className="text-gray-600 text-xs sm:text-sm font-medium">{job.location}</span>
        </div>

        <div className="flex items-center gap-2">
          <CircleDollarSign className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" />
          <span className="text-gray-600 text-xs sm:text-sm font-medium">{job.wage}</span>
        </div>
      </div>

      {/* Required Skills */}
      <div className="flex flex-col gap-2">{/* 여기에 필요한 스킬 정보가 있다면 표시 */}</div>

      {/* 지원자 통계 및 버튼 */}
      {!isDraft && (
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <div className="flex items-center space-x-6">
            <div className="flex items-center text-sm lg:text-base text-gray-600">
              <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mr-2">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-semibold text-gray-900">{job.applicants}</span>
              <span className="ml-1 text-gray-600">applicants</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex space-x-3 flex-shrink-0">
        {isDraft ? (
          <>
            <Button variant="secondary" className="h-10 md:h-14" onClick={() => onView(job.id)}>
              Continue Editing
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" className="h-10 md:h-14" onClick={() => onView(job.id)}>
              View Details
            </Button>
            {onViewApplicants && (
              <Button
                variant="default"
                className="h-10 md:h-14"
                onClick={() => onViewApplicants(job.id)}
              >
                View Applicants
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
