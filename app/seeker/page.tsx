"use client";

import { useState } from "react";
import { UserRound, Sparkles, Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import Typography from "@/components/ui/Typography";
import PageHeader from "@/components/common/PageHeader";
import JobCard from "@/components/common/JobCard";

const SeekerHome = () => {
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");

  const recommendedJobs = [
    {
      id: 1,
      type: "Part-Time",
      title: "Cafe Barista",
      rate: "₩12,000/hr",
      city: "Gangnam",
      dateRange: "Dec 15 - Feb 28",
      company: "Starbucks",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_vguO_Tb6WmaoO95UhQL7YGkMORACrcgR2w&s",
    },
    {
      id: 2,
      type: "Freelance",
      title: "English Tutor",
      rate: "₩25,000/hr",
      city: "Hongdae",
      dateRange: "Dec 10 - Jan 31",
      company: "EduTech",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9ksxdWXzzmkcED9mJs--NlXYc34i5rxacUA&s",
    },
  ];

  const latestJobs = [
    {
      id: 3,
      type: "Part-Time",
      title: "Event Staff",
      rate: "₩18,000/hr",
      city: "Myeongdong",
      dateRange: "Dec 25 - Dec 31",
      company: "EventCorp",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_vguO_Tb6WmaoO95UhQL7YGkMORACrcgR2w&s",
    },
    {
      id: 4,
      type: "Part-Time",
      title: "Event Staff",
      rate: "₩18,000/hr",
      city: "Myeongdong",
      dateRange: "Dec 25 - Dec 31",
      company: "EventCorp",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_vguO_Tb6WmaoO95UhQL7YGkMORACrcgR2w&s",
    },
    {
      id: 5,
      type: "Freelance",
      title: "Social Media Manager",
      rate: "₩22,000/hr",
      city: "Seocho",
      dateRange: "Jan 1 - Mar 31",
      company: "CreativeHub",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9ksxdWXzzmkcED9mJs--NlXYc34i5rxacUA&s",
    },
    {
      id: 6,
      type: "Part-Time",
      title: "Retail Assistant",
      rate: "₩13,500/hr",
      city: "Insadong",
      dateRange: "Dec 18 - Feb 14",
      company: "Fashion Store",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg-Hu63xpLSz-T8LeMQrBt09rk4fhAkts_EQ&s",
    },
    {
      id: 7,
      type: "Part-Time",
      title: "Retail Assistant",
      rate: "₩13,500/hr",
      city: "Insadong",
      dateRange: "Dec 18 - Feb 14",
      company: "Fashion Store",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg-Hu63xpLSz-T8LeMQrBt09rk4fhAkts_EQ&s",
    },
    {
      id: 8,
      type: "Part-Time",
      title: "Retail Assistant",
      rate: "₩13,500/hr",
      city: "Insadong",
      dateRange: "Dec 18 - Feb 14",
      company: "Fashion Store",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg-Hu63xpLSz-T8LeMQrBt09rk4fhAkts_EQ&s",
    },
    {
      id: 9,
      type: "Part-Time",
      title: "Retail Assistant",
      rate: "₩13,500/hr",
      city: "Insadong",
      dateRange: "Dec 18 - Feb 14",
      company: "Fashion Store",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg-Hu63xpLSz-T8LeMQrBt09rk4fhAkts_EQ&s",
    },
    {
      id: 10,
      type: "Part-Time",
      title: "Retail Assistant",
      rate: "₩13,500/hr",
      city: "Insadong",
      dateRange: "Dec 18 - Feb 14",
      company: "Fashion Store",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg-Hu63xpLSz-T8LeMQrBt09rk4fhAkts_EQ&s",
    },
    {
      id: 11,
      type: "Part-Time",
      title: "Retail Assistant",
      rate: "₩13,500/hr",
      city: "Insadong",
      dateRange: "Dec 18 - Feb 14",
      company: "Fashion Store",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg-Hu63xpLSz-T8LeMQrBt09rk4fhAkts_EQ&s",
    },
    {
      id: 12,
      type: "Part-Time",
      title: "Retail Assistant",
      rate: "₩13,500/hr",
      city: "Insadong",
      dateRange: "Dec 18 - Feb 14",
      company: "Fashion Store",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg-Hu63xpLSz-T8LeMQrBt09rk4fhAkts_EQ&s",
    },
    {
      id: 13,
      type: "Part-Time",
      title: "Retail Assistant",
      rate: "₩13,500/hr",
      city: "Insadong",
      dateRange: "Dec 18 - Feb 14",
      company: "Fashion Store",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg-Hu63xpLSz-T8LeMQrBt09rk4fhAkts_EQ&s",
    },
  ];

  // Select 옵션 배열 선언
  const jobTypeOptions = [
    { value: "part-time", label: "Part-Time" },
    { value: "freelance", label: "Freelance" },
    { value: "full-time", label: "Full-Time" },
  ];
  const locationOptions = [
    { value: "gangnam", label: "Gangnam" },
    { value: "hongdae", label: "Hongdae" },
    { value: "itaewon", label: "Itaewon" },
    { value: "myeongdong", label: "Myeongdong" },
  ];
  const hourlyRateOptions = [
    { value: "10000-15000", label: "₩10k-15k" },
    { value: "15000-20000", label: "₩15k-20k" },
    { value: "20000+", label: "₩20k+" },
  ];

  const Header = () => {
    return (
      <PageHeader title="job:about" rightIcon={<UserRound className="w-5 h-5 md:w-6 md:h-6" />} />
    );
  };

  const FilterBar = () => {
    return (
      <div className="px-4 md:px-8 py-4 bg-white border-b border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
          <Select value={jobType} onValueChange={setJobType}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent>
              {jobTypeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} selectedValue={jobType}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              {locationOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} selectedValue={location}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={hourlyRate} onValueChange={setHourlyRate}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Rate" />
            </SelectTrigger>
            <SelectContent>
              {hourlyRateOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} selectedValue={hourlyRate}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  const RecommendedJobs = () => {
    return (
      <div className="px-4 md:px-8 py-6 md:py-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-purple-600 mr-2" />
            <Typography
              as="h2"
              variant="headlineMd"
              className="text-xl md:text-2xl font-bold text-gray-900"
            >
              Recommended Jobs
            </Typography>
          </div>
          <Typography
            as="span"
            variant="bodyMd"
            className="text-purple-600 hover:text-purple-700 cursor-pointer text-sm md:text-base hidden md:inline"
          >
            See more
          </Typography>
        </div>
        <Typography as="p" variant="bodyMd" className="text-gray-600 text-sm md:text-base mb-4">
          Based on your profile and preferences
        </Typography>

        <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
          {recommendedJobs.slice(0, 3).map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
        <Button
          variant="outline"
          className="w-full border-purple-200 text-purple-600 hover:bg-purple-50 mt-4 md:hidden"
        >
          See more
        </Button>
      </div>
    );
  };

  const LatestJobs = () => {
    return (
      <div className="px-4 md:px-8 py-6 md:py-10 bg-gradient-to-b from-purple-50 to-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Compass className="w-5 h-5 md:w-6 md:h-6 text-purple-600 mr-2" />
            <Typography
              as="h2"
              variant="headlineMd"
              className="text-xl md:text-2xl font-bold text-gray-900"
            >
              Latest Jobs
            </Typography>
          </div>
          <Typography
            as="span"
            variant="bodyMd"
            className="text-purple-600 hover:text-purple-700 cursor-pointer text-sm md:text-base hidden md:inline"
          >
            See more
          </Typography>
        </div>
        <Typography as="p" variant="bodyMd" className="text-gray-600 text-sm md:text-base mb-4">
          Fresh opportunities just posted
        </Typography>

        <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-4">
          {latestJobs.slice(0, 6).map((job) => (
            <JobCard key={job.id} job={job} isLatest />
          ))}
        </div>
        <Button
          variant="outline"
          className="border-purple-200 text-purple-600 hover:bg-purple-50 mt-4 md:hidden"
        >
          See more
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-pretendard">
      <div className="md:max-w-6xl mx-auto bg-white min-h-screen">
        {/* Header */}
        <Header></Header>
        {/* Filter Bar */}
        <FilterBar></FilterBar>
        {/* Recommended Jobs Section */}
        <RecommendedJobs></RecommendedJobs>
        {/* Latest Jobs Section */}
        <LatestJobs></LatestJobs>
      </div>
    </div>
  );
};

export default SeekerHome;
