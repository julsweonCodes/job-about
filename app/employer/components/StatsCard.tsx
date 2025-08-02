import React from "react";
import { Briefcase, Users } from "lucide-react";

interface StatsCardProps {
  activeJobs: number;
  activeApplicants: number;
  statusUpdateNeeded: number;
}

// StatsCard 스켈레톤 컴포넌트
export const StatsCardSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-3xl p-4 md:p-6 lg:p-8 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-gray-200 animate-pulse"></div>
          </div>
          <div className="h-8 md:h-10 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <div className="h-4 md:h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  );
};

export const StatsCard: React.FC<StatsCardProps> = ({
  activeJobs,
  activeApplicants,
  statusUpdateNeeded,
}) => {
  const stats = [
    {
      label: "Active Jobs",
      value: activeJobs,
      icon: Briefcase,
      color: "text-blue-600 bg-blue-50",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      label: "Active Applicants",
      value: activeApplicants,
      icon: Users,
      color: "text-emerald-600 bg-emerald-50",
      gradient: "from-emerald-500 to-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-3xl p-4 md:p-6 lg:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`inline-flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 rounded-2xl ${stat.color}`}
            >
              <stat.icon className="w-6 h-6 md:w-7 md:h-7" />
            </div>
          </div>
          <div className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
          <div className="text-sm md:text-base text-gray-600 font-medium">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};
