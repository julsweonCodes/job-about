"use client";
import React, { useEffect, useState } from "react";
import { MapPin, Calendar, Building2, Users, Clock, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import BackHeader from "@/components/common/BackHeader";
import { getLocationDisplayName } from "@/constants/location";
import { WorkType } from "@/constants/enums";
import { fromPrismaWorkType } from "@/types/enumMapper";
import { useEmployerUrgentJobPosts } from "@/hooks/employer/useEmployerDashboard";
import LoadingScreen from "@/components/common/LoadingScreen";

function ReviewPostsPage() {
  const router = useRouter();
  const { urgentJobPosts, loadingStates, error } = useEmployerUrgentJobPosts();
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    console.log(urgentJobPosts);
  }, [urgentJobPosts]);
  const handleViewApplicants = (jobId: string) => {
    router.push(`/employer/post/${jobId}/applicants`);
  };

  const handleViewDetail = (jobId: string) => {
    router.push(`/employer/post/${jobId}`);
  };

  const getTotalPendingApplicants = () => {
    return urgentJobPosts.reduce((total, post) => total + post.pendingReviewCnt, 0);
  };

  const filteredJobPosts = urgentJobPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPending = getTotalPendingApplicants();

  const gettypeColor = (type: string) => {
    switch (type) {
      case WorkType.ON_SITE:
        return "bg-green-100 text-green-700";
      case WorkType.HYBRID:
        return "bg-blue-100 text-blue-700";
      case WorkType.REMOTE:
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      {loadingStates.urgentJobPosts && <LoadingScreen overlay={true} opacity="light" />}
      <BackHeader title="Update Application Status" />

      {/* Status Banner */}
      {totalPending > 10 && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-6xl mx-auto px-4 lg:px-6 py-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <p className="text-sm lg:text-base text-amber-800">
                <span className="font-semibold">{totalPending} applications</span> need your
                attention
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by job title, business, or location..."
            className="w-full px-4 py-3 pl-10 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Job Posts List */}
      <div className="max-w-6xl mx-auto px-4 lg:px-6 pb-6">
        <div className="lg:grid lg:grid-cols-2 lg:gap-6">
          {filteredJobPosts.map((jobPost) => (
            <div
              key={jobPost.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4 lg:mb-6 hover:shadow-md hover:border-gray-200 transition-all duration-200 lg:hover:scale-[1.02]"
            >
              {/* Job Header */}
              <div className="p-5 lg:p-6">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={jobPost.coverImage}
                    alt={jobPost.title}
                    className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl object-cover shadow-sm flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2 truncate">
                      {jobPost.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs lg:text-sm font-medium ${gettypeColor(jobPost.type ? fromPrismaWorkType(jobPost.type) : "")}`}
                      >
                        {jobPost.type}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Job Details */}
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-2 text-sm lg:text-base text-gray-600">
                    <Building2 className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                    <span className="font-medium">{jobPost.businessName}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm lg:text-base text-gray-600">
                    <MapPin className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                    <span>{getLocationDisplayName(jobPost.location)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm lg:text-base text-gray-600">
                    <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                    <span>{jobPost.strt_date} - {jobPost.deadline_date}</span>
                  </div>
                </div>

                {/* Applicant Stats */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-5">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-500" />
                    <span className="text-sm lg:text-base font-medium text-gray-700">
                      {jobPost.totalApplicationsCnt} Total Applications
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span className="text-sm lg:text-base font-semibold text-amber-700">
                      {jobPost.pendingReviewCnt} Pending
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleViewDetail(jobPost.id)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 py-3 lg:py-4 px-4 rounded-xl font-semibold text-sm lg:text-base transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                  >
                    <span>View Details</span>
                  </button>
                  <button
                    onClick={() => handleViewApplicants(jobPost.id)}
                    className="flex-1 bg-[#7C3AED] hover:bg-[#6D28D9] active:bg-[#5B21B6] text-white py-3 lg:py-4 px-4 rounded-xl font-semibold text-sm lg:text-base transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                  >
                    <span>View Applicants</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredJobPosts.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No job posts found</h3>
            <p className="text-gray-500">
              {searchQuery
                ? "Try adjusting your search terms"
                : "No job posts with pending applications"}
            </p>
          </div>
        )}

        {/* All Caught Up State */}
        {totalPending === 0 && filteredJobPosts.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center mt-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-green-900 mb-2">All caught up! 🎉</h3>
            <p className="text-green-700">
              You've reviewed all pending applications across your job posts.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewPostsPage;
