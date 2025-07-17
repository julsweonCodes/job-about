"use client";
import React, { useState } from "react";
import {
  User,
  Settings,
  Briefcase,
  Heart,
  Calendar,
  MapPin,
  Edit3,
  ChevronRight,
  Mail,
  Phone,
  Target,
  TrendingUp,
  Star,
  CheckCircle,
  Users,
  Lightbulb,
  RefreshCw,
} from "lucide-react";
import BackHeader from "@/components/common/BackHeader";

function App() {
  const [activeTab, setActiveTab] = useState("profile");

  const user = {
    name: "Sarah Johnson",
    title: "Senior Product Designer",
    tagline: "Crafting meaningful digital experiences that connect people and solve real problems",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2",
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

  const stats = [
    {
      label: "Applications",
      value: "8",
      icon: Briefcase,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Saved Jobs",
      value: "12",
      icon: Heart,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

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
    {
      id: "edit-profile",
      icon: Edit3,
      title: "Edit Profile",
      description: "Update your personal information",
      color: "from-slate-500 to-slate-600",
      bgColor: "bg-slate-50",
      iconColor: "text-slate-600",
    },
  ];

  const myActivity = [
    {
      id: "applied",
      icon: Briefcase,
      title: "Applied Jobs",
      description: "Track and manage your applications",
      badge: "8 Active",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      id: "saved",
      icon: Heart,
      title: "Saved Jobs",
      description: "Your bookmarked positions",
      badge: "12 Saved",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <BackHeader title="My Page" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* 1. Profile Summary Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg shadow-slate-200/50 border border-white/50 overflow-hidden">
          <div className="p-5 sm:p-8">
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4 sm:gap-6">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl">
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
                    <MapPin size={14} className="sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                    <span>{user.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                    <span>Joined {user.joinDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Work Style Personality */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg shadow-slate-200/50 border border-white/50 overflow-hidden">
          <div className="p-5 sm:p-8">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-100 to-pink-100 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl">
                {workStyle.emoji}
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">Your Work Style</h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Completed {workStyle.completedDate}
                </p>
              </div>
            </div>

            <div className="mb-5 sm:mb-6">
              <h4 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">
                {workStyle.type}
              </h4>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {workStyle.description}
              </p>
            </div>

            {/* Traits */}
            <div className="mb-6 sm:mb-8">
              <h5 className="text-sm font-semibold text-slate-700 mb-3">Key Traits</h5>
              <div className="flex flex-wrap gap-2">
                {workStyle.traits.map((trait, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-gradient-to-r from-orange-50 to-pink-50 text-orange-700 text-xs sm:text-sm font-medium rounded-full border border-orange-100/50"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl shadow-purple-500/25 hover:shadow-purple-500/30 touch-manipulation active:scale-[0.98]">
                <div className="flex items-center justify-center gap-2">
                  <Lightbulb size={16} className="sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">See Recommended Jobs</span>
                </div>
              </button>
              <button className="flex-1 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-200 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md touch-manipulation active:scale-[0.98]">
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw size={16} className="sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">Retake Quiz</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* 3. Stats Overview */}
        <div className="space-y-4 sm:space-y-5">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 px-1">Stats Overview</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg shadow-slate-200/50 border border-white/50 p-5 sm:p-6 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 group touch-manipulation"
                >
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                    >
                      <Icon size={18} className={`sm:w-5 sm:h-5 ${stat.textColor}`} />
                    </div>
                    <div
                      className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                    >
                      {stat.value}
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-slate-600 font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Quick Actions (Group 1) */}
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

        {/* 5. My Activity (Group 2) */}
        <div className="space-y-4 sm:space-y-5">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 px-1">My Activity</h3>
          <div className="space-y-3 sm:space-y-4">
            {myActivity.map((item) => {
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
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                          <h4 className="text-base sm:text-lg font-semibold text-slate-900 truncate">
                            {item.title}
                          </h4>
                          {item.badge && (
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.bgColor} ${item.iconColor} self-start sm:self-auto flex-shrink-0`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
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

export default App;
