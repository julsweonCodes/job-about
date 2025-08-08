import React from "react";

const ApplicantCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 lg:p-6 h-full flex flex-col animate-pulse">
      {/* Applicant Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* 프로필 이미지 */}
        <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gray-200 rounded-full flex-shrink-0"></div>

        {/* 이름과 상태 */}
        <div className="flex-1 min-w-0">
          <div className="h-5 lg:h-6 bg-gray-200 rounded w-32 lg:w-40 mb-2"></div>
          <div className="h-6 lg:h-7 bg-gray-200 rounded-full w-20 lg:w-24"></div>
        </div>
      </div>

      {/* Applicant Info */}
      <div className="flex-1 mb-4">
        {/* 설명 */}
        <div className="space-y-2 mb-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-11/12"></div>
          <div className="h-4 bg-gray-200 rounded w-10/12"></div>
        </div>

        {/* 지원 날짜와 경험 */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-3 bg-gray-200 rounded w-24 lg:w-32"></div>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="h-3 bg-gray-200 rounded w-20 lg:w-28"></div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-auto">
        <div className="flex-1 h-10 md:h-14 bg-gray-200 rounded-lg"></div>
        <div className="flex-1 h-10 md:h-14 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
};

export default ApplicantCardSkeleton;
