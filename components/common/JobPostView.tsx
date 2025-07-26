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
  CheckCircle,
  Edit3,
} from "lucide-react";
import { JobStatus, LanguageLevel } from "@/constants/enums";
import { JobType } from "@/constants/jobTypes";
import { JobPostData } from "@/types/jobPost";
import { mapLanguageLevelToServer } from "@/utils/client/enumMapper";

interface JobPostViewProps {
  jobData: JobPostData;
  mode?: "employer" | "seeker" | "preview";
  onEdit?: (section: string, data: any) => void;
  onApply?: () => void;
  onBookmark?: () => void;
  onPublish?: () => void;
  isBookmarked?: boolean;
  showEditButtons?: boolean;
  showApplyButton?: boolean;
  showPublishButton?: boolean;
  showSaveButton?: boolean;
  editableSections?: string[];
}

const JobPostView: React.FC<JobPostViewProps> = ({
  jobData,
  mode = "seeker",
  onEdit,
  onApply,
  onPublish,
  showEditButtons = false,
  showApplyButton = false,
  showPublishButton = false,
  showSaveButton = false,
  editableSections = ["header", "description", "business"],
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const jobDetailItems = [
    {
      icon: MapPin,
      label: "Location",
      value: jobData.businessLocInfo.location,
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
    {
      icon: DollarSign,
      label: "Hourly Wage",
      value: jobData.hourlyWage,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      icon: Clock,
      label: "Schedule",
      value: jobData.schedule,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: Globe,
      label: "Language Level",
      value: jobData.languageLevel,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      icon: Calendar,
      label: "Application Deadline",
      value: jobData.deadline,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-pretendard">
      <div className="max-w-6xl mx-auto px-5 lg:px-6">
        {/* Job Header */}
        <div className="py-6 lg:py-8">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Building2 className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                    {jobData.title}
                  </h1>
                  <p className="text-lg lg:text-xl text-gray-600 mb-3">{jobData.businessLocInfo.name}</p>
                </div>
                {showEditButtons && onEdit && editableSections.includes("header") && (
                  <button
                    onClick={() =>
                      onEdit("header", { title: jobData.title, business: jobData.businessLocInfo })
                    }
                    className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Job Description</h2>
            {showEditButtons && onEdit && editableSections.includes("description") && (
              <button
                onClick={() => onEdit("description", { description: jobData.jobDescription })}
                className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <p className="text-gray-700 leading-relaxed text-base">{jobData.jobDescription}</p>
          </div>
        </div>

        {/* Job Details */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Job Details</h2>
          </div>
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Skills & Personality</h2>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <Users className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-gray-800">Required Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {jobData.requiredSkills.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100"
                  >
                    #{skill.name_en}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-3">
                {mode === "preview" ? (
                  <CheckCircle className="w-5 h-5 text-purple-500" />
                ) : (
                  <Heart className="w-5 h-5 text-purple-500" />
                )}
                <h3 className="font-semibold text-gray-800">Personality Traits</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {jobData.requiredWorkStyles.map((ws) => (
                  <span
                    key={ws.id}
                    className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-100"
                  >
                    #{ws.name_en}
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
              src={jobData.businessLocInfo.logoImg}
              alt="Workplace"
              className="w-full h-64 lg:h-80 object-cover rounded-3xl shadow-lg"
            />
          </div>

          {/* Photo Thumbnails */}
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {jobData.businessLocInfo.extraPhotos
              .filter((photo) => photo)
              .map((photo, index) => (
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">About the Employer</h2>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 border border-indigo-100">
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed text-base">
                {jobData.businessLocInfo.bizDescription}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <Building2 className="w-5 h-5 text-indigo-500 mr-2" />
                What Makes Us Special
              </h3>
              <div className="flex flex-wrap gap-3">
                {jobData.businessLocInfo?.tags?.map((tag) => {
                  return (
                    <div
                      key={tag}
                      className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-indigo-200 shadow-sm"
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

      {/* Action Buttons */}
      {showApplyButton && onApply && (
        <>
          {/* Apply Button - Mobile Sticky */}
          <div className="lg:hidden px-4 py-6 bg-white border-t border-gray-100 sticky bottom-0 z-10">
            <button
              onClick={onApply}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Apply Now
            </button>
            <p className="text-center text-sm text-gray-500 mt-3">
              Application deadline: {jobData.deadline}
            </p>
          </div>

          {/* Apply Button - Desktop */}
          <div className="hidden lg:block max-w-6xl mx-auto px-6 pb-12">
            <button
              onClick={onApply}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-5 rounded-3xl font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Apply Now
            </button>
            <p className="text-center text-base text-gray-500 mt-4">
              Application deadline: {jobData.deadline}
            </p>
          </div>
        </>
      )}

      {showSaveButton && onPublish && (
        <>
          {/* Save Button - Mobile Sticky */}
          <div className="lg:hidden px-4 py-6 bg-white border-t border-gray-100 sticky bottom-0 z-10">
            <button
              onClick={onPublish}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Save Changes
            </button>
            <p className="text-center text-sm text-gray-500 mt-3">
              Your changes will be saved immediately
            </p>
          </div>

          {/* Save Button - Desktop */}
          <div className="hidden lg:block max-w-6xl mx-auto px-6 pb-12">
            <button
              onClick={onPublish}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-5 rounded-3xl font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Save Changes
            </button>
            <p className="text-center text-base text-gray-500 mt-4">
              Your changes will be saved immediately
            </p>
          </div>
        </>
      )}

      {showPublishButton && onPublish && (
        <>
          {/* Publish Button - Mobile Sticky */}
          <div className="lg:hidden px-4 py-6 bg-white border-t border-gray-100 sticky bottom-0 z-10">
            <button
              onClick={onPublish}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Publish Job Post
            </button>
            <p className="text-center text-sm text-gray-500 mt-3">
              Your job post will be live immediately after publishing
            </p>
          </div>

          {/* Publish Button - Desktop */}
          <div className="hidden lg:block max-w-6xl mx-auto px-6 pb-12">
            <button
              onClick={onPublish}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-5 rounded-3xl font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Publish Job Post
            </button>
            <p className="text-center text-base text-gray-500 mt-4">
              Your job post will be live immediately after publishing
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default JobPostView;
