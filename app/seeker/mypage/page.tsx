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
} from "lucide-react";
import BackHeader from "@/components/common/BackHeader";

function MyPage() {
  const user = {
    name: "Sarah Johnson",
    title: "Product Designer",
    description:
      "Passionate about creating intuitive user experiences. Looking for opportunities to make a meaningful impact through design.",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2",
    joinDate: "March 2024",
    location: "San Francisco, CA",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
  };

  const menuItems = [
    {
      id: "preferences",
      icon: Settings,
      title: "Job Preferences",
      description: "Edit your job preferences",
      count: null,
      color: "bg-blue-50 text-blue-600",
    },
    {
      id: "applied",
      icon: Briefcase,
      title: "Applied Jobs",
      description: "Track your applications",
      count: 8,
      color: "bg-green-50 text-green-600",
    },
    {
      id: "saved",
      icon: Heart,
      title: "Saved Jobs",
      description: "Jobs you want to apply to",
      count: 12,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const stats = [
    { label: "Applications", value: "8", color: "text-blue-600" },
    { label: "Saved", value: "12", color: "text-purple-600" },
    { label: "Interviews", value: "3", color: "text-green-600" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <BackHeader title="My Page" />

      <div className="max-w-6xl mx-auto px-5 py-6 space-y-6">
        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-slate-800 mb-1">{user.name}</h2>
                <p className="text-slate-600 text-sm leading-relaxed max-w-md">
                  {user.description}
                </p>

                <div className="flex flex-col items-center md:items-start  justify-center sm:justify-start gap-1 mt-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{user.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>Joined {user.joinDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="p-6 border-t border-purple-50">
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6 hover:shadow-md hover:border-purple-200 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                    >
                      <Icon size={20} />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-800">{item.title}</h3>
                        {item.count && (
                          <span className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full font-medium">
                            {item.count}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 mt-1">{item.description}</p>
                    </div>
                  </div>
                  <ChevronRight
                    size={20}
                    className="text-slate-400 group-hover:text-purple-600 transition-colors duration-200"
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6">
          <h3 className="font-semibold text-slate-800 mb-4">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Mail size={16} className="text-blue-600" />
              </div>
              <span className="text-slate-600">{user.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                <Phone size={16} className="text-green-600" />
              </div>
              <span className="text-slate-600">{user.phone}</span>
            </div>
          </div>
        </div>

        {/* Edit Profile Button */}
        <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 px-6 rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl">
          Edit Profile
        </button>
      </div>
    </div>
  );
}

export default MyPage;
