import { ApplicantStatus } from "@/constants/enums";
import React from "react";

interface StatusCounts {
  all: number;
  applied: number;
  in_review: number;
  hired: number;
  rejected: number;
}

interface ApplicantFilterTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  statusCounts: StatusCounts;
}

const statusTabs = [
  { key: "all", label: "All" },
  { key: ApplicantStatus.APPLIED, label: "Applied" },
  { key: ApplicantStatus.IN_REVIEW, label: "In Review" },
  { key: ApplicantStatus.HIRED, label: "Hired" },
  { key: ApplicantStatus.REJECTED, label: "Rejected" },
];

const ApplicantFilterTabs: React.FC<ApplicantFilterTabsProps> = ({
  activeTab,
  onTabChange,
  statusCounts,
}) => {
  const tabsWithCounts = statusTabs.map((tab) => ({
    ...tab,
    count: statusCounts[tab.key as keyof typeof statusCounts],
  }));

  return (
    <div className="bg-white border-b border-gray-100 sticky top-[64px] lg:top-[78px] z-10">
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide py-3">
          {tabsWithCounts.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm sm:text-base whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-[#7C3AED] text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  activeTab === tab.key ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApplicantFilterTabs;
