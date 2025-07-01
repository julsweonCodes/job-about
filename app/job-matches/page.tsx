import React from "react";
import { UserRound } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import Typography from "@/components/ui/Typography";

const filters = [{ label: "Job Type" }, { label: "Location" }, { label: "Hourly Rate" }];

const recommendedJobs = [
  {
    title: "Barista",
    type: "Part-Time",
    pay: "$15/hr",
    location: "Chicago, IL",
    date: "Aug 5 - Sep 5",
  },
  {
    title: "Barista",
    type: "Part-Time",
    pay: "$15/hr",
    location: "Chicago, IL",
    date: "Aug 5 - Sep 5",
  },
  {
    title: "Barista",
    type: "Part-Time",
    pay: "$15/hr",
    location: "Chicago, IL",
    date: "Aug 5 - Sep 5",
  },
];

const latestJobs = [
  {
    title: "Barista",
    type: "Part-Time",
    pay: "$15/hr",
    location: "Chicago, IL",
    date: "Aug 5 - Sep 5",
  },
  {
    title: "Babysitter",
    type: "Part-Time",
    pay: "$15/hr",
    location: "Chicago, IL",
    date: "Aug 5 - Sep 5",
  },
  {
    title: "Servers",
    type: "Part-Time",
    pay: "$15/hr",
    location: "Chicago, IL",
    date: "Aug 5 - Sep 5",
  },
];

function JobCard({ job, highlight }: { job: any; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition mb-4 md:mb-0">
      <div>
        <div className="text-gray-400 text-sm">{job.type}</div>
        <div className="font-bold text-lg md:text-xl">{job.title}</div>
        <div className="text-gray-500 text-sm">
          {job.pay} · {job.location} · {job.date}
        </div>
      </div>
      <div
        className={`w-16 h-16 md:w-20 md:h-20 rounded-lg ${highlight ? "bg-violet-300" : "bg-gray-200"}`}
      ></div>
    </div>
  );
}

export default function JobMatchesPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <PageHeader
          title="Job Matches"
          rightIcon={<UserRound className="w-6 h-6 md:w-8 md:h-8 text-text-primary" />}
        />

        {/* 필터 */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {filters.map((f) => (
            <button
              key={f.label}
              className="bg-white border border-gray-200 rounded-xl px-5 py-2 text-gray-700 font-medium shadow-sm hover:bg-gray-100 transition"
            >
              {f.label}{" "}
              <span className="material-icons align-middle text-base ml-1">expand_more</span>
            </button>
          ))}
        </div>

        {/* 추천 잡 */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-yellow-400 text-xl">✨</span>
            <Typography as="span" variant="headlineMd">
              Recommended Jobs
            </Typography>
          </div>
          <Typography as="div" variant="bodySm" className="text-gray-400 mb-4">
            Based on your profile and preferences
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedJobs.map((job, i) => (
              <JobCard key={i} job={job} />
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <button className="bg-violet-500 text-white font-semibold rounded-xl px-8 py-3 hover:bg-violet-600 transition">
              See More Recommended Jobs
            </button>
          </div>
        </div>

        {/* 최신 잡 */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-red-400 text-xl">🚀</span>
            <Typography as="span" variant="headlineMd">
              Latest Jobs
            </Typography>
          </div>
          <Typography as="div" variant="bodySm" className="text-gray-400 mb-4">
            Fresh opportunities just posted
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {latestJobs.map((job, i) => (
              <JobCard key={i} job={job} highlight />
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <button className="bg-violet-500 text-white font-semibold rounded-xl px-8 py-3 hover:bg-violet-600 transition">
              See More Latest Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
