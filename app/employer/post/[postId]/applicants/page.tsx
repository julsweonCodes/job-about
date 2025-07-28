"use client";

import React, { useState } from "react";
import { Users, Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import BackHeader from "@/components/common/BackHeader";
import { useRouter } from "next/navigation";
import { JobPostWithRelations } from "@/types/job";
import { JobStatus, ApplicantStatus } from "@/constants/enums";
import ApplicantCard from "@/app/employer/components/ApplicantCard";
import ApplicantStatusDialog from "@/app/employer/components/ApplicantStatusDialog";

const mockJobPost: JobPostWithRelations = {
  id: "1",
  business_loc_id: "business1",
  user_id: "user1",
  title: "Server - Full Time",
  job_type: "server",
  deadline: "2024-12-31",
  work_schedule: "Full-Time",
  work_type: "Full-Time",
  job_fit_type_id_1: "fit1",
  skill_id_1: "skill1",
  wage: "15/hour",
  location: "Gangnam",
  description: "Server position at Starbucks Gangnam",
  status: JobStatus.PUBLISHED,
  applicants: [
    {
      id: "1",
      user_id: "user1",
      job_post_id: "1",
      created_at: "2024-01-15",
      name: "Sarah Johnson",
      profile_image_url:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
      description: "3 years of restaurant experience with excellent customer service skills",
      applied_date: "2024-01-15",
      status: ApplicantStatus.APPLIED,
      experience: "3 years",
      skills: ["Customer Service", "Team Work", "Fast Learner"],
    },
    {
      id: "2",
      user_id: "user2",
      job_post_id: "1",
      created_at: "2024-01-14",
      name: "Mike Chen",
      profile_image_url:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150",
      description: "Friendly server with experience in high-volume restaurants",
      applied_date: "2024-01-14",
      status: ApplicantStatus.IN_REVIEW,
      experience: "2 years",
      skills: ["Communication", "Multitasking", "POS Systems"],
    },
    {
      id: "3",
      user_id: "user3",
      job_post_id: "1",
      created_at: "2024-01-13",
      name: "Emma Davis",
      profile_image_url:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
      description: "Experienced server looking for a stable full-time position",
      applied_date: "2024-01-13",
      status: ApplicantStatus.IN_REVIEW,
      experience: "4 years",
      skills: ["Leadership", "Training", "Customer Relations"],
    },
    {
      id: "4",
      user_id: "user4",
      job_post_id: "1",
      created_at: "2024-01-12",
      name: "Alex Rodriguez",
      profile_image_url:
        "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150",
      description: "Recent hospitality graduate eager to start career in service",
      applied_date: "2024-01-12",
      status: ApplicantStatus.HIRED,
      experience: "1 year",
      skills: ["Enthusiasm", "Quick Learner", "Reliability"],
    },
    {
      id: "5",
      user_id: "user5",
      job_post_id: "1",
      created_at: "2024-01-11",
      name: "Lisa Wang",
      profile_image_url:
        "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150",
      description: "Part-time server with flexible schedule availability",
      applied_date: "2024-01-11",
      status: ApplicantStatus.REJECTED,
      experience: "1 year",
      skills: ["Flexibility", "Weekend Availability"],
    },
    {
      id: "6",
      user_id: "user6",
      job_post_id: "1",
      created_at: "2024-01-10",
      name: "David Kim",
      profile_image_url:
        "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150",
      description: "Experienced server with barista skills and morning availability",
      applied_date: "2024-01-10",
      status: ApplicantStatus.APPLIED,
      experience: "5 years",
      skills: ["Barista", "Morning Shifts", "Training Others"],
    },
    {
      id: "7",
      user_id: "user7",
      job_post_id: "1",
      created_at: "2024-01-09",
      name: "Maria Garcia",
      profile_image_url:
        "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150",
      description: "Bilingual server with strong communication and sales skills",
      applied_date: "2024-01-09",
      status: ApplicantStatus.IN_REVIEW,
      experience: "3 years",
      skills: ["Bilingual", "Sales", "Customer Service"],
    },
  ],
};

const statusTabs = [
  { key: "all", label: "All", count: 0 },
  { key: "applied", label: "Applied", count: 0 },
  { key: "in_review", label: "In Review", count: 0 },
  { key: "hired", label: "Hired", count: 0 },
  { key: "rejected", label: "Rejected", count: 0 },
];

function ReviewApplicantsPage() {
  const router = useRouter();
  const [jobPost] = useState<JobPostWithRelations>(mockJobPost);
  const [activeTab, setActiveTab] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ApplicantStatus | null>(null);
  const [applicants, setApplicants] = useState(jobPost.applicants);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}/${day}/${year}`;
  };

  const handleReviewApplicant = (applicantId: string) => {
    setSelectedApplicantId(applicantId);
    setDialogOpen(true);
    setSelectedStatus(null);
  };

  const handleSaveStatus = () => {
    if (!selectedApplicantId || !selectedStatus) return;
    setApplicants((prev) =>
      prev?.map((a) => (a.id === selectedApplicantId ? { ...a, status: selectedStatus } : a))
    );
    setDialogOpen(false);
  };

  const handleViewProfile = (applicantId: string) => {
    router.push(`/employer/post/${jobPost.id}/applicants/${applicantId}`);
  };

  const getStatusCounts = () => {
    const counts = {
      all: jobPost.applicants?.length || 0,
      applied: 0,
      in_review: 0,
      hired: 0,
      rejected: 0,
    };

    jobPost.applicants?.forEach((applicant) => {
      switch (applicant.status) {
        case ApplicantStatus.APPLIED:
          counts.applied++;
          break;
        case ApplicantStatus.IN_REVIEW:
          counts.in_review++;
          break;
        case ApplicantStatus.HIRED:
          counts.hired++;
          break;
        case ApplicantStatus.REJECTED:
          counts.rejected++;
          break;
      }
    });

    return counts;
  };

  const statusCounts = getStatusCounts();
  const appliedCount = statusCounts.applied;
  const totalCount = statusCounts.all;

  const getStatusColor = (status: ApplicantStatus) => {
    switch (status) {
      case ApplicantStatus.APPLIED:
        return "bg-amber-100 text-amber-700 border-amber-200";
      case ApplicantStatus.IN_REVIEW:
        return "bg-blue-100 text-blue-700 border-blue-200";
      case ApplicantStatus.HIRED:
        return "bg-green-100 text-green-700 border-green-200";
      case ApplicantStatus.REJECTED:
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: ApplicantStatus) => {
    switch (status) {
      case ApplicantStatus.APPLIED:
        return <Clock className="w-3 h-3" />;
      case ApplicantStatus.IN_REVIEW:
        return <Eye className="w-3 h-3" />;
      case ApplicantStatus.HIRED:
        return <CheckCircle className="w-3 h-3" />;
      case ApplicantStatus.REJECTED:
        return <XCircle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const filteredApplicants = React.useMemo(() => {
    if (!jobPost.applicants) return [];
    if (activeTab === "all") return jobPost.applicants;
    return jobPost.applicants.filter((applicant) => applicant.status === activeTab);
  }, [activeTab, jobPost.applicants]);

  const tabsWithCounts = statusTabs.map((tab) => ({
    ...tab,
    count: statusCounts[tab.key as keyof typeof statusCounts],
  }));

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <BackHeader title="Review Applicants" />

      {/* Status Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-[64px] lg:top-[78px] z-10">
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
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-6">
          {(applicants || []).map((applicant) => (
            <ApplicantCard
              key={applicant.id}
              applicant={applicant}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
              formatDate={formatDate}
              onReview={() => handleReviewApplicant(applicant.id)}
              onViewProfile={() => handleViewProfile(applicant.id)}
            />
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
                : `No applicants are currently ${activeTab.replace("_", " ")}`}
            </p>
          </div>
        )}

        {/* All Reviewed State */}
        {activeTab === "applied" &&
          filteredApplicants.length === 0 &&
          appliedCount === 0 &&
          totalCount > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">All caught up! 🎉</h3>
              <p className="text-green-700">You've reviewed all applications for this position.</p>
            </div>
          )}
      </div>

      <ApplicantStatusDialog
        open={dialogOpen}
        selectedStatus={selectedStatus}
        onSelect={(status) => setSelectedStatus(status as ApplicantStatus)}
        onSave={handleSaveStatus}
        onCancel={() => setDialogOpen(false)}
      />
    </div>
  );
}

export default ReviewApplicantsPage;
