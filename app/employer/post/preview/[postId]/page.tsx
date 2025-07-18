"use client";
import React, { useState } from "react";
import {
  MapPin,
  DollarSign,
  Clock,
  Calendar,
  Edit3,
  Building2,
  Star,
  Globe,
  Users,
  CheckCircle,
  Award,
  Zap,
  RefreshCw,
} from "lucide-react";
import PostHeader from "@/components/common/PostHeader";
import BaseDialog from "@/components/common/BaseDialog";

const JobPreviewEditPage: React.FC = () => {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Job data state
  const [jobData, setJobData] = useState({
    title: "Friendly Barista",
    company: "Café Luna",
    rating: 4.8,
    reviewCount: 156,
    location: "Downtown Vancouver, BC",
    hourlyWage: "$16.50/hr",
    schedule: "Part-time, 15-25 hrs/week",
    language: "English (Intermediate)",
    deadline: "December 15, 2024",
    description:
      "We're looking for an enthusiastic barista to join our cozy downtown café! You'll craft amazing coffee, create memorable customer experiences, and be part of a supportive team. Perfect for students or anyone looking for flexible hours in a vibrant environment.",
    skills: ["Customer Service", "Teamwork", "Communication", "Fast Learner", "Friendly Attitude"],
    personality: ["Outgoing", "Detail-Oriented", "Reliable"],
    employerTags: [
      "Family-friendly",
      "No experience required",
      "Quick hiring",
      "Flexible scheduling",
      "Staff discounts",
    ],
    employerDescription:
      "Café Luna is a locally-owned coffee shop that's been serving the Vancouver community for over 8 years. We pride ourselves on creating a warm, inclusive environment where both customers and staff feel at home.",
  });

  const [tempEditData, setTempEditData] = useState<any>({});

  const jobDetailItems = [
    {
      icon: MapPin,
      label: "Location",
      value: jobData.location,
      key: "location",
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
    {
      icon: DollarSign,
      label: "Hourly Wage",
      value: jobData.hourlyWage,
      key: "hourlyWage",
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      icon: Clock,
      label: "Schedule",
      value: jobData.schedule,
      key: "schedule",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: Globe,
      label: "Language Level",
      value: jobData.language,
      key: "language",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      icon: Calendar,
      label: "Application Deadline",
      value: jobData.deadline,
      key: "deadline",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
  ];

  const employerTagIcons = {
    "Family-friendly": CheckCircle,
    "No experience required": Award,
    "Quick hiring": Zap,
    "Flexible scheduling": Clock,
    "Staff discounts": DollarSign,
  };

  const handleEdit = (section: string, initialData?: any) => {
    setTempEditData(initialData || {});
    setEditingSection(section);
  };

  const handleSave = (section: string, data: any) => {
    setJobData((prev: any) => ({ ...prev, ...data }));
    setEditingSection(null);
    setTempEditData({});
  };

  const handleRegenerateDescription = async () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setJobData((prev: any) => ({
        ...prev,
        description:
          "Join our vibrant café team as a barista! You'll master the art of coffee making, provide exceptional customer service, and contribute to our welcoming atmosphere. We offer flexible scheduling perfect for students and provide comprehensive training. No prior experience necessary - just bring your enthusiasm and willingness to learn!",
      }));
      setIsRegenerating(false);
    }, 2000);
  };

  const handlePublish = () => {
    console.log("Publishing job post:", jobData);
    // Handle publish logic
  };

  return (
    <div className="min-h-screen bg-gray-50 font-pretendard">
      {/* Header */}
      <PostHeader previewMode />
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
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
                  <p className="text-lg lg:text-xl text-gray-600 mb-3">{jobData.company}</p>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium text-gray-700">{jobData.rating}</span>
                    <span className="text-sm text-gray-500">({jobData.reviewCount} reviews)</span>
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleEdit("header", { title: jobData.title, company: jobData.company })
                  }
                  className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Job Description */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">About This Role</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRegenerateDescription}
                disabled={isRegenerating}
                className="flex items-center space-x-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4${isRegenerating ? " animate-spin" : ""}`} />
                <span>{isRegenerating ? "Regenerating..." : "Regenerate"}</span>
              </button>
              <button
                onClick={() => handleEdit("description", { description: jobData.description })}
                className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <p className="text-gray-700 leading-relaxed text-base">{jobData.description}</p>
          </div>
        </div>
        {/* Job Details */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Job Details</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {jobDetailItems.map((item, index) => {
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
                {jobData.skills.map((skill, index) => (
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
                <CheckCircle className="w-5 h-5 text-purple-500" />
                <h3 className="font-semibold text-gray-800">Personality Traits</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {jobData.personality.map((trait, index) => (
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
        {/* Employer Info Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">About the Employer</h2>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 border border-indigo-100">
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed text-base">
                {jobData.employerDescription}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <Building2 className="w-5 h-5 text-indigo-500 mr-2" />
                What Makes Us Special
              </h3>
              <div className="flex flex-wrap gap-3">
                {jobData.employerTags.map((tag, index) => {
                  const IconComponent =
                    employerTagIcons[tag as keyof typeof employerTagIcons] || CheckCircle;
                  return (
                    <div
                      key={tag}
                      className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-indigo-200 shadow-sm"
                    >
                      <IconComponent className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm font-medium text-indigo-800">{tag}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Publish Button - Mobile Sticky */}
      <div className="lg:hidden px-4 py-6 bg-white border-t border-gray-100 sticky bottom-0 z-10">
        <button
          onClick={handlePublish}
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
          onClick={handlePublish}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-5 rounded-3xl font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Publish Job Post
        </button>
        <p className="text-center text-base text-gray-500 mt-4">
          Your job post will be live immediately after publishing
        </p>
      </div>
      {/* Edit Modals */}
      <BaseDialog
        type="bottomSheet"
        open={editingSection === "header"}
        onClose={() => setEditingSection(null)}
        title="Edit Job Header"
        actions={
          <>
            <button
              onClick={() => handleSave("header", tempEditData)}
              className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              Save Changes
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
            <input
              type="text"
              value={tempEditData.title || jobData.title}
              onChange={(e) => setTempEditData((prev: any) => ({ ...prev, title: e.target.value }))}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </BaseDialog>
      <BaseDialog
        type="bottomSheet"
        open={editingSection === "description"}
        onClose={() => setEditingSection(null)}
        title="Edit Job Description"
        actions={
          <>
            <button
              onClick={() => handleSave("description", tempEditData)}
              className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              Save Changes
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
            <textarea
              rows={6}
              value={tempEditData.description || jobData.description}
              onChange={(e) =>
                setTempEditData((prev: any) => ({ ...prev, description: e.target.value }))
              }
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Describe the role, responsibilities, and what makes this opportunity special..."
            />
          </div>
        </div>
      </BaseDialog>
    </div>
  );
};

export default JobPreviewEditPage;
