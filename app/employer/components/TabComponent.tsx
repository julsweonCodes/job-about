import React from "react";

interface Tab {
  id: string;
  label: string;
  count: number;
}

interface TabComponentProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  isLoading?: boolean;
}

// TabComponent 스켈레톤 컴포넌트
export const TabComponentSkeleton: React.FC = () => {
  return (
    <div className="flex space-x-3">
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          key={index}
          className="relative px-4 sm:px-6 py-2 sm:py-4 font-medium text-sm rounded-xl bg-gray-200 animate-pulse"
        >
          <div className="flex items-center space-x-2">
            <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
            <div className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full bg-gray-300 w-6 h-5 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const TabComponent: React.FC<TabComponentProps> = ({
  tabs,
  activeTab,
  onTabChange,
  isLoading = false,
}) => {
  if (isLoading) {
    return <TabComponentSkeleton />;
  }

  return (
    <div className="flex space-x-3">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`relative px-4 sm:px-6 py-2 sm:py-3 font-medium text-sm transition-all duration-300 rounded-xl ${
            activeTab === tab.id
              ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg transform scale-105"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-md"
          }`}
        >
          <div className="flex items-center space-x-2">
            <span
              className={`text-sm sm:text-base transition-colors duration-200 ${
                activeTab === tab.id ? "text-white" : "text-gray-700"
              }`}
            >
              {tab.label}
            </span>
            <span
              className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-white/20 text-white backdrop-blur-sm"
                  : "bg-white text-gray-600"
              }`}
            >
              {tab.count}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};
