"use client";

import { useState } from "react";
import { User, Sparkles, Compass, MapPin, Calendar } from "lucide-react";
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

type Job = {
  id: number;
  type: string;
  title: string;
  rate: string;
  city: string;
  dateRange: string;
  company: string;
  logo: string;
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
      logo: "☕",
    },
    {
      id: 2,
      type: "Freelance",
      title: "English Tutor",
      rate: "₩25,000/hr",
      city: "Hongdae",
      dateRange: "Dec 10 - Jan 31",
      company: "EduTech",
      logo: "📚",
    },
    {
      id: 3,
      type: "Part-Time",
      title: "Delivery Driver",
      rate: "₩15,000/hr",
      city: "Itaewon",
      dateRange: "Dec 20 - Mar 15",
      company: "CoupangEats",
      logo: "🚗",
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
      logo: "🎉",
    },
    {
      id: 5,
      type: "Freelance",
      title: "Social Media Manager",
      rate: "₩22,000/hr",
      city: "Seocho",
      dateRange: "Jan 1 - Mar 31",
      company: "CreativeHub",
      logo: "📱",
    },
    {
      id: 6,
      type: "Part-Time",
      title: "Retail Assistant",
      rate: "₩13,500/hr",
      city: "Insadong",
      dateRange: "Dec 18 - Feb 14",
      company: "Fashion Store",
      logo: "👔",
    },
  ];

  const JobCard = ({ job, isLatest = false }: { job: Job; isLatest?: boolean }) => (
    <Card
      className={`transition-all duration-300 hover:shadow-lg ${isLatest ? "border-purple-200 bg-gradient-to-br from-purple-50 to-white" : "border-gray-200 bg-white"}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <Badge variant="secondary" className="text-xs font-medium">
            {job.type}
          </Badge>
          <div className="text-2xl">{job.logo}</div>
        </div>

        <h3 className="font-semibold text-lg mb-2 text-gray-900">{job.title}</h3>

        <div className="space-y-2 mb-4">
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

        <Button
          className={`w-full ${isLatest ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-800 hover:bg-gray-900"} text-white`}
        >
          Apply Now
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-pretendard">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-white px-4 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Job Matches</h1>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-4 py-4 bg-white border-b border-gray-100">
          <div className="grid grid-cols-3 gap-2">
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
        <div className="px-4 py-6">
          <div className="flex items-center mb-2">
            <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Recommended Jobs</h2>
          </div>
          <p className="text-gray-600 text-sm mb-4">Based on your profile and preferences</p>

          <div className="space-y-4 mb-6">
            {recommendedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            See More Recommended Jobs
          </Button>
        </div>

        {/* Latest Jobs Section */}
        <div className="px-4 py-6 bg-gradient-to-b from-purple-50 to-white">
          <div className="flex items-center mb-2">
            <Compass className="w-5 h-5 text-purple-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Latest Jobs</h2>
          </div>
          <p className="text-gray-600 text-sm mb-4">Fresh opportunities just posted</p>

          <div className="space-y-4 mb-6">
            {latestJobs.map((job) => (
              <JobCard key={job.id} job={job} isLatest={true} />
            ))}
          </div>

          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            See More Latest Jobs
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Matches;
