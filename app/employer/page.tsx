"use client";

import React, { useState } from "react";
import { Briefcase, Users, SquarePen, UserRound, AlertTriangle } from "lucide-react";
import { Dialog } from "@/components/common/Dialog";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Typography from "@/components/ui/Typography";
import PageHeader from "@/components/common/PageHeader";
import JobCard, { JobCardJob } from "@/components/common/JobCard";
import { useRouter } from "next/navigation";

export default function EmployerPage() {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Frontend Developer",
      company: "Tech Corp",
      location: "Seoul",
      type: "Full-time",
      salary: "$50,000 - $70,000",
      postedDate: "2024-01-15",
      applications: 12,
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg-Hu63xpLSz-T8LeMQrBt09rk4fhAkts_EQ&s",
    },
    {
      id: 2,
      title: "UX Designer",
      company: "Tech Corp",
      location: "Remote",
      type: "Contract",
      salary: "$40,000 - $60,000",
      postedDate: "2024-01-10",
      applications: 8,
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_vguO_Tb6WmaoO95UhQL7YGkMORACrcgR2w&s",
    },
  ]);

  const [showJobForm, setShowJobForm] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    location: "",
    type: "",
    salary: "",
    requirements: "",
    imageUrl: "",
  });

  const handleAddJob = () => {
    const newJob = {
      id: Date.now(),
      ...jobForm,
      company: "Tech Corp",
      postedDate: new Date().toISOString().split("T")[0],
      applications: 0,
      imageUrl: jobForm.imageUrl || "https://randomuser.me/api/portraits/men/32.jpg",
    };
    setJobs([...jobs, newJob]);
    setJobForm({
      title: "",
      description: "",
      location: "",
      type: "",
      salary: "",
      requirements: "",
      imageUrl: "",
    });
    setShowJobForm(false);
  };

  // Stats 예시 데이터
  const stats = [
    { icon: <Briefcase className="w-6 h-6" />, value: 2, label: "Active Jobs" },
    { icon: <Users className="w-6 h-6" />, value: 30, label: "Total Applicants" },
    { icon: <AlertTriangle className="w-6 h-6" />, value: 2, label: "Status Update Needed" },
  ];

  // Stats section에는 Status Update Needed 제외
  const statsForSection = stats.filter((s) => s.label !== "Status Update Needed");

  const router = useRouter();

  // Status Update Needed 배너 노출 조건
  const statusUpdateStat = stats.find((s) => s.label === "Status Update Needed");
  const needsUpdate = statusUpdateStat && statusUpdateStat.value > 0;

  // Active Job Posts 예시 데이터
  const activeJobPosts = [
    {
      id: 1,
      type: "Part-Time",
      title: "Server - Full Time",
      rate: "₩12,000/hr",
      city: "Gangnam",
      dateRange: "Dec 15 - Feb 28",
      company: "Starbucks",
      desc: "Experience preferred, weekend availability required",
      applicants: 12,
      views: 89,
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg-Hu63xpLSz-T8LeMQrBt09rk4fhAkts_EQ&s",
    },
    {
      id: 2,
      type: "Part-Time",
      title: "Kitchen Staff - Part Time",
      rate: "₩13,500/hr",
      city: "Insadong",
      dateRange: "Dec 18 - Feb 14",
      company: "Fashion Store",
      desc: "Evening shifts, no experience required",
      applicants: 8,
      views: 124,
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_vguO_Tb6WmaoO95UhQL7YGkMORACrcgR2w&s",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-pretendard">
      <div className="md:max-w-6xl mx-auto bg-white min-h-screen">
        {/* Header */}
        <PageHeader
          title="job:about"
          leftIcon={<UserRound className="w-5 h-5 md:w-6 md:h-6" />}
          rightIcon={<SquarePen className="w-5 h-5 md:w-6 md:h-6" />}
          onClickRight={() => {}}
        />

        <div className="flex flex-col gap-6">
          {/* Status Update Needed Banner */}
          <div className="px-4 md:px-8 mt-4">
            {needsUpdate && (
              <button
                className="w-full flex items-center gap-2 bg-yellow-100 text-yellow-800 rounded-lg px-4 py-3 font-medium hover:bg-yellow-200 transition cursor-pointer"
                onClick={() => router.push("/employer/status-update")}
                aria-label="Go to status update page"
              >
                <AlertTriangle className="w-5 h-5 mr-1 text-yellow-800" />
                <span className="text-start text-sm md:text-base">
                  {statusUpdateStat.value} job posts need status update.{" "}
                  <br className="md:hidden" /> Please check!
                </span>
              </button>
            )}
          </div>

          {/* Stats */}
          <section className="grid grid-cols-2 gap-4 px-4 md:px-8 pb-6">
            {statsForSection.map((s, i) => (
              <Card
                key={i}
                className="flex flex-col items-center justify-center text-center w-full md:aspect-auto md:min-w-0 md:max-w-none py-5"
              >
                {s.icon}
                <Typography as="div" variant="headlineMd">
                  {s.value}
                </Typography>
                <Typography as="div" variant="bodyLg" className="text-gray-600">
                  {s.label}
                </Typography>
              </Card>
            ))}
          </section>
        </div>

        {/* Active Job Posts (이미지 스타일) */}
        <section className="p-4 md:p-8 bg-gradient-to-b from-purple-50 to-white">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-purple-600 mr-2" />
              <Typography
                as="h2"
                variant="headlineMd"
                className="text-xl md:text-2xl font-bold text-gray-900"
              >
                Active Job Posts
              </Typography>
            </div>
            <Typography
              as="span"
              variant="bodySm"
              className="text-purple-600 hover:text-purple-700 cursor-pointer text-sm md:text-base hidden md:inline"
            >
              See more
            </Typography>
          </div>
          <Typography as="p" variant="bodySm" className="text-gray-600 text-sm md:text-base mb-4">
            Manage your job posts and check applicants
          </Typography>
          <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-1 md:gap-4">
            {activeJobPosts.map((job, i) => (
              <JobCard
                key={i}
                job={job as JobCardJob}
                actionButtons={
                  <>
                    <Button variant="outline" className="flex-1 border-gray-300 hover:bg-gray-100">
                      View
                    </Button>
                    <Button variant="default" className="flex-1">
                      Applicants
                    </Button>
                  </>
                }
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
