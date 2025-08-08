import React from "react";

export default function UrgentJobPostCardSkeleton() {
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
      <div className="flex flex-col gap-3 mb-4 min-w-0 flex-shrink-0">
        {/* 제목과 JobType */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl bg-gray-200 animate-pulse flex-shrink-0 shadow-sm"></div>
        </div>
      </div>

      {/* 위치, 기간 */}
      <div className="space-y-2 mb-5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-4 sm:w-5 h-4 sm:h-5 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Description 스켈레톤 */}
      <div className="flex flex-col gap-4 flex-1">
        <div className="flex-1 mb-6 min-h-0">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Urgent 특화 섹션 - Applicant Stats 스켈레톤 */}
      {/* <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl mb-5 border border-amber-200">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-amber-200 rounded animate-pulse"></div>
          <div className="h-4 w-32 bg-amber-200 rounded animate-pulse"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-amber-300 rounded-full animate-pulse"></div>
          <div className="h-4 w-20 bg-amber-200 rounded animate-pulse"></div>
        </div>
      </div> */}

      {/* 버튼 스켈레톤 */}
      <div className="flex space-x-3 flex-shrink-0">
        <div className="flex-1 h-12 md:h-14 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="flex-1 h-12 md:h-14 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    </div>
  );
}
