import React from "react";

const ApplicantCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-6 animate-pulse">
      {/* Header - 프로필 정보 */}
      <div className="flex items-center gap-4 mb-4">
        {/* 프로필 이미지 */}
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>

        {/* 이름과 날짜 */}
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>

      {/* 지원 정보 */}
      <div className="space-y-3 mb-4">
        {/* 지원 직무 */}
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>

        {/* 경험 */}
        <div className="h-3 bg-gray-200 rounded w-4/5"></div>

        {/* 위치 */}
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>

      {/* 액션 버튼들 */}
      <div className="flex gap-2">
        <div className="h-8 bg-gray-200 rounded-full w-20"></div>
        <div className="h-8 bg-gray-200 rounded-full w-24"></div>
      </div>
    </div>
  );
};

export default ApplicantCardSkeleton;
