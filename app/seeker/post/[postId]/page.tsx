"use client";
import React, { useState } from "react";
import {
  MapPin,
  DollarSign,
  Clock,
  Calendar,
  Heart,
  Building2,
  Globe,
  Users,
  Bookmark,
} from "lucide-react";
import PostHeader from "@/components/common/PostHeader";
import { JobStatus, JobType } from "@/constants/enums";
import { LanguageLevel } from "@/constants/enums";

const jobDetails = {
  id: "1",
  title: "Cashier",
  jobType: JobType.ACCOUNTANT,
  status: JobStatus.Published,
  business: {
    id: "1",
    name: "Fresh Market Grocery",
    description:
      "Café Luna is a locally-owned coffee shop that's been serving the Vancouver community for over 8 years. We pride ourselves on creating a warm, inclusive environment where both customers and staff feel at home. Our team is like a family, and we believe in supporting each other's growth and goals.",
    photos: [
      "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2",
      "https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2",
      "https://images.pexels.com/photos/2292837/pexels-photo-2292837.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2",
      "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2",
      "https://images.pexels.com/photos/1797428/pexels-photo-1797428.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2",
    ],
    location: "123 Main St, Anytown",
    tags: ["Family-friendly", "No experience required", "Quick hiring"],
  },
  deadline: "August 15",
  schedule: "Flexible, 10–20 hrs/week",
  requiredSkills: ["Cash handling", "Customer service", "Teamwork"],
  requiredPersonality: ["Friendly", "Patient", "Team-oriented"],
  languageLevel: LanguageLevel.Intermediate,
  hourlyWage: "$15/hr",
  description:
    "Join our team as a friendly cashier! You'll handle transactions, assist customers, and keep the store tidy. No experience needed, just a positive attitude and willingness to learn. Perfect for students or those seeking a flexible schedule.",
};

const jobDetailItems = [
  {
    icon: MapPin,
    label: "Location",
    value: jobDetails.business.location,
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
  {
    icon: DollarSign,
    label: "Hourly Wage",
    value: jobDetails.hourlyWage,
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    icon: Clock,
    label: "Schedule",
    value: jobDetails.schedule,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    icon: Globe,
    label: "Language Level",
    value: jobDetails.languageLevel,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    icon: Calendar,
    label: "Application Deadline",
    value: jobDetails.deadline,
    color: "text-orange-500",
    bgColor: "bg-orange-50",
  },
];

export const JobDetailPage: React.FC = () => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleApply = () => {
    console.log("Apply for job");
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    console.log("Bookmark toggled:", !isBookmarked);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-pretendard">
      {/* Header */}
      <PostHeader
        rightIcon={
          <Bookmark
            className={`w-5 h-5 transition-colors ${
              isBookmarked ? "text-purple-500 fill-purple-500" : "text-gray-700"
            }`}
          />
        }
        onClickRight={handleBookmark}
      />

      <div className="max-w-6xl mx-auto px-5 lg:px-6">
        {/* Job Header */}
        <div className="py-6 lg:py-8">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Building2 className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                {jobDetails.title}
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 mb-3">{jobDetails.business.name}</p>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <p className="text-gray-700 leading-relaxed text-base">{jobDetails.description}</p>
          </div>
        </div>

        {/* Job Details */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Job Details</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {jobDetailItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.label}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${item.bgColor}`}>
                      <IconComponent className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-500 mb-1">{item.label}</p>
                      <p className="text-base font-semibold text-gray-900 truncate">{item.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skills & Personality */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Skills & Personality</h2>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <Users className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-gray-800">Required Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {jobDetails.requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100"
                  >
                    #{skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Heart className="w-5 h-5 text-purple-500" />
                <h3 className="font-semibold text-gray-800">Personality Traits</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {jobDetails.requiredPersonality.map((trait) => (
                  <span
                    key={trait}
                    className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-100"
                  >
                    #{trait}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Workplace Photos */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Workplace Photos</h2>

          {/* Main Photo */}
          <div className="mb-4">
            <img
              key={selectedPhotoIndex}
              src={jobDetails.business.photos[selectedPhotoIndex]}
              alt="Workplace"
              className="w-full h-64 lg:h-80 object-cover rounded-3xl shadow-lg"
            />
          </div>

          {/* Photo Thumbnails */}
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {jobDetails.business.photos.map((photo, index) => (
              <button
                key={index}
                onClick={() => setSelectedPhotoIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                  selectedPhotoIndex === index
                    ? "border-purple-500 shadow-lg scale-105"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <img
                  src={photo}
                  alt={`Workplace ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Employer Info Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">About the Employer</h2>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 border border-indigo-100">
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed text-base">
                {jobDetails.business.description}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <Building2 className="w-5 h-5 text-indigo-500 mr-2" />
                What Makes Us Special
              </h3>
              <div className="flex flex-wrap gap-3">
                {jobDetails.business.tags.map((tag: string) => {
                  return (
                    <div
                      key={tag}
                      className="flex items-center space-x-2 bg-white/70 px-4 py-2 rounded-full border border-indigo-200 shadow-sm"
                    >
                      <span className="text-sm font-medium text-indigo-800">{tag}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Apply Button - Mobile Sticky */}
      <div className="lg:hidden px-4 py-6 bg-white border-t border-gray-100 sticky bottom-0 z-10">
        <button
          onClick={handleApply}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Apply Now
        </button>
        <p className="text-center text-sm text-gray-500 mt-3">
          Application deadline: {jobDetails.deadline}
        </p>
      </div>

      {/* Apply Button - Desktop */}
      <div className="hidden lg:block max-w-6xl mx-auto px-6 pb-12">
        <button
          onClick={handleApply}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-5 rounded-3xl font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Apply Now
        </button>
        <p className="text-center text-base text-gray-500 mt-4">
          Application deadline: {jobDetails.deadline}
        </p>
      </div>
    </div>
  );
};

export default JobDetailPage;
