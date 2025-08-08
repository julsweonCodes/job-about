import { Building2, MapPin, Calendar, Users } from "lucide-react";
import { UrgentClientJobPost } from "@/types/client/employer";
import { getJobTypeName } from "@/utils/client/enumDisplayUtils";
import { getLocationDisplayName } from "@/constants/location";
import { getWorkTypeConfig } from "@/utils/client/styleUtils";

interface UrgentJobPostCardProps {
  jobPost: UrgentClientJobPost;
  onViewDetail: (id: string) => void;
  onViewApplicants: (id: string) => void;
}

export default function UrgentJobPostCard({
  jobPost,
  onViewDetail,
  onViewApplicants,
}: UrgentJobPostCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4 lg:mb-6 hover:shadow-md hover:border-gray-200 transition-all duration-200 lg:hover:scale-[1.02]">
      {/* Job Header */}
      <div className="p-5 lg:p-6">
        <div className="flex items-start gap-4 mb-4">
          <img
            src={jobPost.coverImage}
            alt={jobPost.title}
            className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl object-cover shadow-sm flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2 truncate">
              {jobPost.title}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              {jobPost.type && (
                <span
                  className={`px-3 py-1 rounded-full text-xs lg:text-sm font-medium ${getWorkTypeConfig(jobPost.type).className}`}
                >
                  {getWorkTypeConfig(jobPost.type).label}
                </span>
              )}
              {jobPost.jobType && (
                <span className="px-3 py-1 rounded-full text-xs lg:text-sm font-medium bg-gray-100 text-gray-700">
                  {getJobTypeName(jobPost.jobType)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center gap-2 text-sm lg:text-base text-gray-600">
            <Building2 className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
            <span className="font-medium">{jobPost.businessName}</span>
          </div>

          <div className="flex items-center gap-2 text-sm lg:text-base text-gray-600">
            <MapPin className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
            <span>{getLocationDisplayName(jobPost.location)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm lg:text-base text-gray-600">
            <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
            <span>
              {jobPost.strt_date} - {jobPost.deadline_date}
            </span>
          </div>
        </div>

        {/* Applicant Stats */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-5">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-500" />
            <span className="text-sm lg:text-base font-medium text-gray-700">
              {jobPost.totalApplicationsCnt} Total Applications
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span className="text-sm lg:text-base font-semibold text-amber-700">
              {jobPost.pendingReviewCnt} Pending
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => onViewDetail(jobPost.id)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 py-3 lg:py-4 px-4 rounded-xl font-semibold text-sm lg:text-base transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md flex items-center justify-center gap-2"
          >
            <span>View Details</span>
          </button>
          <button
            onClick={() => onViewApplicants(jobPost.id)}
            className="flex-1 bg-[#7C3AED] hover:bg-[#6D28D9] active:bg-[#5B21B6] text-white py-3 lg:py-4 px-4 rounded-xl font-semibold text-sm lg:text-base transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md flex items-center justify-center gap-2"
          >
            <span>View Applicants</span>
          </button>
        </div>
      </div>
    </div>
  );
}
