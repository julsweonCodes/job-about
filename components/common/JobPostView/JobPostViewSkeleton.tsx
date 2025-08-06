"use client";
import React from "react";

const JobPostViewSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gray-50 font-pretendard">
    <div className="max-w-6xl mx-auto px-5 lg:px-6">
      {/* Job Header Skeleton */}
      <div className="py-6 lg:py-8">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gray-200 rounded-3xl animate-pulse flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="space-y-3">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
            </div>
          </div>
        </div>
      </div>

      {/* Job Description Skeleton */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-32" />
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-4 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* Job Details Skeleton */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-24" />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start space-x-4">
                <div className="w-11 h-11 bg-gray-200 rounded-xl animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills & Personality Skeleton */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-40" />
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
              <div className="h-5 bg-gray-200 rounded animate-pulse w-32" />
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-8 bg-gray-200 rounded-full animate-pulse w-24" />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
              <div className="h-5 bg-gray-200 rounded animate-pulse w-36" />
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-8 bg-gray-200 rounded-full animate-pulse w-28" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Workplace Photos Skeleton */}
      <div className="mb-8">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mb-6" />
        <div className="mb-8">
          <div className="w-full h-64 lg:h-80 bg-gray-200 rounded-3xl animate-pulse" />
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="w-24 h-24 bg-gray-200 rounded-xl animate-pulse flex-shrink-0"
            />
          ))}
        </div>
      </div>

      {/* Employer Info Skeleton */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-36" />
        </div>
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 border border-indigo-100">
          <div className="mb-6">
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-4 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center mb-4">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse mr-2" />
              <div className="h-5 bg-gray-200 rounded animate-pulse w-40" />
            </div>
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-8 bg-gray-200 rounded-full animate-pulse w-32" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Action Button Skeleton */}
    <div className="lg:hidden px-4 py-6 bg-white border-t border-gray-100 sticky bottom-0 z-10">
      <div className="h-14 bg-gray-200 rounded-2xl animate-pulse" />
      <div className="h-4 bg-gray-200 rounded animate-pulse w-48 mx-auto mt-3" />
    </div>

    <div className="hidden lg:block max-w-6xl mx-auto px-6 pb-12">
      <div className="h-16 bg-gray-200 rounded-3xl animate-pulse" />
      <div className="h-5 bg-gray-200 rounded animate-pulse w-56 mx-auto mt-4" />
    </div>
  </div>
);

export default JobPostViewSkeleton;
