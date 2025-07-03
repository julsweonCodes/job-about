"use client";

import React, { useState } from "react";
import { Plus, Briefcase, Users, Building, MapPin, Clock, DollarSign } from "lucide-react";
import { Dialog } from "@/components/common/Dialog";

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
  });

  const handleAddJob = () => {
    const newJob = {
      id: Date.now(),
      ...jobForm,
      company: "Tech Corp",
      postedDate: new Date().toISOString().split("T")[0],
      applications: 0,
    };
    setJobs([...jobs, newJob]);
    setJobForm({
      title: "",
      description: "",
      location: "",
      type: "",
      salary: "",
      requirements: "",
    });
    setShowJobForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">고용주 대시보드</h1>
              <p className="text-gray-600 mt-2">채용 공고를 관리하고 지원자를 확인하세요</p>
            </div>
            <button
              onClick={() => setShowJobForm(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2"
            >
              <Plus size={20} />새 채용 공고
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">활성 채용공고</p>
                <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 지원자</p>
                <p className="text-2xl font-bold text-gray-900">
                  {jobs.reduce((sum, job) => sum + job.applications, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Building className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">회사 정보</p>
                <p className="text-2xl font-bold text-gray-900">Tech Corp</p>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">채용 공고 관리</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {jobs.map((job) => (
              <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {job.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        {job.company}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {job.salary}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>게시일: {job.postedDate}</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        지원자 {job.applications}명
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                      지원자 보기
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 transition-colors">
                      수정
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Job Form Dialog */}
        <Dialog open={showJobForm} onClose={() => setShowJobForm(false)} type="alert">
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-4">새 채용 공고 등록</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">직무 제목</label>
              <input
                type="text"
                value={jobForm.title}
                onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="예: Frontend Developer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">직무 설명</label>
              <textarea
                value={jobForm.description}
                onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="예: 서울, 원격"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">고용 형태</label>
                <select
                  value={jobForm.type}
                  onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="예: $50,000 - $70,000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">자격 요건</label>
              <textarea
                value={jobForm.requirements}
                onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="필요한 자격 요건을 입력하세요"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleAddJob}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
              >
                등록하기
              </button>
              <button
                onClick={() => setShowJobForm(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-all duration-200"
              >
                취소
              </button>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
}
