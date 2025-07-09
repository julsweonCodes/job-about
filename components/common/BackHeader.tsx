import React from "react";
import { ArrowLeft } from "lucide-react";

interface BackHeaderProps {
  title: string;
  subtitle?: string;
  onClickBack?: () => void;
}

export default function BackHeader({ title, onClickBack }: BackHeaderProps) {
  const handleBack = () => {
    if (onClickBack) {
      onClickBack();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
      <div className="max-w-md mx-auto lg:max-w-4xl xl:max-w-6xl  px-3 py-2 sm:px-6 sm:py-4">
        <div className="flex items-center">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex-1 text-center lg:text-left lg:ml-4 pr-10 lg:pr-0">
            <h1 className="text-lg lg:text-2xl font-semibold text-gray-900">{title}</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
