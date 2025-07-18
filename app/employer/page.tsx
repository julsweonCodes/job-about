"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { StatsCard } from "./components/StatsCard";
import { JobPostCard } from "./components/JobPostCard";
import { AlertBanner } from "./components/AlertBanner";
import { ProfileHeader } from "../../components/common/ProfileHeader";
import { WorkType } from "@/constants/enums";
import { Plus } from "lucide-react";

interface JobPost {
  id: string;
  title: string;
  type: WorkType;
  wage: string;
  location: string;
  dateRange: string;
  businessName: string;
  description: string;
  applicants: number;
  views: number;
  needsUpdate: boolean;
  coverImage?: string;
}

const mockJobPosts: JobPost[] = [
  {
    id: "1",
    title: "Senior Product Designer",
    type: WorkType.OnSite,
    wage: "$85,000 - $110,000",
    location: "San Francisco, CA",
    dateRange: "Jan 15 - Mar 15, 2025",
    businessName: "TechFlow Solutions",
    description:
      "Join our design team to create innovative user experiences for our flagship product. We're looking for someone passionate about user-centered design and modern design systems.",
    applicants: 18,
    views: 127,
    needsUpdate: true,
    coverImage:
      "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "2",
    title: "Marketing Specialist",
    type: WorkType.OnSite,
    wage: "$35 - $45/hour",
    location: "Remote",
    dateRange: "Feb 1 - May 1, 2025",
    businessName: "TechFlow Solutions",
    description:
      "Drive marketing campaigns and content strategy for our growing startup. Perfect opportunity for someone looking to make a real impact in a fast-paced environment.",
    applicants: 12,
    views: 89,
    needsUpdate: false,
    coverImage:
      "https://images.pexels.com/photos/3184302/pexels-photo-3184302.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "3",
    title: "Frontend Developer",
    type: WorkType.OnSite,
    wage: "$75,000 - $95,000",
    location: "Austin, TX",
    dateRange: "Mar 1 - Jun 1, 2025",
    businessName: "TechFlow Solutions",
    description:
      "Build responsive web applications using modern JavaScript frameworks. Join our engineering team and help shape the future of our platform.",
    applicants: 24,
    views: 203,
    needsUpdate: true,
  },
  {
    id: "4",
    title: "UX Researcher",
    type: WorkType.OnSite,
    wage: "$70,000 - $90,000",
    location: "Seattle, WA",
    dateRange: "Apr 1 - Jul 1, 2025",
    businessName: "TechFlow Solutions",
    description:
      "Conduct user research and usability testing to inform product decisions. Help us understand our users better and improve their experience.",
    applicants: 8,
    views: 156,
    needsUpdate: false,
    coverImage:
      "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

export default function EmployerDashboard() {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(true);
  const [jobPosts] = useState<JobPost[]>(mockJobPosts);

  const stats = {
    activeJobs: jobPosts.length,
    statusUpdateNeeded: jobPosts.filter((job) => job.needsUpdate).length,
    totalApplicants: jobPosts.reduce((sum, job) => sum + job.applicants, 0),
  };

  const handleViewJob = (id: string) => {
    // 상세 페이지 이동 등 구현
    router.push(`/employer/post/${id}`);
  };

  const handleViewApplicants = (id: string) => {
    // 지원자 목록 페이지 이동 등 구현
    router.push(`/employer/post/${id}/applicants`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <ProfileHeader />
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 relative">
        {/* Page Title */}
        <div className="pt-6 lg:pt-8 pb-6 lg:pb-8">
          <div className="text-center lg:text-left">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
            <p className="text-base lg:text-lg text-gray-600">
              Manage your job posts and track applications
            </p>
          </div>
        </div>

        {/* Alert Banner */}
        {showAlert && (
          <div className="mb-8">
            <AlertBanner
              message={`${stats.statusUpdateNeeded} job posts need status updates`}
              onClick={() => {
                router.push("/employer/pending-updates");
              }}
            />
          </div>
        )}

        {/* Stats */}
        <div className="mb-10">
          <StatsCard
            activeJobs={stats.activeJobs}
            activeApplicants={stats.totalApplicants}
            statusUpdateNeeded={stats.statusUpdateNeeded}
          />
        </div>

        {/* Job Posts Section */}
        <div className="space-y-6 lg:space-y-8 pb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Your Active Job Posts</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            {jobPosts.map((job) => (
              <JobPostCard
                key={job.id}
                job={job}
                onView={handleViewJob}
                onViewApplicants={handleViewApplicants}
              />
            ))}
          </div>
        </div>
        {/* Bottom Safe Area */}
        <div className="h-8 lg:h-12"></div>
      </div>
      {/* Floating Action Button */}
      <button
        className="fixed bottom-6 z-50 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl text-white shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200 flex items-center justify-center p-3 md:p-4"
        style={{ right: "max(calc((100vw - 1536px) / 2 + 1.5rem), 1.5rem)" }}
        onClick={() => router.push("/employer/post/create")}
        aria-label="Create Job Post"
      >
        <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </div>
  );
}
