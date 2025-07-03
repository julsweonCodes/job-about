"use client";

import React, { useState } from "react";
import { Briefcase, Users, SquarePen, UserRound, AlertCircle, Clock } from "lucide-react";
import { Dialog } from "@/components/common/Dialog";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Typography from "@/components/ui/Typography";
import PageHeader from "@/components/common/PageHeader";
import JobCard, { JobCardJob } from "@/components/common/JobCard";

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
  ];

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

        {/* Stats */}
        <section className="grid grid-cols-2 gap-4 p-4 md:p-8">
          {stats.map((s, i) => (
            <Card
              key={i}
              className="flex flex-col items-center justify-center text-center w-full md:aspect-auto md:min-w-0 md:max-w-none py-5"
            >
              {s.icon}
              <Typography as="div" variant="headlineMd">
                {s.value}
              </Typography>
              <Typography as="div" variant="bodySm" className="text-text-secondary">
                {s.label}
              </Typography>
            </Card>
          ))}
        </section>

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
                    <Button
                      variant="outline"
                      className="flex-1 rounded-lg font-bold border-gray-300 hover:bg-gray-100"
                    >
                      View
                    </Button>
                    <Button
                      variant="default"
                      className="flex-1 rounded-lg font-bold bg-purple-500 hover:bg-purple-600"
                    >
                      Applicants
                    </Button>
                  </>
                }
              />
            ))}
          </div>
        </section>

        {/* Job Form Dialog */}
        <Dialog open={showJobForm} onClose={() => setShowJobForm(false)} type="alert">
          <Card className="p-6 max-w-lg mx-auto">
            <Typography as="h3" variant="headlineMd" className="mb-4">
              새 채용 공고 등록
            </Typography>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">직무 제목</label>
                <div className="relative">
                  <input
                    type="text"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7A73F1] focus:border-[#7A73F1] pl-10 placeholder:text-gray-300"
                    placeholder="예: Frontend Developer"
                  />
                  <SquarePen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">직무 설명</label>
                <textarea
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7A73F1] focus:border-[#7A73F1] placeholder:text-gray-300"
                  placeholder="직무에 대한 상세한 설명을 입력하세요"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">근무지</label>
                  <input
                    type="text"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7A73F1] focus:border-[#7A73F1] placeholder:text-gray-300"
                    placeholder="예: 서울, 원격"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">고용 형태</label>
                  <select
                    value={jobForm.type}
                    onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7A73F1] focus:border-[#7A73F1] placeholder:text-gray-300"
                  >
                    <option value="">선택하세요</option>
                    <option value="Full-time">정규직</option>
                    <option value="Part-time">파트타임</option>
                    <option value="Contract">계약직</option>
                    <option value="Intern">인턴</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">연봉</label>
                <input
                  type="text"
                  value={jobForm.salary}
                  onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7A73F1] focus:border-[#7A73F1] placeholder:text-gray-300"
                  placeholder="예: $50,000 - $70,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">자격 요건</label>
                <textarea
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7A73F1] focus:border-[#7A73F1] placeholder:text-gray-300"
                  placeholder="필요한 자격 요건을 입력하세요"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={handleAddJob} variant="black" className="flex-1">
                  등록하기
                </Button>
                <Button onClick={() => setShowJobForm(false)} variant="outline" className="flex-1">
                  취소
                </Button>
              </div>
            </div>
          </Card>
        </Dialog>
      </div>
    </div>
  );
}
