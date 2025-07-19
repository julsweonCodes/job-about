"use client";
import React, { useState } from "react";
import {
  Camera,
  Edit3,
  Save,
  Phone,
  MapPin,
  Clock,
  Plus,
  X,
  Check,
  Star,
  Zap,
  Heart,
  Image as ImageIcon,
} from "lucide-react";
import BackHeader from "@/components/common/BackHeader";

function EmployerMypage() {
  const businessLocation = {
    name: "TechFlow Solutions",
    address: "123 Innovation Drive, San Francisco, CA 94105",
    phone: "+1 (555) 987-6543",
    startTime: "09:00",
    endTime: "17:00",
    description:
      "We're a forward-thinking technology company focused on creating innovative solutions that make work more efficient and enjoyable. Our team values collaboration, creativity, and work-life balance.",
    logoImageUrl: undefined,
    detailImages: [
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2",
      "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2",
      "https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2",
    ],
  };

  const [isEditing, setIsEditing] = useState({
    businessInfo: false,
    description: false,
    hours: false,
  });

  const [businessData, setBusinessData] = useState({
    businessName: "TechFlow Solutions",
    phone: "+1 (555) 987-6543",
    address: "123 Innovation Drive, San Francisco, CA 94105",
    startTime: "09:00",
    endTime: "17:00",
    description:
      "We're a forward-thinking technology company focused on creating innovative solutions that make work more efficient and enjoyable. Our team values collaboration, creativity, and work-life balance.",
  });

  const [selectedTags, setSelectedTags] = useState(["family-friendly", "quick-hiring"]);

  const employer = {
    businessName: businessData.businessName,
    logoImageUrl: undefined,
    detailImages: [
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2",
      "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2",
      "https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2",
    ],
  };

  const tagOptions = [
    {
      id: "family-friendly",
      label: "Family-friendly",
      icon: Heart,
      color: "from-pink-500 to-rose-500",
    },
    {
      id: "no-experience",
      label: "No experience required",
      icon: Star,
      color: "from-amber-500 to-orange-500",
    },
    {
      id: "quick-hiring",
      label: "Quick hiring",
      icon: Zap,
      color: "from-emerald-500 to-green-500",
    },
  ];

  const handleEdit = (section: string) => {
    setIsEditing((prev) => ({ ...prev, [section]: true }));
  };

  const handleSave = (section: string) => {
    setIsEditing((prev) => ({ ...prev, [section]: false }));
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleInputChange = (field: string, value: string) => {
    setBusinessData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <BackHeader title="My Business Profile" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4 sm:space-y-5">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 px-1 flex items-center justify-between">
          <span>Business Profile</span>
          <Edit3 size={20} className="text-slate-600" />
        </h3>

        {/* Business Profile */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg shadow-slate-200/50 border border-white/50 overflow-hidden">
          <div className="p-5 sm:p-8">
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4 sm:gap-6">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden">
                  <img
                    src={employer.logoImageUrl || "/images/img-default-business-profile.png"}
                    alt={businessLocation.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-white rounded-full shadow-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors duration-200">
                  <Camera size={12} className="sm:w-3.5 sm:h-3.5 text-slate-600" />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                  {businessLocation.name}
                </h2>

                <p className="text-sm sm:text-base text-slate-600  mb-4 px-2 sm:px-0">
                  {businessLocation.description}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-500">
                  <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                      <span>{businessLocation.phone}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                      <span>{businessLocation.address}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                      <span>
                        {businessLocation.startTime} - {businessLocation.endTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployerMypage;
