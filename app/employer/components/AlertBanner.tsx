import React from "react";
import { AlertCircle, X } from "lucide-react";

interface AlertBannerProps {
  message: string;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ message }) => {
  return (
    <div className="bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 border-2 border-orange-200 rounded-3xl p-4 lg:p-6 flex items-start space-x-4 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
          <AlertCircle className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600" />
        </div>
      </div>
      <div className="flex-1">
        <p className="text-sm lg:text-base font-semibold text-orange-900 mb-1">Action Required</p>
        <p className="text-sm lg:text-base text-orange-800">{message}</p>
      </div>
    </div>
  );
};
