"use client";

import { useState } from "react";
import { User, UserRound, Sparkles, Compass, MapPin, Calendar, ImageUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import Typography from "@/components/ui/Typography";
import PageHeader from "@/components/common/PageHeader";

type Job = {
  id: number;
  type: string;
  title: string;
  rate: string;
  city: string;
  dateRange: string;
  company: string;
  imageUrl: string;
};

const Matches = () => {
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
    {
      id: 3,
      type: "Part-Time",
      title: "Delivery Driver",
      rate: "₩15,000/hr",
      city: "Itaewon",
      dateRange: "Dec 20 - Mar 15",
      company: "CoupangEats",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg-Hu63xpLSz-T8LeMQrBt09rk4fhAkts_EQ&s",
    },
  ];

  const latestJobs = [
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
  ];

  const JobCard = ({ job, isLatest = false }: { job: Job; isLatest?: boolean }) => (
    <Card
      className={`transition-all duration-300 hover:shadow-lg ${isLatest ? "border-purple-200 bg-gradient-to-br from-purple-50 to-white" : "border-gray-200 bg-white"}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Badge variant="secondary" className="text-xs font-medium mb-1">
              {job.type}
            </Badge>
            <h3 className="font-semibold text-lg mb-2 text-gray-900">{job.title}</h3>
            <div className="space-y-2 mb-2">
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-semibold text-purple-600 mr-2">{job.rate}</span>
                <MapPin className="w-3 h-3 mr-1" />
                <span>{job.city}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-3 h-3 mr-1" />
                <span>{job.dateRange}</span>
              </div>
              <div className="text-xs text-gray-500">{job.company}</div>
            </div>
          </div>
          <img
            src={job.imageUrl}
            alt={job.title}
            className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg flex-shrink-0"
          />
        </div>
        <Button
          className={`w-full md:px-8 md:text-lg ${isLatest ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-black text-white hover:bg-gray-900"}`}
        >
          Apply Now
        </Button>
      </CardContent>
    </Card>
  );

  const Header = () => {
    return (
      <PageHeader title="Job Matches" rightIcon={<UserRound className="w-5 h-5 md:w-6 md:h-6" />} />
// Removed commented-out legacy header markup for improved readability.
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-pretendard">
      <div className="max-w-md md:max-w-3xl lg:max-w-4xl mx-auto bg-white min-h-screen">
        {/* Header */}
        <Header></Header>
        {/* Filter Bar */}
        <div className="px-4 md:px-8 py-4 bg-white border-b border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="part-time">Part-Time</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
                <SelectItem value="full-time">Full-Time</SelectItem>
              </SelectContent>
            </Select>

            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gangnam">Gangnam</SelectItem>
                <SelectItem value="hongdae">Hongdae</SelectItem>
                <SelectItem value="itaewon">Itaewon</SelectItem>
                <SelectItem value="myeongdong">Myeongdong</SelectItem>
              </SelectContent>
            </Select>

            <Select value={hourlyRate} onValueChange={setHourlyRate}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Rate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10000-15000">₩10k-15k</SelectItem>
                <SelectItem value="15000-20000">₩15k-20k</SelectItem>
                <SelectItem value="20000+">₩20k+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Recommended Jobs Section */}
        <div className="px-4 md:px-8 py-6 md:py-10">
          <div className="flex items-center mb-2">
            <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-purple-600 mr-2" />
            <Typography
              as="h2"
              variant="headlineMd"
              className="text-xl md:text-2xl font-bold text-gray-900"
            >
              Recommended Jobs
            </Typography>
          </div>
          <Typography as="p" variant="bodySm" className="text-gray-600 text-sm md:text-base mb-4">
            Based on your profile and preferences
          </Typography>

          <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4 mb-6">
            {recommendedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full border-purple-200 text-purple-600 hover:bg-purple-50 md:text-lg md:h-11"
          >
            See More Recommended Jobs
          </Button>
        </div>

        {/* Latest Jobs Section */}
        <div className="px-4 md:px-8 py-6 md:py-10 bg-gradient-to-b from-purple-50 to-white">
          <div className="flex items-center mb-2">
            <Compass className="w-5 h-5 md:w-6 md:h-6 text-purple-600 mr-2" />
            <Typography
              as="h2"
              variant="headlineMd"
              className="text-xl md:text-2xl font-bold text-gray-900"
            >
              Latest Jobs
            </Typography>
          </div>
          <Typography as="p" variant="bodySm" className="text-gray-600 text-sm md:text-base mb-4">
            Fresh opportunities just posted
          </Typography>

          <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4 mb-6">
            {latestJobs.map((job) => (
              <JobCard key={job.id} job={job} isLatest={true} />
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full border-purple-200 text-purple-600 hover:bg-purple-50 md:text-lg md:h-11"
          >
            See More Latest Jobs
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Matches;
