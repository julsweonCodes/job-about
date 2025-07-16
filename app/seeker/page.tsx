"use client";

import React, { useState } from "react";
import { MapPin, DollarSign, Briefcase } from "lucide-react";
import { ProfileHeader } from "@/components/common/ProfileHeader";
import FilterDropdown from "@/app/seeker/components/FilterDropdown";
import { JobPostCard, JobPost } from "@/app/seeker/components/JopPostCard";
import { WorkType } from "@/constants/enums";
import { useRouter } from "next/navigation";

const recommendedJobs: JobPost[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    type: WorkType.OnSite,
    wage: "$120,000 - $150,000",
    location: "San Francisco, CA",
    dateRange: "2 hours ago",
    businessName: "TechFlow Inc.",
    description:
      "Join our design team to create innovative user experiences for our flagship product. We're looking for someone passionate about user-centered design and modern design systems.",
    applicants: 24,
    views: 0,
    coverImage: undefined,
  },
  {
    id: "2",
    title: "Product Designer",
    type: WorkType.OnSite,
    wage: "$90,000 - $120,000",
    location: "New York, NY",
    dateRange: "4 hours ago",
    businessName: "Design Studio",
    description:
      "Drive marketing campaigns and content strategy for our growing startup. Perfect opportunity for someone looking to make a real impact in a fast-paced environment.",
    applicants: 18,
    views: 0,
    coverImage:
      "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

const latestJobs: JobPost[] = [
  {
    id: "3",
    title: "Full Stack Engineer",
    type: WorkType.Remote,
    wage: "$100,000 - $130,000",
    location: "Remote",
    dateRange: "1 day ago",
    businessName: "StartupXYZ",
    description:
      "Join our fast-growing startup and work on cutting-edge technology that's changing the industry.",
    applicants: 31,
    views: 0,
    coverImage: undefined,
  },
  {
    id: "4",
    title: "Marketing Manager",
    type: WorkType.OnSite,
    wage: "$80,000 - $100,000",
    location: "Austin, TX",
    dateRange: "2 days ago",
    businessName: "Growth Co.",
    description:
      "Lead our marketing efforts and help us reach new audiences with creative campaigns.",
    applicants: 12,
    views: 0,
    coverImage:
      "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "5",
    title: "Data Scientist",
    type: WorkType.OnSite,
    wage: "$130,000 - $160,000",
    location: "Seattle, WA",
    dateRange: "3 days ago",
    businessName: "Analytics Pro",
    description: "Analyze complex data sets and turn insights into actionable business strategies.",
    applicants: 45,
    views: 0,
    coverImage: undefined,
  },
  {
    id: "6",
    title: "UX Researcher",
    type: WorkType.OnSite,
    wage: "$70 - $90/hour",
    location: "Boston, MA",
    dateRange: "5 days ago",
    businessName: "User Labs",
    description: "Conduct user research and usability testing to improve our products.",
    applicants: 8,
    views: 0,
    coverImage:
      "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

function SeekerPage() {
  const router = useRouter();
  const [selectedJobType, setSelectedJobType] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedSalary, setSelectedSalary] = useState("All");

  function filterJobs(jobs: JobPost[]) {
    return jobs.filter((job) => {
      // 직무 타입 필터
      if (selectedJobType !== "All") {
        if (
          (selectedJobType === "Remote" && job.type !== WorkType.Remote) ||
          (selectedJobType === "OnSite" && job.type !== WorkType.OnSite)
        ) {
          return false;
        }
      }
      // 지역 필터
      if (selectedLocation !== "All" && job.location !== selectedLocation) {
        return false;
      }
      // 급여 필터 (문자열 일치만)
      if (selectedSalary !== "All" && job.wage !== selectedSalary) {
        return false;
      }
      return true;
    });
  }

  const handleFilterSelect = (filterId: string, value: string) => {
    switch (filterId) {
      case "jobType":
        setSelectedJobType(value);
        break;
      case "location":
        setSelectedLocation(value);
        break;
      case "salary":
        setSelectedSalary(value);
        break;
    }
  };

  const handleViewJob = (id: string) => {
    router.push(`/seeker/post/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ProfileHeader />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
          <p className="text-base lg:text-lg text-gray-600">
            Discover opportunities that match your skills and interests
          </p>
        </div>

        {/* Filters */}
        <div className=" rounded-xl mb-8">
          <div className="flex flex-wrap gap-4">
            <FilterDropdown
              filter={{
                id: "jobType",
                label: "Job Type",
                icon: <Briefcase />,
                options: ["All", "Remote", "OnSite"],
              }}
              selectedValue={selectedJobType}
              onSelect={(value) => handleFilterSelect("jobType", value)}
            />
            <FilterDropdown
              filter={{
                id: "location",
                label: "Location",
                icon: <MapPin />,
                options: [
                  "All",
                  "Remote",
                  "San Francisco, CA",
                  "New York, NY",
                  "Austin, TX",
                  "Boston, MA",
                  "Seattle, WA",
                ],
              }}
              selectedValue={selectedLocation}
              onSelect={(value) => handleFilterSelect("location", value)}
            />
            <FilterDropdown
              filter={{
                id: "salary",
                label: "Salary",
                icon: <DollarSign />,
                options: [
                  "All",
                  "$70 - $90/hour",
                  "$90,000 - $120,000",
                  "$120,000 - $150,000",
                  "$100,000 - $130,000",
                  "$130,000 - $160,000",
                ],
              }}
              selectedValue={selectedSalary}
              onSelect={(value) => handleFilterSelect("salary", value)}
            />
          </div>
        </div>

        {/* Recommended Jobs */}
        {filterJobs(recommendedJobs).length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended for You</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filterJobs(recommendedJobs).map((job) => (
                <JobPostCard key={job.id} job={job} onView={handleViewJob} isRecommended />
              ))}
            </div>
          </section>
        )}

        {/* Recent Jobs */}
        {filterJobs(latestJobs).length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recently Posted</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filterJobs(latestJobs).map((job) => (
                <JobPostCard key={job.id} job={job} onView={handleViewJob} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default SeekerPage;
