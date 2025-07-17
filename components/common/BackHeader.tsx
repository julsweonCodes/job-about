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
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <div className="flex-1 text-center lg:text-left lg:ml-4 pr-10 lg:pr-0">
              <div className="text-xl md:text-2xl font-bold text-black ">{title}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
