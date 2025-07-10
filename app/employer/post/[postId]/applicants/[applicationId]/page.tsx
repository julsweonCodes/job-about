"use client";

import React from "react";
import { MapPin, Clock, Globe, Calendar, User } from "lucide-react";
import BackHeader from "@/components/common/BackHeader";
import { Button } from "@/components/ui/Button";

function ApplicantDetailPage() {
  const workStyleTags = ["#QuietEnvironment", "#Teamwork", "#FastPacedPreferred"];
  const skillsTags = ["Customer Service", "Photoshop", "Barista"];

  const experiences = [
    {
      title: "Barista at Café Latte",
      period: "2022–2023",
      duration: "1 year",
    },
    {
      title: "Customer Service at Retail Store",
      period: "2021–2022",
      duration: "1 year",
    },
  ];

  const preferences = [
    {
      icon: Calendar,
      label: "Preferred Schedule",
      value: "Weekends",
      color: "emerald",
    },
    {
      icon: MapPin,
      label: "Preferred Location",
      value: "Toronto",
      color: "blue",
    },
    {
      icon: Globe,
      label: "Language Comfort",
      value: "Basic English only",
      color: "amber",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
      blue: "bg-blue-50 text-blue-700 border-blue-100",
      amber: "bg-amber-50 text-amber-700 border-amber-100",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getIconBgClasses = (color: string) => {
    const colors = {
      emerald: "bg-emerald-100 text-emerald-600",
      blue: "bg-blue-100 text-blue-600",
      amber: "bg-amber-100 text-amber-600",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <BackHeader title="Applicant Profile" />

      {/* Main Content */}
      <main className="pb-32 lg:pb-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Grid Layout */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8 lg:mt-10">
          {/* Left Column - Applicant Info & Work Style (Desktop) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Applicant Info */}
            <section className="bg-white backdrop-blur-sm mt-6 lg:mt-0 rounded-2xl p-6 lg:p-8 shadow-sm border border-white/50">
              <div className="flex lg:flex-col lg:items-center lg:text-center items-center space-x-4 lg:space-x-0 lg:space-y-4">
                <div className="relative">
                  <div className="w-20 lg:w-24 h-20 lg:h-24 bg-gradient-to-br from-purple-400 via-pink-400 to-rose-400 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white/50">
                    <User className="w-10 lg:w-12 h-10 lg:h-12 text-white" />
                  </div>
                </div>
                <div className="flex-1 lg:flex-none">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1 tracking-tight">
                    Sophia Chen
                  </h2>
                  <p className="text-gray-500 flex items-center lg:justify-center text-sm lg:text-base">
                    <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                    Applied 2 days ago
                  </p>
                </div>
              </div>
              {/* 데스크탑용 버튼 */}
              <div className="hidden lg:flex gap-4 mt-8">
                <Button variant="black">Deny</Button>
                <Button variant="default">Accept</Button>
              </div>
            </section>

            {/* Work Style Summary */}
            <section className="bg-white backdrop-blur-sm mt-4 lg:mt-0 rounded-2xl p-6 lg:p-8 shadow-sm border border-white/50">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4 lg:mb-6 tracking-tight">
                Work Style Summary
              </h3>

              <div className="flex flex-wrap gap-2 lg:gap-3 mb-5 lg:mb-6">
                {workStyleTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 lg:px-5 lg:py-2.5 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 rounded-full text-sm lg:text-base font-medium border border-purple-100/50 hover:from-purple-100 hover:to-pink-100 transition-all duration-200 cursor-default shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                This applicant thrives in friendly, high-paced environments where collaboration and
                focus blend seamlessly together.
              </p>
            </section>
          </div>

          {/* Right Column - Skills, Experience & Preferences (Desktop) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills & Experience */}
            <section className="bg-white backdrop-blur-sm mt-4 lg:mt-0 rounded-2xl p-6 lg:p-8 shadow-sm border border-white/50">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4 lg:mb-6 tracking-tight">
                Skills & Experience
              </h3>

              <div className="flex flex-wrap gap-2 lg:gap-3 mb-6 lg:mb-8">
                {skillsTags.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 lg:px-5 lg:py-2.5 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 rounded-full text-sm lg:text-base font-medium border border-blue-100/50 hover:from-blue-100 hover:to-cyan-100 transition-all duration-200 cursor-default shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="space-y-5 lg:space-y-6">
                {experiences.map((exp, index) => (
                  <div key={index} className="relative pl-8 lg:pl-10">
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-1.5 lg:top-2 w-4 h-4 lg:w-5 lg:h-5 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full shadow-sm ring-2 ring-white"></div>

                    {/* Timeline line */}
                    {index < experiences.length - 1 && (
                      <div className="absolute left-2 lg:left-2.5 top-6 lg:top-7 w-0.5 h-8 lg:h-10 bg-gradient-to-b from-purple-200 to-transparent"></div>
                    )}

                    <div className="pb-2">
                      <h4 className="font-semibold text-gray-900 mb-1 lg:mb-2 text-sm lg:text-base tracking-tight">
                        {exp.title}
                      </h4>
                      <div className="text-xs lg:text-sm text-gray-500 space-y-0.5 lg:space-y-1">
                        <p className="font-medium">{exp.period}</p>
                        <p className="text-gray-400">{exp.duration}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Job Preferences */}
            <section className="bg-white backdrop-blur-sm mt-4 lg:mt-0 rounded-2xl p-6 lg:p-8 shadow-sm border border-white/50">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-5 lg:mb-6 tracking-tight">
                Job Preferences
              </h3>

              <div className="space-y-4 lg:space-y-5">
                {preferences.map((pref, index) => {
                  const IconComponent = pref.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4 lg:space-x-5 group">
                      <div
                        className={`w-10 h-10 lg:w-12 lg:h-12 ${getIconBgClasses(pref.color)} rounded-xl flex items-center justify-center mt-0.5 shadow-sm group-hover:scale-105 transition-transform duration-200`}
                      >
                        <IconComponent className="w-4 h-4 lg:w-5 lg:h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm lg:text-base tracking-tight">
                          {pref.label}
                        </p>
                        <p
                          className={`text-sm lg:text-base mt-1 lg:mt-2 px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg inline-block ${getColorClasses(pref.color)} border font-medium`}
                        >
                          {pref.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* 모바일 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-white/20 px-4 sm:px-6 lg:px-8 py-6 shadow-2xl flex gap-4 lg:hidden">
        <Button variant="black" size="xl">
          Deny
        </Button>
        <Button variant="default" size="xl">
          Accept
        </Button>
      </div>
    </div>
  );
}

export default ApplicantDetailPage;
