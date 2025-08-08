import React, { useState } from "react";
import { Calendar, Users } from "lucide-react";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { ClientJobPost } from "@/types/client/employer";
import { WorkType } from "@/constants/enums";
import { getWorkTypeConfig } from "@/utils/client/styleUtils";

// D-day 계산 함수
const calculateDDay = (deadlineDate: string): number => {
  const deadline = new Date(deadlineDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);

  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

interface JobPostCardProps {
  job: ClientJobPost;
  onView: (id: string) => void;
  onViewApplicants?: (id: string) => void;
  isDraft?: boolean;
}

// JobPostCard 스켈레톤 컴포넌트
export const JobPostCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col p-5 lg:p-8 relative">
      {/* 지원자 수 스켈레톤 - 카드 우측 상단 */}
      <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full shadow-sm z-10">
        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* 칩들 스켈레톤 - 왼쪽 상단 */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="h-6 w-12 bg-gray-200 rounded-full animate-pulse"></div>
      </div>

      {/* 상단: 제목/급여 + 이미지 */}
      <div className="flex items-start justify-between mb-4 min-w-0 flex-shrink-0">
        <div className="flex flex-col gap-1 flex-1 min-w-0 pr-4">
          <div className="h-5 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-xl bg-gray-200 animate-pulse flex-shrink-0 shadow-sm"></div>
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

      {/* Description 스켈레톤 */}
      <div className="flex flex-col gap-4 flex-1">
        <div className="flex-1 mb-6 min-h-0">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
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

  const { label: typeLabel, className: typeClass } = getWorkTypeConfig(job.type);

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
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col p-5 lg:p-8 relative">
      {/* 지원자 수 - 카드 우측 상단 */}
      {job.applicants > 0 && (
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm border border-gray-200 z-10">
          <Users className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
          <span className="text-xs sm:text-sm font-medium text-gray-700">{job.applicants}</span>
        </div>
      )}
      {/* 칩들 - 왼쪽 상단 */}
      <div className="flex items-center gap-2 mb-4">
        {/* D-day 칩 */}
        {!isDraft &&
          job.deadline_date &&
          (() => {
            const dDay = calculateDDay(job.deadline_date);
            let chipStyle = "";
            let dDayText = "";

            if (dDay < 0) {
              chipStyle = "bg-red-100 text-red-800 hover:bg-red-100/80";
              dDayText = "마감";
            } else if (dDay === 0) {
              chipStyle = "bg-red-100 text-red-800 hover:bg-red-100/80";
              dDayText = "D-day";
            } else if (dDay <= 3) {
              chipStyle = "bg-orange-100 text-orange-800 hover:bg-orange-100/80";
              dDayText = `D-${dDay}`;
            } else {
              chipStyle = "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
              dDayText = `D-${dDay}`;
            }

            return (
              <Chip size="sm" className={`${chipStyle} font-semibold`}>
                {dDayText}
              </Chip>
            );
          })()}
        {isDraft && (
          <Chip size="sm" className="bg-gray-100 text-gray-800 hover:bg-gray-100/80 font-semibold">
            Draft
          </Chip>
        )}
        <Chip size="sm" className={`${typeClass} font-semibold`}>
          {typeLabel}
        </Chip>
      </div>

      {/* 상단: 제목/급여 + 이미지 */}
      <div className="flex items-start justify-between mb-4 min-w-0 flex-shrink-0">
        <div className="flex flex-col gap-2 flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-900 text-md text-lg sm:text-xl font-bold">{job.title}</span>
          </div>
          <span className="text-gray-500 text-md text-sm sm:text-base font-medium">
            <span className="text-gray-700 font-bold">${job.wage}</span>/hour
          </span>
        </div>

        <div className="relative w-14 h-14 lg:w-20 lg:h-20 rounded-xl flex-shrink-0 bg-gray-100 shadow-sm">
          <img
            src={getImageSrc()}
            alt={job.title}
            className="w-full h-full object-cover rounded-xl border border-gray-100"
            onError={handleImageError}
          />
        </div>
      </div>

      {/* 위치, 기간 */}
      <div className="space-y-2 mb-5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" />
          <span className="text-gray-600 text-xs sm:text-sm font-medium">
            {job.strt_date} - {job.deadline_date}
          </span>
        </div>
      </div>

      {/* Description - 1줄만 표시 */}
      <div className="flex flex-col gap-4 flex-1">
        {job.description && (
          <div className="flex-1 mb-6 min-h-0">
            <p
              className="text-sm lg:text-base text-gray-700 leading-relaxed mb-3"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                minHeight: "20px",
              }}
            >
              {job.description}
            </p>
          </div>
        )}
      </div>

      {/* 버튼 */}
      <div className="flex space-x-3 flex-shrink-0">
        {isDraft ? (
          <>
            <Button variant="secondary" className="h-12 md:h-14" onClick={() => onView(job.id)}>
              Continue Editing
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" className="h-12 md:h-14" onClick={() => onView(job.id)}>
              View Details
            </Button>
            {onViewApplicants && (
              <Button
                variant="default"
                className="h-12 md:h-14"
                onClick={() => onViewApplicants(job.id)}
                disabled={job.applicants === 0}
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
