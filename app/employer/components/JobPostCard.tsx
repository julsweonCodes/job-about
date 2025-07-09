import React from "react";
import { MapPin, Calendar, Eye, Users, ChevronRight, Clock } from "lucide-react";

interface JobPost {
  id: string;
  title: string;
  type: "Full-Time" | "Part-Time";
  wage: string;
  location: string;
  dateRange: string;
  businessName: string;
  description: string;
  applicants: number;
  views: number;
  needsUpdate: boolean;
  coverImage?: string;
}

interface JobPostCardProps {
  job: JobPost;
  onView: (id: string) => void;
  onViewApplicants: (id: string) => void;
}

export const JobPostCard: React.FC<JobPostCardProps> = ({ job, onView, onViewApplicants }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {job.coverImage && (
        <div className="h-40 lg:h-48 bg-gradient-to-r from-blue-400 to-purple-500 relative overflow-hidden">
          <img
            src={job.coverImage}
            alt={job.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          {job.needsUpdate && (
            <div className="absolute top-4 right-4 flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-orange-700">Update needed</span>
            </div>
          )}
        </div>
      )}

      <div className="p-6 lg:p-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <h3 className="font-bold text-gray-900 text-lg lg:text-xl">{job.title}</h3>
              {job.needsUpdate && !job.coverImage && (
                <div className="flex items-center space-x-1 bg-orange-50 rounded-full px-2 py-1">
                  <Clock className="w-3 h-3 text-orange-600" />
                  <span className="text-xs font-medium text-orange-700">Update</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-3 mb-3">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                  job.type === "Full-Time"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {job.type}
              </span>
              <span className="text-sm lg:text-base font-bold text-gray-900">{job.wage}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-5">
          <div className="flex items-center text-sm lg:text-base text-gray-600">
            <MapPin className="w-4 h-4 lg:w-5 lg:h-5 mr-3 text-gray-400" />
            {job.location}
          </div>
          <div className="flex items-center text-sm lg:text-base text-gray-600">
            <Calendar className="w-4 h-4 lg:w-5 lg:h-5 mr-3 text-gray-400" />
            {job.dateRange}
          </div>
        </div>

        <p className="text-sm lg:text-base text-gray-700 mb-6 leading-relaxed">{job.description}</p>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-6">
            <div className="flex items-center text-sm lg:text-base text-gray-600">
              <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mr-2">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-medium">{job.applicants}</span>
              <span className="ml-1 text-gray-500">applicants</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => onView(job.id)}
            className="flex-1 bg-gray-50 text-gray-700 py-3 lg:py-4 px-6 rounded-2xl font-semibold hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            View Details
          </button>
          <button
            onClick={() => onViewApplicants(job.id)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 lg:py-4 px-6 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center shadow-lg"
          >
            <span>View Applicants</span>
            <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};
