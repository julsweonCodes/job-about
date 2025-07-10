"use client";

import React, { useState } from "react";
import { Users, Clock, CheckCircle, XCircle, Eye, Calendar, User } from "lucide-react";
import BackHeader from "@/components/common/BackHeader";

interface Applicant {
  id: string;
  name: string;
  avatar: string;
  intro: string;
  appliedDate: string;
  status: "pending" | "shortlisted" | "interviewed" | "hired" | "rejected";
  experience: string;
  skills: string[];
}

interface JobPost {
  id: string;
  title: string;
  employmentType: string;
  businessName: string;
  applicants: Applicant[];
}

const mockJobPost: JobPost = {
  id: "1",
  title: "Server - Full Time",
  employmentType: "Full-Time",
  businessName: "Starbucks Gangnam",
  applicants: [
    {
      id: "1",
      name: "Sarah Johnson",
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
      intro: "3 years of restaurant experience with excellent customer service skills",
      appliedDate: "2024-01-15",
      status: "pending",
      experience: "3 years",
      skills: ["Customer Service", "Team Work", "Fast Learner"],
    },
    {
      id: "2",
      name: "Mike Chen",
      avatar:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150",
      intro: "Friendly server with experience in high-volume restaurants",
      appliedDate: "2024-01-14",
      status: "shortlisted",
      experience: "2 years",
      skills: ["Communication", "Multitasking", "POS Systems"],
    },
    {
      id: "3",
      name: "Emma Davis",
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
      intro: "Experienced server looking for a stable full-time position",
      appliedDate: "2024-01-13",
      status: "interviewed",
      experience: "4 years",
      skills: ["Leadership", "Training", "Customer Relations"],
    },
    {
      id: "4",
      name: "Alex Rodriguez",
      avatar:
        "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150",
      intro: "Recent hospitality graduate eager to start career in service",
      appliedDate: "2024-01-12",
      status: "hired",
      experience: "1 year",
      skills: ["Enthusiasm", "Quick Learner", "Reliability"],
    },
    {
      id: "5",
      name: "Lisa Wang",
      avatar:
        "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150",
      intro: "Part-time server with flexible schedule availability",
      appliedDate: "2024-01-11",
      status: "rejected",
      experience: "1 year",
      skills: ["Flexibility", "Weekend Availability"],
    },
    {
      id: "6",
      name: "David Kim",
      avatar:
        "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150",
      intro: "Experienced server with barista skills and morning availability",
      appliedDate: "2024-01-10",
      status: "pending",
      experience: "5 years",
      skills: ["Barista", "Morning Shifts", "Training Others"],
    },
    {
      id: "7",
      name: "Maria Garcia",
      avatar:
        "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150",
      intro: "Bilingual server with strong communication and sales skills",
      appliedDate: "2024-01-09",
      status: "shortlisted",
      experience: "3 years",
      skills: ["Bilingual", "Sales", "Customer Service"],
    },
  ],
};

const statusTabs = [
  { key: "all", label: "All", count: 0 },
  { key: "pending", label: "Pending", count: 0 },
  { key: "shortlisted", label: "Shortlisted", count: 0 },
  { key: "interviewed", label: "Interviewed", count: 0 },
  { key: "hired", label: "Hired", count: 0 },
  { key: "rejected", label: "Rejected", count: 0 },
];

function ReviewPostsPage() {
  const [jobPost] = useState<JobPost>(mockJobPost);
  const [activeTab, setActiveTab] = useState("all");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}/${day}/${year}`;
  };

  const handleReviewApplicant = (applicantId: string) => {
    console.log("Review applicant:", applicantId);
  };

  const handleViewProfile = (applicantId: string) => {
    console.log("View profile:", applicantId);
  };

  const getStatusCounts = () => {
    const counts = {
      all: jobPost.applicants.length,
      pending: 0,
      shortlisted: 0,
      interviewed: 0,
      hired: 0,
      rejected: 0,
    };

    jobPost.applicants.forEach((applicant) => {
      counts[applicant.status]++;
    });

    return counts;
  };

  const statusCounts = getStatusCounts();
  const pendingCount = statusCounts.pending;
  const totalCount = statusCounts.all;
  const reviewedCount = totalCount - pendingCount;
  const completionPercentage = totalCount > 0 ? Math.round((reviewedCount / totalCount) * 100) : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "shortlisted":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "interviewed":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "hired":
        return "bg-green-100 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-3 h-3" />;
      case "shortlisted":
        return <Eye className="w-3 h-3" />;
      case "interviewed":
        return <User className="w-3 h-3" />;
      case "hired":
        return <CheckCircle className="w-3 h-3" />;
      case "rejected":
        return <XCircle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const getActionButton = (applicant: Applicant) => {
    switch (applicant.status) {
      case "pending":
        return (
          <button
            onClick={() => handleReviewApplicant(applicant.id)}
            className="bg-[#7C3AED] hover:bg-[#6D28D9] active:bg-[#5B21B6] text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
          >
            Review
          </button>
        );
      default:
        return (
          <button
            onClick={() => handleViewProfile(applicant.id)}
            className="bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
          >
            View Profile
          </button>
        );
    }
  };

  const filteredApplicants =
    activeTab === "all"
      ? jobPost.applicants
      : jobPost.applicants.filter((applicant) => applicant.status === activeTab);

  const tabsWithCounts = statusTabs.map((tab) => ({
    ...tab,
    count: statusCounts[tab.key as keyof typeof statusCounts],
  }));

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <BackHeader title="Review Applicants" />

      {/* Status Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-[55px] lg:top-[70px] z-10">
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide py-3">
            {tabsWithCounts.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-[#7C3AED] text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    activeTab === tab.key ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applicant Cards */}
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
        <div className="lg:grid lg:grid-cols-2 lg:gap-6">
          {filteredApplicants.map((applicant) => (
            <div
              key={applicant.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 lg:p-6 mb-4 lg:mb-6 hover:shadow-md hover:border-gray-200 transition-all duration-200 lg:hover:scale-[1.02]"
            >
              {/* Applicant Header */}
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={applicant.avatar}
                  alt={applicant.name}
                  className="w-14 h-14 lg:w-16 lg:h-16 rounded-full object-cover shadow-sm flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-1">
                    {applicant.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs lg:text-sm font-medium border ${getStatusColor(applicant.status)}`}
                    >
                      {getStatusIcon(applicant.status)}
                      <span className="capitalize">{applicant.status.replace("-", " ")}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Applicant Info */}
              <div className="mb-4">
                <p className="text-sm lg:text-base text-gray-600 mb-3 leading-relaxed">
                  {applicant.intro}
                </p>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>Applied {formatDate(applicant.appliedDate)}</span>
                  <span className="text-gray-300">•</span>
                  <span>{applicant.experience} experience</span>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {applicant.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs lg:text-sm font-medium rounded-full transition-colors duration-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end">{getActionButton(applicant)}</div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredApplicants.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No applicants in this category
            </h3>
            <p className="text-gray-500">
              {activeTab === "all"
                ? "No applications have been received yet"
                : `No applicants are currently ${activeTab.replace("-", " ")}`}
            </p>
          </div>
        )}

        {/* All Reviewed State */}
        {activeTab === "pending" &&
          filteredApplicants.length === 0 &&
          pendingCount === 0 &&
          totalCount > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">All caught up! 🎉</h3>
              <p className="text-green-700">
                You've reviewed all pending applications for this position.
              </p>
            </div>
          )}
      </div>
    </div>
  );
}

export default ReviewPostsPage;
