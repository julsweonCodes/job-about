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
import { JobPostData } from "@/types/jobPost";
import { formatDescription, formatDescriptionForPreLine } from "@/utils/client/textUtils";
import { getJobTypeName } from "@/constants/jobTypes";
import { JobPostPayload } from "@/types/employer";

// Types
interface JobPostViewProps {
  jobData: JobPostData | null;
  mode?: "employer" | "seeker" | "preview" | "edit";
  onEdit?: (section: string, data: any) => void;
  onApply?: () => void;
  onBookmark?: () => void;
  onPublish?: () => void;
  onSaveEdit?: () => void;
  isBookmarked?: boolean;
  showEditButtons?: boolean;
  showApplyButton?: boolean;
  showPublishButton?: boolean;
  showSaveEditButton?: boolean;
  editableSections?: string[];
  useAI?: boolean;
  geminiRes?: string[];
  jobDescriptions?: {
    manual: string;
    struct1: string;
    struct2: string;
  };
  selectedVersion?: "manual" | "struct1" | "struct2";
  onSelectVersion?: (v: "manual" | "struct1" | "struct2") => void;
  isDraft?: boolean;
  onGeminiClicked?: () => void;
}

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
];

// Sub-components
const JobHeader: React.FC<{
  jobData: JobPostData;
  mode: string;
  showEditButtons: boolean;
  onEdit?: (section: string, data: any) => void;
  editableSections: string[];
}> = ({ jobData, mode, showEditButtons, onEdit, editableSections }) => (
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
          {mode === "edit" && showEditButtons && onEdit && editableSections.includes("header") && (
            <button
              onClick={() =>
                onEdit("header", {
                  title: jobData.title,
                  business: jobData.businessLocInfo,
                })
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
);

const JobDescription: React.FC<{
  jobData: JobPostData;
  mode: string;
  showEditButtons: boolean;
  onEdit?: (section: string, data: any) => void;
  editableSections: string[];
  useAI?: boolean;
  geminiRes?: string[];
  jobDescriptions?: any;
  selectedVersion?: string;
  onSelectVersion?: (v: "manual" | "struct1" | "struct2") => void;
  isDraft?: boolean;
  onGeminiClicked?: () => void;
}> = ({
  jobData,
  mode,
  showEditButtons,
  onEdit,
  editableSections,
  useAI,
  geminiRes,
  jobDescriptions,
  selectedVersion,
  onSelectVersion,
  isDraft,
  onGeminiClicked,
}) => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold text-gray-900">Job Description</h2>
      {showEditButtons && onEdit && editableSections.includes("description") && !useAI && isDraft && (
        <button
          onClick={() => onGeminiClicked?.()}
          className="px-3 py-1.5 text-sm bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200"
        >Gemini</button>
      )}
      {showEditButtons && onEdit && editableSections.includes("description") && !useAI && (
        <button
          onClick={() =>
            onEdit("description", {
              description: jobDescriptions?.manual || jobData.jobDescription,
              selectedVersion: "manual",
            })
          }
          className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      )}
    </div>
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
      {mode === "preview" && useAI && geminiRes?.length === 2 ? (
        (["manual", "struct1", "struct2"] as const).map((versionKey) => {
          const labelMap = {
            manual: "Manual Description",
            struct1: "AI Structure 1",
            struct2: "AI Structure 2",
          };

          const valueMap: Record<"manual" | "struct1" | "struct2", string | undefined> = {
            manual: jobDescriptions?.manual || jobData.jobDescription,
            struct1: jobDescriptions?.struct1 || geminiRes[0],
            struct2: jobDescriptions?.struct2 || geminiRes[1],
          };

          const isSelected = versionKey === selectedVersion;

          return (
            <div
              key={versionKey}
              className={`p-4 border rounded-xl transition-all ${
                isSelected ? "border-purple-500 bg-purple-50" : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500 font-medium">{labelMap[versionKey]}</p>
                {showEditButtons && onEdit && editableSections.includes("description") && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // 현재 버전의 데이터를 정확히 전달
                      const currentVersionData = valueMap[versionKey];

                      // 편집 버튼 클릭 시 해당 버전 선택
                      onSelectVersion?.(versionKey);

                      onEdit("description", {
                        description: currentVersionData,
                        selectedVersion: versionKey,
                      });
                    }}
                    className="p-1.5 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div onClick={() => onSelectVersion?.(versionKey)} className="cursor-pointer">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed text-base">
                  {valueMap[versionKey]}
                </p>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-gray-700 whitespace-pre-line leading-relaxed text-base">
          {formatDescriptionForPreLine(jobDescriptions?.manual || jobData.jobDescription)}
        </p>
      )}
    </div>
  </div>
);

const JobDetails: React.FC<{
  jobData: JobPostData;
  mode: string;
  showEditButtons: boolean;
  onEdit?: (section: string, data: any) => void;
  editableSections: string[];
}> = ({ jobData, mode, showEditButtons, onEdit, editableSections }) => {
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
                    {mode === "edit" &&
                      showEditButtons &&
                      onEdit &&
                      editableSections.includes("jobDetails") && (
                        <button
                          onClick={() => {
                            const editData: any = {};
                            let sectionName = "jobDetails";

                            switch (item.label) {
                              case "Hourly Wage":
                                editData.hourlyWage = jobData.hourlyWage;
                                sectionName = "jobDetails.hourlyWage";
                                break;
                              case "Schedule":
                                editData.workSchedule = jobData.workSchedule;
                                sectionName = "jobDetails.workSchedule";
                                break;
                              case "Language Level":
                                editData.languageLevel = jobData.languageLevel;
                                sectionName = "jobDetails.languageLevel";
                                break;
                              case "Application Deadline":
                                editData.deadline = jobData.deadline;
                                sectionName = "jobDetails.deadline";
                                break;
                              case "Job Type":
                                editData.jobType = jobData.jobType;
                                sectionName = "jobDetails.jobType";
                                break;
                            }
                            onEdit(sectionName, editData);
                          }}
                          className="p-1.5 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
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

const SkillsAndPersonality: React.FC<{
  jobData: JobPostData;
  mode: string;
  showEditButtons: boolean;
  onEdit?: (section: string, data: any) => void;
  editableSections: string[];
}> = ({ jobData, mode, showEditButtons, onEdit, editableSections }) => (
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
          {mode === "edit" &&
            showEditButtons &&
            onEdit &&
            editableSections.includes("skillsAndStyles") && (
              <button
                onClick={() =>
                  onEdit("skillsAndStyles.requiredSkills", {
                    requiredSkills: jobData.requiredSkills,
                  })
                }
                className="p-1.5 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
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
            {mode === "preview" ? (
              <CheckCircle className="w-5 h-5 text-purple-500" />
            ) : (
              <Heart className="w-5 h-5 text-purple-500" />
            )}
            <h3 className="font-semibold text-gray-800">Work Styles</h3>
          </div>
          {mode === "edit" &&
            showEditButtons &&
            onEdit &&
            editableSections.includes("skillsAndStyles") && (
              <button
                onClick={() =>
                  onEdit("skillsAndStyles.requiredWorkStyles", {
                    requiredWorkStyles: jobData.requiredWorkStyles,
                  })
                }
                className="p-1.5 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
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
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Workplace Photos</h2>

      {/* Main Photo */}
      <div className="mb-8">
        <img
          src={extraPhotos[selectedPhotoIndex]}
          alt="Workplace"
          className="w-full h-64 lg:h-80 object-cover rounded-3xl shadow-lg"
        />
      </div>

      {/* Photo Thumbnails */}
      {extraPhotos && extraPhotos.length > 0 && (
        <div className="mt-8">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {extraPhotos
              .filter((photo) => photo)
              .map((photo, index) => (
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
  showApplyButton?: boolean;
  showPublishButton?: boolean;
  showSaveEditButton?: boolean;
  onApply?: () => void;
  onPublish?: () => void;
  onSaveEdit?: () => void;
  jobData?: JobPostData;
  isDraft?: boolean;
}> = ({
  showApplyButton,
  showPublishButton,
  showSaveEditButton,
  onApply,
  onPublish,
  onSaveEdit,
  jobData,
  isDraft = false,
}) => {
  const renderButton = (type: "apply" | "publish" | "saveEdit") => {
    const config = {
      apply: {
        show: showApplyButton,
        onClick: onApply,
        text: "Apply Now",
        description: `Application deadline: ${jobData?.deadline}`,
      },
      publish: {
        show: showPublishButton,
        onClick: onPublish,
        text: isDraft ? "Publish Draft" : "Publish Job Post",
        description: isDraft
          ? "Your draft will be published and become live immediately"
          : "Your job post will be live immediately after publishing",
      },
      saveEdit: {
        show: showSaveEditButton,
        onClick: onSaveEdit,
        text: "Save Changes",
        description: "Your changes will be saved immediately",
      },
    };

    const buttonConfig = config[type];
    if (!buttonConfig.show || !buttonConfig.onClick) return null;

    return (
      <>
        {/* Mobile Sticky */}
        <div className="lg:hidden px-4 py-6 bg-white border-t border-gray-100 sticky bottom-0 z-10">
          <button
            onClick={buttonConfig.onClick}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {buttonConfig.text}
          </button>
          <p className="text-center text-sm text-gray-500 mt-3">{buttonConfig.description}</p>
        </div>

        {/* Desktop */}
        <div className="hidden lg:block max-w-6xl mx-auto px-6 pb-12">
          <button
            onClick={buttonConfig.onClick}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-5 rounded-3xl font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {buttonConfig.text}
          </button>
          <p className="text-center text-base text-gray-500 mt-4">{buttonConfig.description}</p>
        </div>
      </>
    );
  };

  return (
    <>
      {renderButton("apply")}
      {renderButton("publish")}
      {renderButton("saveEdit")}
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
  };
  return valueMap[label];
};

// JobPostView Skeleton 컴포넌트
const JobPostViewSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gray-50 font-pretendard">
    <div className="max-w-6xl mx-auto px-5 lg:px-6">
      {/* Job Header Skeleton */}
      <div className="py-6 lg:py-8">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gray-200 rounded-3xl animate-pulse flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="space-y-3">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
            </div>
          </div>
        </div>
      </div>

      {/* Job Description Skeleton */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-32" />
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-4 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* Job Details Skeleton */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-24" />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start space-x-4">
                <div className="w-11 h-11 bg-gray-200 rounded-xl animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills & Personality Skeleton */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-40" />
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
              <div className="h-5 bg-gray-200 rounded animate-pulse w-32" />
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-8 bg-gray-200 rounded-full animate-pulse w-24" />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
              <div className="h-5 bg-gray-200 rounded animate-pulse w-36" />
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-8 bg-gray-200 rounded-full animate-pulse w-28" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Workplace Photos Skeleton */}
      <div className="mb-8">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mb-6" />
        <div className="mb-8">
          <div className="w-full h-64 lg:h-80 bg-gray-200 rounded-3xl animate-pulse" />
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="w-24 h-24 bg-gray-200 rounded-xl animate-pulse flex-shrink-0"
            />
          ))}
        </div>
      </div>

      {/* Employer Info Skeleton */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-36" />
        </div>
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 border border-indigo-100">
          <div className="mb-6">
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-4 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center mb-4">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse mr-2" />
              <div className="h-5 bg-gray-200 rounded animate-pulse w-40" />
            </div>
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-8 bg-gray-200 rounded-full animate-pulse w-32" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Action Button Skeleton */}
    <div className="lg:hidden px-4 py-6 bg-white border-t border-gray-100 sticky bottom-0 z-10">
      <div className="h-14 bg-gray-200 rounded-2xl animate-pulse" />
      <div className="h-4 bg-gray-200 rounded animate-pulse w-48 mx-auto mt-3" />
    </div>

    <div className="hidden lg:block max-w-6xl mx-auto px-6 pb-12">
      <div className="h-16 bg-gray-200 rounded-3xl animate-pulse" />
      <div className="h-5 bg-gray-200 rounded animate-pulse w-56 mx-auto mt-4" />
    </div>
  </div>
);

// Main component
const JobPostView: React.FC<JobPostViewProps> = ({
  jobData,
  mode = "seeker",
  onEdit,
  onApply,
  onPublish,
  onSaveEdit,
  showEditButtons = false,
  showApplyButton = false,
  showPublishButton = false,
  showSaveEditButton = false,
  editableSections = ["header", "description", "business", "jobDetails", "skillsAndStyles"],
  useAI,
  geminiRes,
  jobDescriptions,
  selectedVersion,
  onSelectVersion,
  isDraft = false,
  onGeminiClicked,
}) => {
  // jobData가 없으면 skeleton 표시
  if (!jobData) {
    return <JobPostViewSkeleton />;
  }

  const extraPhotos =
    jobData.businessLocInfo.extraPhotos && jobData.businessLocInfo.extraPhotos.length > 0
      ? jobData.businessLocInfo.extraPhotos
      : [];

  return (
    <div className="min-h-screen bg-gray-50 font-pretendard">
      <div className="max-w-6xl mx-auto px-5 lg:px-6">
        <JobHeader
          jobData={jobData}
          mode={mode}
          showEditButtons={showEditButtons}
          onEdit={onEdit}
          editableSections={editableSections}
        />

        <JobDescription
          jobData={jobData}
          mode={mode}
          showEditButtons={showEditButtons}
          onEdit={onEdit}
          editableSections={editableSections}
          useAI={useAI}
          geminiRes={geminiRes}
          jobDescriptions={jobDescriptions}
          selectedVersion={selectedVersion}
          onSelectVersion={onSelectVersion}
          isDraft={isDraft}
          onGeminiClicked={onGeminiClicked}
        />

        <JobDetails
          jobData={jobData}
          mode={mode}
          showEditButtons={showEditButtons}
          onEdit={onEdit}
          editableSections={editableSections}
        />

        <SkillsAndPersonality
          jobData={jobData}
          mode={mode}
          showEditButtons={showEditButtons}
          onEdit={onEdit}
          editableSections={editableSections}
        />

        <WorkplacePhotos extraPhotos={extraPhotos} />

        <EmployerInfo jobData={jobData} />
      </div>

      <ActionButtons
        showApplyButton={showApplyButton}
        showPublishButton={showPublishButton}
        showSaveEditButton={showSaveEditButton}
        onApply={onApply}
        onPublish={onPublish}
        onSaveEdit={onSaveEdit}
        jobData={jobData}
        isDraft={isDraft}
      />
    </div>
  );
};

export { JobPostViewSkeleton };
export default JobPostView;
