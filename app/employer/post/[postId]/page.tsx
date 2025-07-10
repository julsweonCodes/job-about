"use client";
import React, { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import {
  MapPin,
  DollarSign,
  Clock,
  Calendar,
  Heart,
  Bookmark,
  Building2,
  Star,
  ChevronLeft,
} from "lucide-react";

const jobDetails = {
  title: "Cashier",
  company: "Fresh Market Grocery",
  rating: 4.5,
  location: "123 Main St, Anytown",
  hourlyWage: "$15/hr",
  schedule: "Flexible, 10–20 hrs/week",
  deadline: "August 15",
  description:
    "Join our team as a friendly cashier! You'll handle transactions, assist customers, and keep the store tidy. No experience needed, just a positive attitude and willingness to learn. Perfect for students or those seeking a flexible schedule.",
  companyPhotos: [
    "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2",
    "https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2",
    "https://images.pexels.com/photos/2292837/pexels-photo-2292837.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2",
    "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2",
    "https://images.pexels.com/photos/1797428/pexels-photo-1797428.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2",
  ],
};

const jobDetailItems = [
  {
    icon: MapPin,
    label: "Location",
    value: jobDetails.location,
    color: "text-red-500",
  },
  {
    icon: DollarSign,
    label: "Hourly Wage",
    value: jobDetails.hourlyWage,
    color: "text-green-500",
  },
  {
    icon: Clock,
    label: "Schedule",
    value: jobDetails.schedule,
    color: "text-blue-500",
  },
  {
    icon: Calendar,
    label: "Application Deadline",
    value: jobDetails.deadline,
    color: "text-orange-500",
  },
];

function JobDetailCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-soft border border-gray-100">
      <div className="flex items-center space-x-3 lg:space-x-4">
        <div className={`p-2 lg:p-3 rounded-xl bg-gray-50 ${color}`}>
          <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
        </div>
        <div className="flex-1">
          <p className="text-sm lg:text-base font-medium text-gray-500 mb-1">{label}</p>
          <p className="text-base lg:text-lg font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

const JobDetailPage: React.FC = () => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-100 font-pretendard">
      <div className="md:max-w-6xl mx-auto bg-white min-h-screen">
        <PageHeader
          leftIcon={<ChevronLeft className="w-6 h-6 text-gray-700" />}
          onClickLeft={handleBack}
          rightIcon={<Bookmark className="w-5 h-5 md:w-6 md:h-6" />}
          onClickRight={() => {}}
        />
        {/* Job Header */}
        <div className="bg-white px-5 lg:px-8 py-6 lg:py-8 border-b border-gray-100">
          <div className="flex items-start space-x-4 lg:space-x-6">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Building2 className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-1 lg:mb-2">
                {jobDetails.title}
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 mb-2 lg:mb-3">{jobDetails.company}</p>
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
                    {jobDetails.description}
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
                    src={jobDetails.companyPhotos[selectedPhotoIndex]}
                    alt="Workplace"
                    className="w-full h-48 lg:h-64 object-cover rounded-2xl shadow-card"
                  />
                </div>

                {/* Photo Thumbnails */}
                <div className="flex space-x-3 lg:space-x-4 overflow-x-auto pb-2">
                  {jobDetails.companyPhotos.map((photo, index) => (
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

            {/* 데스크탑(PC)용 Apply Now 버튼: 두 컬럼 아래 전체 너비 */}
            <div className="hidden lg:block lg:col-span-2 mt-8">
              <button
                onClick={() => alert("지원하기 (구현 예정)")}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 lg:py-5 rounded-2xl font-bold text-lg lg:text-xl shadow-purple hover:shadow-lg transition-all duration-200"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>

        {/* Apply Button - Mobile Only */}
        <div className="lg:hidden px-5 py-6 bg-white border-t border-gray-100 sticky bottom-0">
          <button
            onClick={() => alert("지원하기 (구현 예정)")}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-2xl font-bold text-lg shadow-purple hover:shadow-lg transition-all duration-200"
          >
            Apply Now
          </button>
          <p className="text-center text-sm text-gray-500 mt-3">
            Application deadline: {jobDetails.deadline}
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
