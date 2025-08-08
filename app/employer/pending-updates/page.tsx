"use client";
import React, { useState } from "react";
import { Clock, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import BackHeader from "@/components/common/BackHeader";
import { useEmployerUrgentJobPosts } from "@/hooks/employer/useEmployerDashboard";
import LoadingScreen from "@/components/common/LoadingScreen";
import UrgentJobPostCard from "./components/UrgentJobPostCard";
import { PAGE_URLS } from "@/constants/api";

function ReviewPostsPage() {
  const router = useRouter();
  const { urgentJobPosts, loadingStates } = useEmployerUrgentJobPosts();
  const [searchQuery, setSearchQuery] = useState("");

  const handleViewApplicants = (jobId: string) => {
    router.push(PAGE_URLS.EMPLOYER.POST.APPLICANTS(jobId));
  };

  const handleViewDetail = (jobId: string) => {
    router.push(PAGE_URLS.EMPLOYER.POST.DETAIL(jobId));
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
            <UrgentJobPostCard
              key={jobPost.id}
              jobPost={jobPost}
              onViewDetail={handleViewDetail}
              onViewApplicants={handleViewApplicants}
            />
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
