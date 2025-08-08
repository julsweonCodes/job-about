import React, { useState } from "react";
import { Tag, Users } from "lucide-react";
import { Chip } from "@/components/ui/Chip";
import { JobPostCard as JobPostCardType } from "@/types/job";
import { getLocationDisplayName } from "@/constants/location";
import { getApplicationStatusConfig, getWorkTypeConfig } from "@/utils/client/styleUtils";

interface JobPostCardProps {
  job: JobPostCardType;
  isRecommended?: boolean;
  onView: (id: string) => void;
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
      </div>

      {/* 상단: 제목/급여 + 이미지 */}
      <div className="flex items-start justify-between mb-4 min-w-0 flex-shrink-0">
        <div className="flex flex-col gap-1 flex-1 min-w-0 pr-4">
          <div className="h-5 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-xl bg-gray-200 animate-pulse flex-shrink-0 shadow-sm"></div>
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

      {/* Required Skills */}
      <div className="flex flex-col gap-2 flex-1">
        <div className="flex flex-wrap gap-2">
          <div className="h-6 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-6 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-6 w-18 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        {/* 하단 정보 스켈레톤 - 회사명/위치 */}
        <div className="flex items-center mt-auto">
          <div className="flex items-center gap-2">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const JobPostCard: React.FC<JobPostCardProps> = ({ job, isRecommended, onView }) => {
  const [imageError, setImageError] = useState(false);

  const { label: typeLabel, className: typeClass } = getWorkTypeConfig(job.workType);

  const defaultImage = "/images/img-default-part-time-work.png";

  const handleImageError = () => {
    setImageError(true);
  };

  const getImageSrc = () => {
    if (imageError || !job.logoImage) {
      return defaultImage;
    }
    return job.logoImage;
  };

  return (
    <div
      className={`rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col p-5 lg:p-8 cursor-pointer relative ${
        isRecommended
          ? "bg-white border-2 border-blue-300 shadow-md"
          : "bg-white border border-gray-100 shadow-sm"
      }`}
      onClick={() => onView(job.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onView(job.id);
        }
      }}
    >
      {/* 지원자 수 - 카드 우측 상단 */}
      {job.applicants > 0 && (
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm border border-gray-200 z-10">
          <Users className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
          <span className="text-xs sm:text-sm font-medium text-gray-700">{job.applicants}</span>
        </div>
      )}
      {/* 칩들 - 왼쪽 상단 */}
      <div className="flex items-center gap-2 mb-4">
        {/* 지원 상태 표시 - WorkType chip과 나란히 */}
        {job.applicationStatus &&
          (() => {
            const statusConfig = getApplicationStatusConfig(job.applicationStatus);
            return statusConfig ? (
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusConfig.style}`}
              >
                {statusConfig.text}
              </span>
            ) : null;
          })()}
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
      {/*  위치, 기간 */}
      <div className="space-y-2 mb-5 flex-shrink-0">
        <div className="flex items-center gap-2">
          {/* <Calendar className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" /> */}
          <span className="text-gray-600 text-xs sm:text-sm font-medium">{job.workSchedule}</span>
        </div>
      </div>
      <div className="flex flex-col gap-4 flex-1">
        {/* Required Skills - 모든 job에서 표시 */}
        {job.requiredSkills && job.requiredSkills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {job.requiredSkills.map((skill, index) => (
              <div
                key={`${job.id}-skill-${skill.id}-${index}`}
                className={
                  "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border border-gray-100 shadow-sm"
                }
              >
                <Tag className="w-4 h-4 mr-2" />
                {skill.name_en}
              </div>
            ))}
          </div>
        )}

        {/* 하단 정보 - 회사명/위치/게시일 */}
        <div className="flex items-center mt-auto">
          <div className="flex flex-wrap items-center gap-2 text-gray-500 text-xs sm:text-sm font-medium">
            <span>{job.businessName}</span>
            <span className="text-gray-400">•</span>
            <span>{getLocationDisplayName(job.location)}</span>
            {job.daysAgo !== undefined && (
              <>
                <span className="text-gray-400">•</span>
                <span>
                  {job.daysAgo === 0
                    ? "Today"
                    : job.daysAgo === 1
                      ? "1 day ago"
                      : `${job.daysAgo} days ago`}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
