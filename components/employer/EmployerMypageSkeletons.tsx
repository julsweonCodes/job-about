import React from "react";

export const InfoSectionSkeleton = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg shadow-slate-200/50 border border-white/50 overflow-hidden">
    <div className="p-5 sm:p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 rounded animate-pulse w-32 sm:w-40" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-48 sm:w-56" />
        </div>
        <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
      </div>
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg shadow-slate-200/50 border border-white/50">
    <div className="p-5 sm:p-8">
      <div className="flex flex-col items-center text-center sm:flex-row sm:text-left gap-4 sm:gap-6">
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-32 sm:w-48" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full max-w-xs" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 max-w-sm" />
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const WorkplacePhotosSkeleton = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg shadow-slate-200/50 border border-white/50 p-5 sm:p-6">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="flex-1">
        <div className="h-5 bg-gray-200 rounded animate-pulse w-32 mb-1" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-48" />
      </div>
    </div>
    <div className="flex gap-2 overflow-x-auto pb-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex-shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-gray-200 animate-pulse" />
        </div>
      ))}
      <div className="flex-shrink-0">
        <div className="w-24 h-24 sm:w-28 sm:h-28 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 animate-pulse" />
      </div>
    </div>
  </div>
);

export const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-[#FAFAFA]">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-5">
      <div className="px-1">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mb-4" />
        <ProfileSkeleton />
      </div>

      <div className="px-1">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-40 mb-4 flex" />
        <div className="space-y-4 sm:space-y-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <InfoSectionSkeleton key={index} />
          ))}
        </div>
      </div>

      <div className="px-1">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-36 mb-4" />
        <WorkplacePhotosSkeleton />
      </div>
    </div>
  </div>
);
