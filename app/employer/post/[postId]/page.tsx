"use client";
import React, { useState } from "react";
import { JobPostActionsDialog } from "@/components/employer/JobPostActionsDialog";
import {
  MapPin,
  DollarSign,
  Clock,
  Calendar,
  Building2,
  ChevronLeft,
  EllipsisVertical,
  Target,
  Heart,
  Languages,
} from "lucide-react";
import { JobStatus, JobType } from "@/constants/enums";
import PostHeader from "@/components/common/PostHeader";
import { LanguageLevel } from "@/constants/enums";
import { Chip } from "@/components/ui/Chip";

// test data
const jobPostDummyData = {
  title: "Cashier",
  jobType: JobType.ACCOUNTANT,
  business: {
    name: "Fresh Market Grocery",
    description:
      "Fresh Market Grocery is a grocery store that sells fresh produce, meat, and other groceries.",
    photos: [
      "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2",
      "https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2",
      "https://images.pexels.com/photos/2292837/pexels-photo-2292837.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2",
      "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2",
      "https://images.pexels.com/photos/1797428/pexels-photo-1797428.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2",
    ],
    location: "123 Main St, Anytown",
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
    value: jobPostDummyData.business.location,
    color: "text-red-500",
  },
  {
    icon: DollarSign,
    label: "Hourly Wage",
    value: jobPostDummyData.hourlyWage,
    color: "text-green-500",
  },
  {
    icon: Clock,
    label: "Schedule",
    value: jobPostDummyData.schedule,
    color: "text-blue-500",
  },
  {
    icon: Calendar,
    label: "Application Deadline",
    value: jobPostDummyData.deadline,
    color: "text-orange-500",
  },
  {
    icon: Languages,
    label: "Language Level",
    value: jobPostDummyData.languageLevel,
    color: "text-indigo-500",
  },
];

function JobDetailCard({
  icon: Icon,
  label,
  value,
  color,
  isArray = false,
}: {
  icon: any;
  label: string;
  value: string | string[];
  color: string;
  isArray?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-soft border border-gray-100">
      <div className="flex items-start space-x-3 lg:space-x-4">
        <div className={`p-2 lg:p-3 rounded-xl bg-gray-50 ${color} flex-shrink-0`}>
          <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
        </div>
        <div className="flex-1">
          <p className="text-sm lg:text-base font-medium text-gray-500 mb-1">{label}</p>
          {isArray && Array.isArray(value) ? (
            <div className="flex flex-wrap gap-2">
              {value.map((item, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-base lg:text-lg font-semibold text-gray-900">{value as string}</p>
          )}
        </div>
      </div>
    </div>
  );
}

const JobDetailPage: React.FC = () => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [showActionsDialog, setShowActionsDialog] = useState(false);

  // Mock job post data
  const jobPost = {
    id: "1",
    title: jobPostDummyData.title,
    status: JobStatus.Published,
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleStatusChange = (newStatus: JobStatus) => {
    // TODO: API call to update job post status
    console.log("Status changed to:", newStatus);
    // Update local state or refetch data
  };

  const handleEdit = () => {
    // TODO: Navigate to edit page
    console.log("Navigate to edit page");
  };

  return (
    <div className="min-h-screen bg-gray-100 font-pretendard">
      <div className="md:max-w-6xl mx-auto bg-white min-h-screen">
        <PostHeader
          leftIcon={<ChevronLeft className="w-6 h-6 text-gray-700" />}
          onClickLeft={handleBack}
          rightIcon={<EllipsisVertical className="w-6 h-6 text-gray-500" />}
          onClickRight={() => setShowActionsDialog(true)}
        />
        {/* Job Header */}
        <div className="bg-white px-5 lg:px-8 py-6 lg:py-8 border-b border-gray-100">
          <div className="flex items-start space-x-4 lg:space-x-6">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Building2 className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-1 lg:mb-2">
                {jobPostDummyData.title}
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 mb-2 lg:mb-3">
                {jobPostDummyData.business.name}
              </p>
            </div>
          </div>
        </div>
        {/* Main Content - Responsive Layout */}
        <div className="mx-auto px-5 lg:px-8 py-6 lg:py-8 bg-gray-50">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
            {/* Left Column - Job Details */}
            <div className="space-y-6 lg:space-y-8">
              {/* Job Details Cards */}
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">
                  Job Details
                </h2>
                <div className="space-y-3 lg:space-y-4">
                  {jobDetailItems.map((item) => (
                    <JobDetailCard
                      key={item.label}
                      icon={item.icon}
                      label={item.label}
                      value={item.value}
                      color={item.color}
                    />
                  ))}
                </div>
              </div>

              {/* Skills & Personality */}
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">
                  Skills & Personality
                </h2>
                <div className="space-y-6">
                  {/* Required Skills */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
                      Required Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {jobPostDummyData.requiredSkills.map((skill, index) => (
                        <Chip key={index} selected={true} variant="outline" size="md">
                          #{skill}
                        </Chip>
                      ))}
                    </div>
                  </div>

                  {/* Required Personality */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
                      Required Personality
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {jobPostDummyData.requiredPersonality.map((personality, index) => (
                        <Chip key={index} selected={true} variant="outline" size="md">
                          #{personality}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Job Description & Company Photos */}
            <div className="space-y-6 lg:space-y-8 mt-6 lg:mt-0">
              {/* Job Description */}
              <div className="lg:bg-transparent border-t lg:border-t-0 border-gray-100 pt-6 lg:pt-0">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">
                  About This Job
                </h2>
                <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-soft border border-gray-100">
                  <p className="text-base lg:text-lg text-gray-700 leading-relaxed">
                    {jobPostDummyData.description}
                  </p>
                </div>
              </div>

              {/* Company Photos */}
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">
                  Workplace Photos
                </h2>
                {/* Main Photo */}
                <div className="mb-4 lg:mb-6">
                  <img
                    key={selectedPhotoIndex}
                    src={jobPostDummyData.business.photos[selectedPhotoIndex]}
                    alt="Workplace"
                    className="w-full h-48 lg:h-64 object-cover rounded-2xl shadow-card"
                  />
                </div>

                {/* Photo Thumbnails */}
                <div className="flex space-x-3 lg:space-x-4 overflow-x-auto pb-2">
                  {jobPostDummyData.business.photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedPhotoIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedPhotoIndex === index
                          ? "border-purple-500 shadow-lg"
                          : "border-gray-200"
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
            </div>
          </div>
        </div>
      </div>

      {/* Job Post Actions Dialog */}
      <JobPostActionsDialog
        open={showActionsDialog}
        onClose={() => setShowActionsDialog(false)}
        jobPost={jobPost}
        onStatusChange={handleStatusChange}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default JobDetailPage;
