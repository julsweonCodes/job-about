"use client";

import React, { useState } from "react";
import { MapPin, Clock, DollarSign, Briefcase, Building2, Users } from "lucide-react";
import { ProfileHeader } from "@/components/common/ProfileHeader";
import FilterDropdown from "@/app/seeker/components/FilterDropdown";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote";
  salary: string;
  posted: string;
  description: string;
  tags: string[];
  isRecommended?: boolean;
  rating?: number;
  logo?: string;
  applicants?: number;
}

const jobsData: Job[] = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechFlow Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120,000 - $150,000",
    posted: "2 hours ago",
    description:
      "Join our design team to create innovative user experiences for our flagship product. We're looking for someone passionate about user-centered design and modern design systems.",
    tags: ["React", "TypeScript", "Tailwind"],
    isRecommended: true,
    rating: 4.8,
    applicants: 24,
  },
  {
    id: 2,
    title: "Product Designer",
    company: "Design Studio",
    location: "New York, NY",
    type: "Full-time",
    salary: "$90,000 - $120,000",
    posted: "4 hours ago",
    description:
      "Drive marketing campaigns and content strategy for our growing startup. Perfect opportunity for someone looking to make a real impact in a fast-paced environment.",
    tags: ["Figma", "UI/UX", "Prototyping"],
    isRecommended: true,
    rating: 4.9,
    applicants: 18,
  },
  {
    id: 3,
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "Remote",
    type: "Remote",
    salary: "$100,000 - $130,000",
    posted: "1 day ago",
    description:
      "Join our fast-growing startup and work on cutting-edge technology that's changing the industry.",
    tags: ["Node.js", "React", "MongoDB"],
    rating: 4.6,
    applicants: 31,
  },
  {
    id: 4,
    title: "Marketing Manager",
    company: "Growth Co.",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$80,000 - $100,000",
    posted: "2 days ago",
    description:
      "Lead our marketing efforts and help us reach new audiences with creative campaigns.",
    tags: ["Digital Marketing", "SEO", "Analytics"],
    rating: 4.7,
    applicants: 12,
  },
  {
    id: 5,
    title: "Data Scientist",
    company: "Analytics Pro",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$130,000 - $160,000",
    posted: "3 days ago",
    description: "Analyze complex data sets and turn insights into actionable business strategies.",
    tags: ["Python", "ML", "Statistics"],
    rating: 4.5,
    applicants: 45,
  },
  {
    id: 6,
    title: "UX Researcher",
    company: "User Labs",
    location: "Boston, MA",
    type: "Contract",
    salary: "$70 - $90/hour",
    posted: "5 days ago",
    description: "Conduct user research and usability testing to improve our products.",
    tags: ["User Research", "Testing", "Analytics"],
    rating: 4.4,
    applicants: 8,
  },
];

interface FilterOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  options: string[];
}

function JobCard({ job }: { job: Job }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-gray-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{job.title}</h3>
            <p className="text-gray-500 text-sm">{job.company}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <MapPin className="w-4 h-4" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{job.type}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center space-x-1 mb-2">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-medium">{job.salary}</span>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{job.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-100"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{job.applicants} applicants</span>
          </div>
          <span>•</span>
          <span>{job.posted}</span>
        </div>
        <button className="bg-purple-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
          Apply Now
        </button>
      </div>
    </div>
  );
}

function SeekerPage() {
  const [selectedJobType, setSelectedJobType] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedSalary, setSelectedSalary] = useState("All");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const recommendedJobs = jobsData.filter((job) => job.isRecommended);
  const recentJobs = jobsData.filter((job) => !job.isRecommended);

  const filterOptions: FilterOption[] = [
    {
      id: "jobType",
      label: "Job Type",
      icon: <Briefcase className="w-4 h-4" />,
      options: ["All", "Full-time", "Part-time", "Contract", "Remote"],
    },
    {
      id: "location",
      label: "Location",
      icon: <MapPin className="w-4 h-4" />,
      options: [
        "All",
        "San Francisco, CA",
        "New York, NY",
        "Remote",
        "Austin, TX",
        "Seattle, WA",
        "Boston, MA",
      ],
    },
    {
      id: "salary",
      label: "Salary",
      icon: <DollarSign className="w-4 h-4" />,
      options: ["All", "$50k - $75k", "$75k - $100k", "$100k - $150k", "$150k+"],
    },
  ];

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

  const toggleDropdown = (filterId: string) => {
    setOpenDropdown(openDropdown === filterId ? null : filterId);
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
            {filterOptions.map((filter) => (
              <FilterDropdown
                key={filter.id}
                filter={filter}
                selectedValue={
                  filter.id === "jobType"
                    ? selectedJobType
                    : filter.id === "location"
                      ? selectedLocation
                      : selectedSalary
                }
                onSelect={(value) => handleFilterSelect(filter.id, value)}
                isOpen={openDropdown === filter.id}
                onToggle={() => toggleDropdown(filter.id)}
              />
            ))}
          </div>

          {/* <ActiveFilters
            filters={activeFilters}
            onRemove={handleRemoveFilter}
            onClear={handleClearAllFilters}
          /> */}
        </div>

        {/* Recommended Jobs */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended for You</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recommendedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </section>

        {/* Recent Jobs */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recently Posted</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recentJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default SeekerPage;
