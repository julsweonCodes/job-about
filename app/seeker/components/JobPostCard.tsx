import React, { useState } from "react";
import { MapPin, Calendar, CircleDollarSign, Tag, Star } from "lucide-react";
import { WorkType } from "@/constants/enums";
import Typography from "@/components/ui/Typography";
import { Chip } from "@/components/ui/Chip";

import { ApplicantStatus } from "@/constants/enums";

export interface JobPost {
  id: string;
  title: string;
  workType: WorkType;
  wage: string;
  location: string;
  workSchedule: string;
  businessName: string;
  description: string;
  applicants: number;
  views: number;
  logoImage?: string;
  pending?: number; // Added for pending applications
  applicationStatus?: string; //
  requiredSkills?: Array<{
    id: number;
    name_ko: string;
    name_en: string;
    category_ko: string;
    category_en: string;
  }>;
}

interface JobPostCardProps {
  job: JobPost;
  isRecommended?: boolean;
  onView: (id: string) => void;
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

      {/* Required Skills */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <div className="h-6 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-6 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-6 w-18 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export const JobPostCard: React.FC<JobPostCardProps> = ({ job, isRecommended, onView }) => {
  const [imageError, setImageError] = useState(false);

  // 지원 상태에 따른 스타일 설정
  // 지원 상태 설정
  const getApplicationStatusConfig = (status?: string) => {
    if (!status) return null;

    switch (status) {
      case "applied":
        return {
          text: "Applied",
          style: "bg-amber-100 text-amber-700 border-amber-200",
        };
      case "in_review":
        return {
          text: "In Review",
          style: "bg-blue-100 text-blue-700 border-blue-200",
        };
      case "hired":
        return {
          text: "Hired",
          style: "bg-emerald-100 text-emerald-700 border-emerald-200",
        };
      case "rejected":
        return {
          text: "Rejected",
          style: "bg-red-100 text-red-700 border-red-200",
        };
      case "withdrawn":
        return {
          text: "Withdrawn",
          style: "bg-gray-100 text-gray-700 border-gray-200",
        };
      default:
        return {
          text: "Applied",
          style: "bg-gray-100 text-gray-700 border-gray-200",
        };
    }
  };

  // WorkType 설정
  const getWorkTypeConfig = (workType: WorkType) => {
    switch (workType) {
      case WorkType.ON_SITE:
        return {
          label: "On-Site",
          className: "bg-blue-100 text-blue-800 hover:bg-blue-100/80",
        };
      case WorkType.REMOTE:
        return {
          label: "Remote",
          className: "bg-green-100 text-green-800 hover:bg-green-100/80",
        };
      default:
        return {
          label: "Hybrid",
          className: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white ",
        };
    }
  };

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
      className={`rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col p-5 lg:p-8 cursor-pointer ${
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
      {/* 상단: 썸네일 + 제목/타입 */}
      <div className="flex items-center gap-4 mb-4 min-w-0 flex-shrink-0">
        <div className="relative w-14 h-14 lg:w-20 lg:h-20 rounded-xl flex-shrink-0 overflow-hidden bg-gray-100 shadow-sm">
          <img
            src={getImageSrc()}
            alt={job.title}
            className="w-full h-full object-cover rounded-xl  border border-gray-100 "
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

      {/*  위치, 기간 */}
      <div className="space-y-2 mb-5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" />
          <span className="text-gray-600 text-xs sm:text-sm font-medium">{job.workSchedule}</span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" />
          <span className="text-gray-600 text-xs sm:text-sm font-medium">{job.location}</span>
        </div>

        {/* wage */}
        <div className="flex items-center gap-2">
          <CircleDollarSign className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" />
          <span className="text-gray-600 text-xs sm:text-sm font-medium">{job.wage}</span>
        </div>
      </div>

      {/* Description - 유연한 높이 설정 */}
      {/* <div className="flex-1 mb-6 min-h-0">
        <p
          className="text-sm lg:text-base text-gray-700 leading-relaxed mb-3"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            minHeight: "70px",
          }}
        >
          {formatDescription(job.description)}
        </p>
      </div> */}
      <div className="flex flex-col gap-2">
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
      </div>

      {/* 지원자 통계 및 버튼 */}
      {/* <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div className="flex items-center space-x-6">
          <div className="flex items-center text-sm lg:text-base text-gray-600">
            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mr-2">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <span className="font-semibold text-gray-900">{job.applicants}</span>
            <span className="ml-1 text-gray-600">applicants</span>
          </div>
        </div>
      </div> */}

      {/* <div className="flex space-x-3 flex-shrink-0">
        <Button
          variant={isRecommended ? "default" : "secondary"}
          className="h-10 md:h-14"
          onClick={() => onView(job.id)}
        >
          View Details
        </Button>
      </div> */}
    </div>
  );
};
