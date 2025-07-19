"use client";
import React, { useState, useRef } from "react";
import {
  Briefcase,
  Heart,
  MapPin,
  Edit3,
  Lightbulb,
  Camera,
  Phone,
  Clock,
  ImageIcon,
  Plus,
  X,
  Star,
} from "lucide-react";
import BackHeader from "@/components/common/BackHeader";
import MypageActionButtons from "@/components/common/MypageActionButtons";

function EmployerMypage() {
  const [isEditing, setIsEditing] = useState({
    businessInfo: false,
    address: false,
    hours: false,
    contact: false,
  });

  const [businessData, setBusinessData] = useState({
    businessName: "TechFlow Solutions",
    description:
      "We're a forward-thinking technology company focused on creating innovative solutions that make work more efficient and enjoyable. Our team values collaboration, creativity, and work-life balance.",
    phone: "+1 (555) 987-6543",
    address: "123 Innovation Drive, San Francisco, CA 94105",
    startTime: "09:00",
    endTime: "17:00",
  });

  const [detailImages, setDetailImages] = useState<string[]>([]);
  const [originalImages, setOriginalImages] = useState<string[]>([
    "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2",
  ]);
  const [hasChanges, setHasChanges] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const businessLocation = {
    name: "TechFlow Solutions",
    description:
      "We're a forward-thinking technology company focused on creating innovative solutions that make work more efficient and enjoyable. Our team values collaboration, creativity, and work-life balance.",
    phone: "+1 (555) 987-6543",
    address: "123 Innovation Drive, San Francisco, CA 94105",
    startTime: "09:00",
    endTime: "17:00",
    logoImageUrl: undefined,
    detailImages: detailImages.length > 0 ? [...originalImages, ...detailImages] : originalImages,
  };

  // 변경사항 감지
  React.useEffect(() => {
    const currentImages =
      detailImages.length > 0 ? [...originalImages, ...detailImages] : originalImages;
    const hasImageChanges = JSON.stringify(currentImages) !== JSON.stringify(originalImages);
    setHasChanges(hasImageChanges);
  }, [detailImages, originalImages]);

  const tagOptions = [
    {
      id: "flexible-hours",
      label: "Flexible Hours",
      icon: Clock,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "remote-work",
      label: "Remote Work",
      icon: Briefcase,
      color: "from-green-500 to-green-600",
    },
    {
      id: "team-collaboration",
      label: "Team Collaboration",
      icon: Heart,
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "creative-environment",
      label: "Creative Environment",
      icon: Lightbulb,
      color: "from-orange-500 to-orange-600",
    },
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // 최대 5개까지만 추가
      const currentImages =
        detailImages.length > 0 ? [...originalImages, ...detailImages] : originalImages;
      const remainingSlots = 5 - currentImages.length;
      const filesToProcess = Array.from(files).slice(0, remainingSlots);

      filesToProcess.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setDetailImages((prev) => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleAddPhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (index: number) => {
    const currentImages =
      detailImages.length > 0 ? [...originalImages, ...detailImages] : originalImages;

    // 원본 이미지에서 제거된 것인지 새로 추가된 이미지에서 제거된 것인지 확인
    if (index < originalImages.length) {
      // 원본 이미지에서 제거된 경우
      setOriginalImages(originalImages.filter((_, i) => i !== index));
    } else {
      // 새로 추가된 이미지에서 제거된 경우
      const newImageIndex = index - originalImages.length;
      setDetailImages(detailImages.filter((_, i) => i !== newImageIndex));
    }
  };

  const handleSaveImages = async () => {
    try {
      // 여기서 서버에 이미지 변경사항을 전송
      const currentImages = [...originalImages, ...detailImages];
      console.log("Saving images to server:", currentImages);

      // 서버 요청 예시
      // const response = await fetch('/api/employer/images', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ images: currentImages })
      // });

      // 성공 시 원본 이미지 업데이트
      setOriginalImages(currentImages);
      setDetailImages([]); // 새로 추가된 이미지 배열 초기화
      setHasChanges(false);

      console.log("Images saved successfully");
    } catch (error) {
      console.error("Failed to save images:", error);
    }
  };

  const handleCancelImages = () => {
    // 변경사항을 취소하고 원본 상태로 되돌리기
    setDetailImages([]); // 새로 추가된 이미지 배열 초기화
    setHasChanges(false);
    console.log("Image changes cancelled");
  };

  const handleProfileEdit = () => {
    setShowProfileDialog(true);
  };

  const handleCloseProfileDialog = () => {
    setShowProfileDialog(false);
  };

  const handleEdit = (section: string) => {
    setIsEditing((prev) => ({ ...prev, [section]: true }));
  };

  const handleSave = (section: string) => {
    setIsEditing((prev) => ({ ...prev, [section]: false }));
  };

  const handleCancel = (section: string) => {
    setIsEditing((prev) => ({ ...prev, [section]: false }));
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
          <span>Business Information</span>
          <button
            onClick={handleProfileEdit}
            className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none"
          >
            <Edit3 size={20} className="text-slate-600" />
          </button>
        </h3>

        {/* Business Profile */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg shadow-slate-200/50 border border-white/50">
          <div className="p-5 sm:p-8">
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4 sm:gap-6">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden">
                  <img
                    src={
                      businessLocation.logoImageUrl || "/images/img-default-business-profile.png"
                    }
                    alt={businessLocation.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={handleProfileEdit}
                  className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-white rounded-full shadow-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors duration-200"
                >
                  <Camera size={20} className="sm:w-3.5 sm:h-3.5 text-slate-600" />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                  {businessLocation.name}
                </h2>

                <p className="text-sm sm:text-base text-slate-600 px-2 sm:px-0">
                  {businessLocation.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2️⃣ Address Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-white/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl flex items-center justify-center">
                <MapPin size={18} className="text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Business Address</h3>
                <p className="text-sm text-slate-500">Your business location</p>
              </div>
            </div>
            {!isEditing.address && (
              <button
                onClick={() => handleEdit("address")}
                className="p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-200 touch-manipulation"
              >
                <Edit3 size={16} className="text-slate-600" />
              </button>
            )}
          </div>

          {isEditing.address ? (
            <div className="space-y-4">
              <textarea
                value={businessData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                rows={2}
                className="w-full text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Enter your business address..."
              />
              <div className="flex gap-3">
                <button
                  onClick={() => handleSave("address")}
                  className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl shadow-indigo-500/25 touch-manipulation active:scale-[0.98]"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => handleCancel("address")}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-semibold rounded-xl transition-all duration-200 touch-manipulation active:scale-[0.98]"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-slate-700 leading-relaxed">{businessData.address}</p>
          )}
        </div>

        {/* 3️⃣ Operating Hours Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-white/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                <Clock size={18} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Operating Hours</h3>
                <p className="text-sm text-slate-500">When your business is open</p>
              </div>
            </div>
            {!isEditing.hours && (
              <button
                onClick={() => handleEdit("hours")}
                className="p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-200 touch-manipulation"
              >
                <Edit3 size={16} className="text-slate-600" />
              </button>
            )}
          </div>

          {isEditing.hours ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={businessData.startTime}
                    onChange={(e) => handleInputChange("startTime", e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-2">End Time</label>
                  <input
                    type="time"
                    value={businessData.endTime}
                    onChange={(e) => handleInputChange("endTime", e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleSave("hours")}
                  className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl shadow-indigo-500/25 touch-manipulation active:scale-[0.98]"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => handleCancel("hours")}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-semibold rounded-xl transition-all duration-200 touch-manipulation active:scale-[0.98]"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-slate-700">
              <span className="font-medium">Monday - Friday:</span> {businessData.startTime} -{" "}
              {businessData.endTime}
            </p>
          )}
        </div>

        {/* 4️⃣ Contact Info Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-white/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                <Phone size={18} className="text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Contact Information</h3>
                <p className="text-sm text-slate-500">How customers can reach you</p>
              </div>
            </div>
            {!isEditing.contact && (
              <button
                onClick={() => handleEdit("contact")}
                className="p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-200 touch-manipulation"
              >
                <Edit3 size={16} className="text-slate-600" />
              </button>
            )}
          </div>

          {isEditing.contact ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={businessData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleSave("contact")}
                  className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl shadow-indigo-500/25 touch-manipulation active:scale-[0.98]"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => handleCancel("contact")}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-semibold rounded-xl transition-all duration-200 touch-manipulation active:scale-[0.98]"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-slate-400" />
              <span className="text-slate-700 font-medium">{businessData.phone}</span>
            </div>
          )}
        </div>

        {/* Workplace Photos */}
        <div className="space-y-4 sm:space-y-5">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 px-1">Workplace Photos</h3>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg shadow-slate-200/50 border border-white/50 p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                <ImageIcon size={18} className="sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Showcase Your Space
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Add up to 5 photos to showcase your workplace
                </p>
              </div>
            </div>

            <div>
              <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-4 scrollbar-hide px-2">
                {businessLocation.detailImages.map((image, index) => (
                  <div key={index} className="relative flex-shrink-0 group p-2">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden ring-2 ring-slate-200 bg-slate-100 shadow-sm">
                      <img
                        src={image}
                        alt={`Workplace ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-0 right-0 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100 touch-manipulation z-10"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {businessLocation.detailImages.length < 5 && (
                  <div className="flex-shrink-0 p-2">
                    <button
                      onClick={handleAddPhotoClick}
                      className="w-24 h-24 sm:w-28 sm:h-28 border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50 rounded-xl flex flex-col items-center justify-center transition-all duration-200 touch-manipulation group"
                    >
                      <Plus size={18} className="text-slate-400 group-hover:text-indigo-500 mb-1" />
                      <span className="text-xs text-slate-400 group-hover:text-indigo-500 font-medium">
                        Add Photo
                      </span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between mt-3 mb-6 sm:">
                <span className="text-xs text-slate-500">
                  {businessLocation.detailImages.length} of 5 photos
                </span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                        i < businessLocation.detailImages.length ? "bg-indigo-400" : "bg-slate-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Save Button */}
              {hasChanges && (
                <MypageActionButtons
                  onCancel={handleCancelImages}
                  onSave={handleSaveImages}
                  cancelText="Cancel"
                  saveText="Save Changes"
                />
              )}
            </div>
          </div>
        </div>

        {/* Job Conditions & Preferences */}
        <div className="space-y-4 sm:space-y-5">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 px-1">
            Job Conditions & Preferences
          </h3>

          {/* Optional Tags */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg shadow-slate-200/50 border border-white/50 p-5 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                <Star size={18} className="sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Workplace Attributes
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Select tags that describe your workplace
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {tagOptions.map((trait, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-gradient-to-r from-orange-50 to-pink-50 text-orange-700 text-xs sm:text-sm font-medium rounded-full border border-orange-100/50"
                >
                  {trait.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Edit Dialog */}
      {showProfileDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Edit Profile</h3>
              <button
                onClick={handleCloseProfileDialog}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden ring-4 ring-slate-100 mb-4">
                  <img
                    src={
                      businessLocation.logoImageUrl || "/images/img-default-business-profile.png"
                    }
                    alt={businessLocation.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200">
                  Change Photo
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    defaultValue={businessLocation.name}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    defaultValue={businessLocation.description}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCloseProfileDialog}
                  className="flex-1 py-2 px-4 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployerMypage;
