import React from "react";
import { Calendar } from "lucide-react";
import { Applicant } from "@/types/job";
import { ApplicantStatus } from "@/constants/enums";

interface ApplicantCardProps {
  applicant: Applicant;
  getStatusColor: (status: ApplicantStatus) => string;
  getStatusIcon: (status: ApplicantStatus) => React.ReactNode;
  getActionButton: (applicant: Applicant) => React.ReactNode;
  formatDate: (dateString: string) => string;
}

const ApplicantCard: React.FC<ApplicantCardProps> = ({
  applicant,
  getStatusColor,
  getStatusIcon,
  getActionButton,
  formatDate,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 lg:p-6 hover:shadow-md hover:border-gray-200 transition-all duration-200 lg:hover:scale-[1.02]">
      {/* Applicant Header */}
      <div className="flex items-start gap-4 mb-4">
        <img
          src={applicant.profile_image_url || ""}
          alt={applicant.name || ""}
          className="w-14 h-14 lg:w-16 lg:h-16 rounded-full object-cover shadow-sm flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-1">{applicant.name}</h3>
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs lg:text-sm font-medium border ${getStatusColor(applicant.status as ApplicantStatus)}`}
            >
              {getStatusIcon(applicant.status as ApplicantStatus)}
              <span className="capitalize">{String(applicant.status).replace("_", " ")}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Applicant Info */}
      <div className="mb-4">
        <p className="text-sm lg:text-base text-gray-600 mb-3 leading-relaxed">
          {applicant.description}
        </p>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <Calendar className="w-4 h-4" />
          <span>Applied {applicant.applied_date ? formatDate(applicant.applied_date) : ""}</span>
          <span className="text-gray-300">•</span>
          <span>{applicant.experience} experience</span>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {applicant.skills?.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs lg:text-sm font-medium rounded-full transition-colors duration-200"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end">{getActionButton(applicant)}</div>
    </div>
  );
};

export default ApplicantCard;
