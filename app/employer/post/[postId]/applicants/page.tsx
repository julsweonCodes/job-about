"use client";

import React, { useState } from "react";
import { Users, Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import BackHeader from "@/components/common/BackHeader";
import { useRouter, useSearchParams } from "next/navigation";
import { JobPostWithRelations } from "@/types/job";
import { JobStatus, ApplicantStatus } from "@/constants/enums";
import ApplicantCard from "@/app/employer/components/ApplicantCard";
import ApplicantStatusDialog from "@/app/employer/components/ApplicantStatusDialog";
import { useParams } from "next/navigation";
import { useEmployerJobPostAppList } from "@/hooks/employer/useEmployerDashboard";

const statusTabs = [
  { key: "all", label: "All", count: 0 },
  { key: "applied", label: "Applied", count: 0 },
  { key: "in_review", label: "In Review", count: 0 },
  { key: "hired", label: "Hired", count: 0 },
  { key: "rejected", label: "Rejected", count: 0 },
];

function ReviewApplicantsPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params?.postId as string;
  // const [jobPost] = useState<JobPostWithRelations>(mockJobPost);
  const {jobPostAppList, loadingStates}= useEmployerJobPostAppList(postId);
  const [activeTab, setActiveTab] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ApplicantStatus | null>(null);
  const [applicants, setApplicants] = useState(jobPostAppList); //useState(jobPost.applicants);

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
      prev?.map((a) => (a.application_id.toString() === selectedApplicantId ? { ...a, status: selectedStatus } : a))
    );
    setDialogOpen(false);
  };

  const handleViewProfile = (applicantId: string) => {
    router.push(`/employer/post//applicants/${applicantId}`);
  };

  const getStatusCounts = () => {
    const counts = {
      all: jobPostAppList?.length || 0,
      applied: 0,
      in_review: 0,
      hired: 0,
      rejected: 0,
    };
    console.log(jobPostAppList);
    jobPostAppList?.forEach((applicant) => {
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
    if (!jobPostAppList) return [];
    if (activeTab === "all") return jobPostAppList;
    return jobPostAppList.filter((applicant) => applicant.status === activeTab);
  }, [activeTab, jobPostAppList]);

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
        {jobPostAppList && jobPostAppList.length > 0 ? (
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-6">
          {jobPostAppList.map( (applicant) => (
            <ApplicantCard
              key={applicant.application_id}
              applicant={applicant}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
              formatDate={formatDate}
              onReview={() => handleReviewApplicant(applicant.application_id.toString())}
              onViewProfile={() => handleViewProfile(applicant.application_id.toString())}
            />
          ))}
        </div>) : (
          <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-6"></div>
        )}

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
