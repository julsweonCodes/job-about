import React, { useState } from "react";
import { Calendar, Users } from "lucide-react";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { UrgentClientJobPost } from "@/types/client/employer";
import { getJobTypeName } from "@/utils/client/enumDisplayUtils";
import { getWorkTypeConfig } from "@/utils/client/styleUtils";
import { getDDayConfig } from "@/utils/client/dateUtils";

interface UrgentJobPostCardProps {
  jobPost: UrgentClientJobPost;
  onViewDetail: (id: string) => void;
  onViewApplicants: (id: string) => void;
}

export default function UrgentJobPostCard({
  jobPost,
  onViewDetail,
  onViewApplicants,
}: UrgentJobPostCardProps) {
  const [imageError, setImageError] = useState(false);

  const { label: typeLabel, className: typeClass } = getWorkTypeConfig(jobPost.type);

  const defaultImage = "/images/img-default-part-time-work.png";

  const handleImageError = () => {
    setImageError(true);
  };

  const getImageSrc = () => {
    if (imageError || !jobPost.coverImage) {
      return defaultImage;
    }
    return jobPost.coverImage;
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col p-5 lg:p-8 relative">
      {/* 지원자 수 - 카드 우측 상단 */}
      {jobPost.totalApplicationsCnt > 0 && (
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm border border-gray-200 z-10">
          <Users className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
          <span className="text-xs sm:text-sm font-medium text-gray-700">
            {jobPost.totalApplicationsCnt}
          </span>
        </div>
      )}

      {/* 칩들 - 왼쪽 상단 */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {/* D-day 칩 */}
        {jobPost.deadline_date &&
          (() => {
            const dDayConfig = getDDayConfig(jobPost.deadline_date);
            return (
              <Chip size="sm" className={`${dDayConfig.className} font-semibold`}>
                {dDayConfig.text}
              </Chip>
            );
          })()}

        <Chip size="sm" className={`${typeClass} font-semibold`}>
          {typeLabel}
        </Chip>
      </div>

      {/* 상단: 제목/급여 + 이미지 */}
      <div className="flex flex-col gap-3 mb-4 min-w-0 flex-shrink-0">
        {/* 제목과 JobType */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-gray-900 text-md text-lg sm:text-xl font-bold break-words">
                {jobPost.title}
              </span>
              {jobPost.jobType && (
                <span className="text-sm text-gray-500 font-medium flex-shrink-0">
                  • {getJobTypeName(jobPost.jobType)}
                </span>
              )}
            </div>
            <span className="text-gray-500 text-md text-sm sm:text-base font-medium">
              <span className="text-gray-700 font-bold">${jobPost.wage}</span>/hour
            </span>
          </div>

          <div className="relative w-12 h-12 lg:w-16 lg:h-16 rounded-xl flex-shrink-0 bg-gray-100 shadow-sm">
            <img
              src={getImageSrc()}
              alt={jobPost.title}
              className="w-full h-full object-cover rounded-xl border border-gray-100"
              onError={handleImageError}
            />
          </div>
        </div>
      </div>

      {/* 위치, 기간 */}
      <div className="space-y-2 mb-5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" />
          <span className="text-gray-600 text-xs sm:text-sm font-medium">
            {jobPost.strt_date} - {jobPost.deadline_date}
          </span>
        </div>
      </div>

      {/* Description - 1줄만 표시 */}
      <div className="flex flex-col gap-4 flex-1">
        {jobPost.description && (
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
              {jobPost.description}
            </p>
          </div>
        )}
      </div>

      {/* Urgent 특화 섹션 - Applicant Stats */}
      <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl mb-5 border border-amber-200">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-medium text-amber-800">
            {jobPost.totalApplicationsCnt} Total Applications
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
          <span className="text-sm font-semibold text-amber-700">
            {jobPost.pendingReviewCnt} Pending
          </span>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex space-x-3 flex-shrink-0">
        <Button
          variant="secondary"
          className="h-12 md:h-14"
          onClick={() => onViewDetail(jobPost.id)}
        >
          View Details
        </Button>
        <Button
          variant="default"
          className="h-12 md:h-14"
          onClick={() => onViewApplicants(jobPost.id)}
          disabled={jobPost.totalApplicationsCnt === 0}
        >
          View Applicants
        </Button>
      </div>
    </div>
  );
}
