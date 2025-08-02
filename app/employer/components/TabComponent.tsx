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
}

export const TabComponent: React.FC<TabComponentProps> = ({ tabs, activeTab, onTabChange }) => {
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
