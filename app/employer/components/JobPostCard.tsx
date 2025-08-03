import React from "react";
import { Users } from "lucide-react";
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
        <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-xl bg-gray-200 animate-pulse flex-shrink-0"></div>
        <div className="flex flex-col gap-1 mb-1 flex-1 min-w-0">
          <div className="h-5 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* 회사명, 위치, 기간 */}
      <div className="space-y-2 mb-5 flex-shrink-0">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-200 rounded mr-2 animate-pulse"></div>
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-200 rounded mr-2 animate-pulse"></div>
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Description */}
      <div className="flex-1 mb-6 min-h-0">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
      </div>

      {/* 지원자 통계 */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-200 rounded-full mr-2 animate-pulse"></div>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex space-x-3 flex-shrink-0">
        <div className="h-10 md:h-14 bg-gray-200 rounded-lg animate-pulse w-full"></div>
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
  // WorkType에 따른 라벨/색상 분기 (예시)
  const typeLabel =
    job.type === $Enums.WorkType.ON_SITE
      ? "On-Site"
      : job.type === $Enums.WorkType.REMOTE
        ? "Remote"
        : "Hybrid";
  const typeClass =
    job.type === $Enums.WorkType.ON_SITE
      ? "bg-blue-100 text-blue-800 hover:bg-blue-100/80"
      : job.type === $Enums.WorkType.REMOTE
        ? "bg-green-100 text-green-800 hover:bg-green-100/80"
        : "bg-gray-100 text-gray-800 hover:bg-gray-100/80";

  const defaultImage = "/images/img-default-part-time-work.png";

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col p-5 lg:p-8">
      {/* 상단: 썸네일 + 제목/타입 */}
      <div className="flex items-center gap-4 mb-4 min-w-0 flex-shrink-0">
        <div className="relative w-14 h-14 lg:w-20 lg:h-20 rounded-xl flex-shrink-0 overflow-hidden bg-gray-100">
          <img
            src={job.coverImage || defaultImage}
            alt={job.title}
            className="w-full h-full object-cover rounded-xl border-2 border-gray-200"
          />
        </div>

        <div className="flex flex-col gap-1 mb-1 flex-1 min-w-0">
          <Typography as="h3" variant="headlineSm" className="font-bold text-gray-900">
            {job.title}
          </Typography>
          <div className="flex items-center gap-2">
            <Chip size="sm" className={`${typeClass} font-semibold`}>
              {typeLabel}
            </Chip>
            {isDraft && (
              <Chip
                size="sm"
                className="bg-orange-100 text-orange-800 hover:bg-orange-100/80 font-semibold"
              >
                Draft
              </Chip>
            )}
          </div>
        </div>
      </div>

      {/* 회사명, 위치, 기간 */}
      <div className="space-y-2 mb-5 flex-shrink-0">
        <div className="flex items-center text-sm text-gray-700">
          <span className="mr-2">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path
                d="M12 2C7.03 2 3 6.03 3 11c0 5.25 7.5 11 9 11s9-5.75 9-11c0-4.97-4.03-9-9-9Zm0 13a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"
                stroke="#9CA3AF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <Typography as="span" variant="bodySm" className="text-gray-700">
            {job.location}
          </Typography>
        </div>
        <div className="flex items-center text-sm text-gray-700">
          <span className="mr-2">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path
                d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Z"
                stroke="#9CA3AF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <Typography as="span" variant="bodySm" className="text-gray-700">
            {job.strt_date} - {job.deadline_date}
          </Typography>
        </div>
      </div>

      {/* Description - 유연한 높이 설정 */}
      <div className="flex-1 mb-6 min-h-0">
        <p
          className="text-sm lg:text-base text-gray-700 leading-relaxed"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {formatDescription(job.description)}
        </p>
      </div>

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
            <Button variant="default" className="h-10 md:h-14" onClick={() => onView(job.id)}>
              Publish
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
