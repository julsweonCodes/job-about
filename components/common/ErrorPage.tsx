"use client";
import React from "react";
import { Home } from "lucide-react";
import { ERROR_MESSAGES } from "@/constants/errors";

interface ErrorPageProps {
  statusCode: number;
  onGoHome?: () => void;
  onReportIssue?: () => void;
  showReportButton?: boolean;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  statusCode,
  onGoHome = () => (window.location.href = "/"),
}) => {
  const errorInfo =
    ERROR_MESSAGES[statusCode as keyof typeof ERROR_MESSAGES] || ERROR_MESSAGES[500];
  const IconComponent = errorInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full text-center pb-24 md:pb-0">
        {/* Status Code Badge */}
        <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white rounded-full mb-6 md:mb-8 shadow-lg border border-gray-100">
          <span className={`text-xl md:text-2xl font-bold ${errorInfo.color}`}>{statusCode}</span>
        </div>

        {/* Error Icon and Emoji */}
        <div className="flex items-center justify-center space-x-3 md:space-x-4 mb-8 md:mb-12">
          <div className="relative">
            <div
              className={`absolute inset-0 bg-gradient-to-r ${errorInfo.bgGradient} rounded-full blur-xl opacity-20`}
            ></div>
            <div className="relative bg-white rounded-full p-4 md:p-6 shadow-xl border border-gray-100">
              <IconComponent className={`w-8 h-8 md:w-12 md:h-12 ${errorInfo.color}`} />
            </div>
          </div>
          <div className="text-4xl md:text-6xl animate-bounce">{errorInfo.emoji}</div>
        </div>

        {/* Error Content */}
        <div className="mb-8 md:mb-12 px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
            {errorInfo.title}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-3 md:mb-4 leading-relaxed">
            {errorInfo.message}
          </p>
          <p className="text-base md:text-lg text-gray-500 leading-relaxed max-w-xl mx-auto">
            {errorInfo.description}
          </p>
        </div>

        {/* 데스크탑용 버튼 */}
        <div className="hidden md:flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center px-4">
          <button
            onClick={onGoHome}
            className={`group relative inline-flex items-center justify-center min-w-[300px] sm:px-10 sm:py-4 text-base md:text-lg font-semibold text-white bg-gradient-to-r ${errorInfo.bgGradient} rounded-full hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-opacity-50 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-xl w-full sm:w-auto`}
          >
            <Home className="w-4 h-4 md:w-5 md:h-5 mr-2 group-hover:animate-pulse" />
            Go to Home
          </button>
        </div>
      </div>
      {/* 모바일 하단 고정 버튼 */}
      <div className="md:hidden fixed left-0 right-0 bottom-0 z-50 p-4 bg-white">
        <button
          onClick={onGoHome}
          className={`group relative inline-flex items-center justify-center w-full px-6 py-4 text-base font-semibold text-white bg-gradient-to-r ${errorInfo.bgGradient} rounded-xl hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-opacity-50 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-xl`}
        >
          <Home className="w-5 h-5 mr-2 group-hover:animate-pulse" />
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
