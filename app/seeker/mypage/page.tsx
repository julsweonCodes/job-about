"use client";
import React from "react";
import {
  Briefcase,
  Heart,
  Calendar,
  MapPin,
  Edit3,
  ChevronRight,
  Mail,
  Phone,
  Target,
} from "lucide-react";
import BackHeader from "@/components/common/BackHeader";
import { Button } from "@/components/ui/Button";

function MyPage() {
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

  const menuItems = [
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
      id: "applied",
      icon: Briefcase,
      title: "Application History",
      description: "Track and manage your applications",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      id: "saved",
      icon: Heart,
      title: "Saved Opportunities",
      description: "Your bookmarked positions",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header - Mobile Optimized */}
      <BackHeader title="My Page" />

      <div className="max-w-6xl mx-auto px-5 py-6 space-y-6 sm:space-y-8">
        {/* Profile Section - Mobile First */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg shadow-slate-200/50 border border-white/50 overflow-hidden">
          <div className="p-5 sm:p-8">
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4 sm:gap-6">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden ring-3 sm:ring-4 ring-white shadow-xl">
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

        {/* Quick Actions - Mobile Optimized */}
        <div className="space-y-4 sm:space-y-5">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 px-1">Quick Actions</h3>
          <div className="space-y-3 sm:space-y-4">
            {menuItems.map((item) => {
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

        {/* Contact Information - Compact Mobile Design */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg shadow-slate-200/50 border border-white/50 p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6 px-1">
            Contact Information
          </h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-blue-50/50 rounded-lg sm:rounded-xl border border-blue-100/50 hover:from-blue-100/50 hover:to-blue-100/30 transition-all duration-200 touch-manipulation">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail size={16} className="sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-slate-600">Email Address</p>
                <p className="text-sm sm:text-base text-slate-900 font-medium truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-emerald-50/50 rounded-lg sm:rounded-xl border border-emerald-100/50 hover:from-emerald-100/50 hover:to-emerald-100/30 transition-all duration-200 touch-manipulation">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone size={16} className="sm:w-5 sm:h-5 text-emerald-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-slate-600">Phone Number</p>
                <p className="text-sm sm:text-base text-slate-900 font-medium">{user.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Button - Touch Optimized */}
        <Button size="xl" variant="black">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <Edit3 size={18} className="sm:w-5 sm:h-5" />
            <span className="text-base sm:text-lg">Edit Profile</span>
          </div>
        </Button>

        {/* Bottom Spacing for Mobile */}
        <div className="h-4 sm:h-0"></div>
      </div>
    </div>
  );
}

export default MyPage;
