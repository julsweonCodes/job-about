import React from "react";
import { Settings, CheckCircle } from "lucide-react";

interface UserProfileProps {
  name: string;
  subtitle: string;
  onEditProfile: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ name, subtitle, onEditProfile }) => {
  return (
    <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4 lg:space-x-5">
          <div className="relative">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl lg:text-2xl">
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 lg:w-8 lg:h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
              <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">{name}</h1>
            <p className="text-sm lg:text-base text-gray-600 flex items-center">
              {subtitle}
              <span className="ml-2 w-2 h-2 bg-emerald-400 rounded-full"></span>
            </p>
          </div>
        </div>
        <button
          onClick={onEditProfile}
          className="p-3 lg:p-4 hover:bg-gray-50 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <Settings className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600" />
        </button>
      </div>
    </div>
  );
};
