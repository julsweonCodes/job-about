"use client";
import React from "react";
import { Calendar, Edit3, ChevronRight, Target } from "lucide-react";
import BackHeader from "@/components/common/BackHeader";

function EmployerMypage() {
  const user = {
    name: "Sarah Johnson",
    title: "Senior Product Designer",
    tagline: "Crafting meaningful digital experiences that connect people and solve real problems",
    avatar: "/images/img-default-profile.png",
    joinDate: "March 2024",
    location: "San Francisco, CA",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    profileCompletion: 85,
  };

  const workStyle = {
    type: "Empathetic Coordinator",
    description:
      "You thrive in collaborative, people-oriented roles where communication and teamwork drive success.",
    emoji: "🤝",
    traits: ["#Empathy", "#Customer-Focused", "#Positive Attitude", "#Team Player"],
    completedDate: "2 weeks ago",
  };

  const quickActions = [
    {
      id: "preferences",
      icon: Target,
      title: "Job Preferences",
      description: "Define your ideal role and workplace",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <BackHeader title="My Page" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4 sm:space-y-5">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 px-1 flex items-center justify-between">
          <span>My Profile</span>
          <Edit3 size={20} className="text-slate-600" />
        </h3>

        {/* 1. Profile Summary Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg shadow-slate-200/50 border border-white/50 overflow-hidden">
          <div className="p-5 sm:p-8">
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4 sm:gap-6">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">{user.name}</h2>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4 px-2 sm:px-0">
                  {user.tagline}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                    <span>Joined {user.joinDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Quick Actions */}
        <div className="space-y-4 sm:space-y-5">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 px-1">Quick Actions</h3>
          <div className="space-y-3 sm:space-y-4">
            {quickActions.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className="w-full bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg shadow-slate-200/50 border border-white/50 p-4 sm:p-6 hover:shadow-xl hover:shadow-slate-200/60 hover:bg-white/90 transition-all duration-300 group touch-manipulation active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 sm:gap-5 min-w-0 flex-1">
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${item.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}
                      >
                        <Icon size={20} className={`sm:w-6 sm:h-6 ${item.iconColor}`} />
                      </div>
                      <div className="text-left min-w-0 flex-1">
                        <h4 className="text-base sm:text-lg font-semibold text-slate-900 truncate mb-1">
                          {item.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-500 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      size={18}
                      className="sm:w-5 sm:h-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 ml-2"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Spacing for Mobile */}
        <div className="h-4 sm:h-0"></div>
      </div>
    </div>
  );
}

export default EmployerMypage;
