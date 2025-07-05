"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import { Badge } from "@/components/ui/Badge";

const mockJobs = [
  {
    id: 1,
    title: "Barista",
    type: "Part-Time",
    postedAgo: "2 weeks ago",
    imageUrl: "https://cdn-icons-png.flaticon.com/512/415/415733.png",
    pending: 5,
    applicants: [
      {
        id: 1,
        name: "Alex",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        tags: ["#Team Player", "#Quiet", "#Detail-Oriented"],
        status: "Hired",
      },
      {
        id: 2,
        name: "Olivia",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        tags: ["#Team Player", "#Quiet", "#Detail-Oriented"],
        status: "Not Selected",
      },
    ],
  },
  {
    id: 2,
    title: "Server",
    type: "Part-Time",
    postedAgo: "2 weeks ago",
    imageUrl: "https://cdn-icons-png.flaticon.com/512/415/415734.png",
    pending: 5,
    applicants: [
      {
        id: 1,
        name: "Alex",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        tags: ["#Team Player", "#Quiet", "#Detail-Oriented"],
        status: "Hired",
      },
      {
        id: 2,
        name: "Olivia",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        tags: ["#Team Player", "#Quiet", "#Detail-Oriented"],
        status: "Not Selected",
      },
    ],
  },
];

const statusOptions = ["Hired", "Not Selected", "In Progress"];

export default function StatusUpdatePage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50 font-pretendard">
      <div className="md:max-w-2xl mx-auto bg-white min-h-screen">
        {/* Header */}
        <PageHeader
          title="Update Application Status"
          leftIcon={<ArrowLeft className="w-5 h-5" />}
          onClickLeft={() => router.back()}
        />

        {/* Info Banner */}
        <div className="mx-4 mt-4 mb-6 p-3 rounded-lg bg-gray-100 text-gray-700 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          <span className="text-sm font-medium">
            You have applicants pending review. <br className="sm:hidden" />
            Please update their status.
          </span>
        </div>

        {/* Job List */}
        <div className="space-y-6 px-4 pb-8">
          {mockJobs.map((job) => (
            <Card key={job.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <Typography as="div" variant="titleBold" className="mb-0.5">
                    {job.title}
                  </Typography>
                  <Typography as="div" variant="bodyMd" className="text-gray-500">
                    {job.type}
                  </Typography>
                  <Typography as="div" variant="bodyLg" className="text-gray-400 text-xs">
                    {job.postedAgo}
                  </Typography>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className="bg-indigo-100 text-indigo-700 font-semibold">
                    {job.pending} Pending
                  </Badge>
                  <img
                    src={job.imageUrl}
                    alt="job"
                    className="w-16 h-16 rounded-xl object-cover bg-gray-200"
                  />
                </div>
              </div>
              {/* Applicants */}
              <div className="mt-4 space-y-4">
                {job.applicants.map((applicant) => (
                  <div key={applicant.id} className="flex items-center gap-3">
                    <img
                      src={applicant.avatar}
                      alt={applicant.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <Typography as="div" variant="bodySmBold">
                        {applicant.name}
                      </Typography>
                      <Typography as="div" variant="bodyLg" className="text-gray-500 text-xs">
                        {applicant.tags.join(", ")}
                      </Typography>
                    </div>
                    <div className="flex gap-1 bg-gray-100 rounded-lg px-1 py-1">
                      {statusOptions.map((status) => (
                        <span
                          key={status}
                          className={`px-2 py-1 rounded-md text-xs font-semibold cursor-pointer transition
                            ${
                              applicant.status === status
                                ? "bg-black text-white"
                                : "text-gray-500 hover:bg-gray-200"
                            }
                          `}
                        >
                          {status}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {/* View All Applicants Button */}
              <Button variant="black" className="mt-4">
                View All Applicants
              </Button>
            </Card>
          ))}
        </div>
        {/* Confirm All Button */}
        <div className="px-4 pb-8">
          <Button variant="default" size="lg">
            Confirm All
          </Button>
        </div>
      </div>
    </div>
  );
}
