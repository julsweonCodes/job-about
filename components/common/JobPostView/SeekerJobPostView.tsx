"use client";
import React from "react";
import { JobPostData } from "@/types/client/jobPost";
import { formatDescription, formatDescriptionForPreLine } from "@/utils/client/textUtils";
import { getJobTypeName } from "@/constants/jobTypes";
import { MapPin, DollarSign, Clock, Calendar, Heart, Building2, Globe, Users } from "lucide-react";
import { getWorkTypeLabel } from "@/utils/client/enumDisplayUtils";
import { ApplicantStatus } from "@/constants/enums";

// Constants
const JOB_DETAIL_ITEMS = [
  {
    icon: DollarSign,
    label: "Hourly Wage",
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    icon: Clock,
    label: "Schedule",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    icon: Globe,
    label: "Language Level",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    icon: Calendar,
    label: "Application Deadline",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
  },
  {
    icon: Building2,
    label: "Job Type",
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
  },
  {
    icon: MapPin,
    label: "Work Type",
    color: "text-amber-500",
    bgColor: "bg-amber-50",
  },
];

interface SeekerJobPostViewProps {
  jobData: JobPostData;
  onApply?: () => void;
  onWithdraw?: () => void;
  onBookmark?: () => void;
  isBookmarked?: boolean;
}

// Sub-components
const JobHeader: React.FC<{ jobData: JobPostData }> = ({ jobData }) => (
  <div className="py-6 lg:py-8">
    <div className="flex flex-row items-center space-x-4">
      <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg overflow-hidden">
        <img
          src={jobData.businessLocInfo.logoImg}
          alt="Company Logo"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{jobData.title}</h1>
            <p className="text-lg lg:text-xl text-gray-600">{jobData.businessLocInfo.name}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const JobDescription: React.FC<{ jobData: JobPostData }> = ({ jobData }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold text-gray-900">Job Description</h2>
    </div>
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
      <p className="text-gray-700 whitespace-pre-line leading-relaxed text-base">
        {formatDescriptionForPreLine(jobData.jobDescription)}
      </p>
    </div>
  </div>
);

const JobDetails: React.FC<{ jobData: JobPostData }> = ({ jobData }) => {
  const jobDetailItems = JOB_DETAIL_ITEMS.map((item) => ({
    ...item,
    value: getJobDetailValue(jobData, item.label),
  }));

  return (
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
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-xl ${item.bgColor} flex-shrink-0`}>
                  <IconComponent className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-500">{item.label}</p>
                  </div>
                  <p className="text-base font-semibold text-gray-900 break-words">
                    {item.value?.toString() || ""}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SkillsAndPersonality: React.FC<{ jobData: JobPostData }> = ({ jobData }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-gray-900">Skills & Work Styles</h2>
    </div>
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-gray-800">Required Skills</h3>
          </div>
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
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold text-gray-800">Work Styles</h3>
          </div>
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
);

const WorkplacePhotos: React.FC<{ extraPhotos: string[] }> = ({ extraPhotos }) => {
  const photos = Array.isArray(extraPhotos) ? extraPhotos.filter((p) => !!p) : [];
  const [selectedPhotoIndex, setSelectedPhotoIndex] = React.useState(0);

  if (photos.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Workplace Photos</h2>

      {/* Main Photo */}
      <div className="mb-8">
        <img
          src={photos[selectedPhotoIndex]}
          alt="Workplace"
          className="w-full h-64 lg:h-80 object-cover rounded-3xl shadow-lg"
        />
      </div>

      {/* Photo Thumbnails */}
      {photos.length > 0 && (
        <div className="mt-8">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {photos.map((photo, index) => (
              <button
                key={index}
                onClick={() => setSelectedPhotoIndex(index)}
                className={`flex-shrink-0 w-24 h-24 rounded-xl transition-all ${
                  selectedPhotoIndex === index
                    ? "border-4 border-purple-500 shadow-lg"
                    : "border-2 border-gray-200 hover:border-gray-300"
                }`}
              >
                <img
                  src={photo}
                  alt={`Workplace ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const EmployerInfo: React.FC<{ jobData: JobPostData }> = ({ jobData }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-gray-900">About the Employer</h2>
    </div>
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 border border-indigo-100">
      {/* Company Description */}
      <div className="mb-4 sm:mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Building2 className="w-5 h-5 text-indigo-500" />
          <h3 className="font-semibold text-gray-800 text-lg">Company Description</h3>
        </div>
        <p className="text-gray-700 leading-relaxed text-base bg-white/60 rounded-2xl p-4 border border-indigo-100">
          {formatDescription(jobData.businessLocInfo.bizDescription)}
        </p>
      </div>

      {/* Company Details Grid */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        {/* Location */}
        <div className="bg-white/60 rounded-2xl p-5 border border-indigo-100 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-indigo-100 rounded-xl">
              <MapPin className="w-5 h-5 text-indigo-600" />
            </div>
            <h4 className="font-semibold text-gray-800">Location</h4>
          </div>
          <p className="text-gray-700 text-base leading-relaxed">
            {jobData.businessLocInfo.address}
          </p>
        </div>

        {/* Working Hours */}
        <div className="bg-white/60 rounded-2xl p-5 border border-indigo-100 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-800">Working Hours</h4>
          </div>
          <p className="text-gray-700 text-base leading-relaxed">
            {jobData.businessLocInfo.workingHours}
          </p>
        </div>
      </div>
    </div>
  </div>
);

const ActionButtons: React.FC<{
  onApply?: () => void;
  onWithdraw?: () => void;
  jobData?: JobPostData;
}> = ({ onApply, onWithdraw, jobData }) => {
  if (!onApply && !onWithdraw) return null;

  const status = jobData?.applicationStatus;
  const isFinalized = status === ApplicantStatus.REJECTED || status === ApplicantStatus.HIRED;

  const isAppliedOrInReview =
    status === ApplicantStatus.APPLIED || status === ApplicantStatus.IN_REVIEW;

  const isDisabled = isFinalized;

  const buttonLabel = isFinalized
    ? status === ApplicantStatus.REJECTED
      ? "Application Rejected"
      : "Hired"
    : isAppliedOrInReview
      ? "Cancel Application"
      : "Apply Now";

  const mobileBtnClass = isDisabled
    ? "w-full bg-gray-100 text-gray-400 py-4 rounded-2xl font-bold text-lg shadow-sm cursor-not-allowed"
    : isAppliedOrInReview
      ? "w-full bg-gray-200 text-gray-700 py-4 rounded-2xl font-bold text-lg shadow-sm hover:shadow-md transition-all duration-200"
      : "w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200";

  const desktopBtnClass = isDisabled
    ? "w-full bg-gray-100 text-gray-400 py-5 rounded-3xl font-bold text-xl shadow-sm cursor-not-allowed"
    : isAppliedOrInReview
      ? "w-full bg-gray-200 text-gray-700 py-5 rounded-3xl font-bold text-xl shadow-sm hover:shadow-md transition-all duration-200"
      : "w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-5 rounded-3xl font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-200";

  const handleClick = () => {
    if (isDisabled) return;
    if (isAppliedOrInReview) {
      onWithdraw?.();
    } else {
      onApply?.();
    }
  };

  return (
    <>
      {/* Mobile Sticky */}
      <div className="lg:hidden px-4 py-6 bg-white border-t border-gray-100 sticky bottom-0 z-10">
        <button onClick={handleClick} className={mobileBtnClass} disabled={isDisabled}>
          {buttonLabel}
        </button>
        <p className="text-center text-sm text-gray-500 mt-3">
          Application deadline: {jobData?.deadline}
        </p>
      </div>

      {/* Desktop */}
      <div className="hidden lg:block max-w-6xl mx-auto px-6 pb-12">
        <button onClick={handleClick} className={desktopBtnClass} disabled={isDisabled}>
          {buttonLabel}
        </button>
        <p className="text-center text-base text-gray-500 mt-4">
          Application deadline: {jobData?.deadline}
        </p>
      </div>
    </>
  );
};

// Utility functions
const getJobDetailValue = (jobData: JobPostData, label: string): string | undefined => {
  const valueMap: Record<string, string | undefined> = {
    "Hourly Wage": jobData.hourlyWage,
    Schedule: jobData.workSchedule,
    "Language Level": jobData.languageLevel,
    "Application Deadline": jobData.deadline,
    "Job Type": jobData.jobType ? getJobTypeName(jobData.jobType) : undefined,
    "Work Type": jobData.workType ? getWorkTypeLabel(jobData.workType) : undefined,
  };
  return valueMap[label];
};

const SeekerJobPostView: React.FC<SeekerJobPostViewProps> = ({ jobData, onApply, onWithdraw }) => {
  const extraPhotos =
    jobData.businessLocInfo.extraPhotos && jobData.businessLocInfo.extraPhotos.length > 0
      ? jobData.businessLocInfo.extraPhotos
      : [];

  return (
    <div className="min-h-screen bg-gray-50 font-pretendard">
      <div className="max-w-6xl mx-auto px-5 lg:px-6">
        <JobHeader jobData={jobData} />
        <JobDescription jobData={jobData} />
        <JobDetails jobData={jobData} />
        <SkillsAndPersonality jobData={jobData} />
        <WorkplacePhotos extraPhotos={extraPhotos} />
        <EmployerInfo jobData={jobData} />
      </div>

      <ActionButtons onApply={onApply} onWithdraw={onWithdraw} jobData={jobData} />
    </div>
  );
};

export default SeekerJobPostView;
