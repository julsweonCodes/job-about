"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Briefcase,
  Calendar,
  Camera,
  Clock,
  Edit3,
  Heart,
  ImageIcon,
  Lightbulb,
  MapPin,
  Phone,
  Plus,
  X,
} from "lucide-react";
import BackHeader from "@/components/common/BackHeader";
import MypageActionButtons from "@/components/common/MypageActionButtons";
import BaseDialog from "@/components/common/BaseDialog";
import ImageUploadDialog from "@/components/common/ImageUploadDialog";
import InfoSection from "@/components/common/InfoSection";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import TimeRangePicker from "@/components/ui/TimeRangePicker";
import { formatYYYYMMDDtoMonthDayYear } from "@/lib/utils";
import { BizLocInfo } from "@/types/client/jobPost";
import { apiGetData } from "@/utils/client/API";
import { API_URLS } from "@/constants/api";
import LoadingScreen from "@/components/common/LoadingScreen";
import { STORAGE_URLS } from "@/constants/storage";
import { Location } from "@/constants/location";
const emptyBizLocInfo: BizLocInfo = {
  bizLocId: "",
  name: "",
  bizDescription: "",
  logoImg: "",
  extraPhotos: [],
  location: Location.BURLINGTON, // adjust to your Location type
  address: "",
  workingHours: "",
  startTime: "",
  endTime: "",
  created_at: "",
  phone: "", // if your BizLocInfo actually uses phone_number
};

function EmployerMypage() {
  const [isEditing, setIsEditing] = useState({
    businessInfo: false,
    address: false,
    hours: false,
    contact: false,
    workplaceAttributes: false,
  });
  const img_base_url = STORAGE_URLS.BIZ_LOC.PHOTO;
  const [bizLocData, setBizLocData] = useState<BizLocInfo>(emptyBizLocInfo);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // GET initial bizLocData
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await apiGetData<BizLocInfo>(API_URLS.EMPLOYER.PROFILE);
        setBizLocData(profileData ?? emptyBizLocInfo);
      } catch (e) {
        console.error("Failed to load business profile", e);
        setError("Failed to load business profile");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    console.log(bizLocData);
  }, [bizLocData]);
  // 원본 workplace photos
  const [originalImages, setOriginalImages] = useState<string[]>([
    "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2",
  ]);
  // 새로 추가된 workplace photos
  const [extraPhotos, setExtraPhotos] = useState<string[]>([]);

  // 변경사항 감지
  const [isWorkplacePhotoChanged, setIsWorkplacePhotoChanged] = useState(false);

  // 이미지 업로드 다이얼로그
  const [showImageUploadDialog, setShowImageUploadDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // 임시 데이터
  const [tempData, setTempData] = useState<BizLocInfo>({} as BizLocInfo);

  // 변경사항 감지
  React.useEffect(() => {
    const currentImages =
      extraPhotos.length > 0 ? [...originalImages, ...extraPhotos] : originalImages;
    const hasImageChanges = JSON.stringify(currentImages) !== JSON.stringify(originalImages);
    setIsWorkplacePhotoChanged(hasImageChanges);

    // bizLocData의 detailImages 업데이트
    setBizLocData((prev) => ({
      ...prev,
      extraPhotos: currentImages,
    }));
  }, [extraPhotos, originalImages]);

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
        extraPhotos.length > 0 ? [...originalImages, ...extraPhotos] : originalImages;
      const remainingSlots = 5 - currentImages.length;
      const filesToProcess = Array.from(files).slice(0, remainingSlots);

      filesToProcess.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setExtraPhotos((prev) => [...prev, e.target!.result as string]);
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
    // 원본 이미지에서 제거된 것인지 새로 추가된 이미지에서 제거된 것인지 확인
    if (index < originalImages.length) {
      // 원본 이미지에서 제거된 경우
      setOriginalImages(originalImages.filter((_, i) => i !== index));
    } else {
      // 새로 추가된 이미지에서 제거된 경우
      const newImageIndex = index - originalImages.length;
      setExtraPhotos(extraPhotos.filter((_, i) => i !== newImageIndex));
    }
  };

  const handleSaveImages = async () => {
    try {
      // 여기서 서버에 이미지 변경사항을 전송
      const currentImages = [...originalImages, ...extraPhotos];
      console.log("Saving images to server:", currentImages);

      // 성공 시 원본 이미지 업데이트
      setOriginalImages(currentImages);
      setExtraPhotos([]); // 새로 추가된 이미지 배열 초기화
      setIsWorkplacePhotoChanged(false);

      console.log("Images saved successfully");
    } catch (error) {
      console.error("Failed to save images:", error);
    }
  };

  const handleCancelImages = () => {
    // 변경사항을 취소하고 원본 상태로 되돌리기
    setExtraPhotos([]); // 새로 추가된 이미지 배열 초기화
    setIsWorkplacePhotoChanged(false);
    console.log("Image changes cancelled");
  };

  const handleLogoSave = async (file: File) => {
    try {
      // 파일을 읽어서 이미지 URL로 변환
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        // 로고 이미지 상태 업데이트 (실제로는 서버에 저장)
        console.log("Saving logo image:", imageUrl);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error updating logo:", error);
    }
  };

  const handleImageUploadDialog = () => {
    setShowImageUploadDialog(true);
  };

  const handleProfileEdit = () => {
    // 다이얼로그를 열 때 현재 데이터로 임시 상태 초기화
    setTempData(bizLocData);
    setShowProfileDialog(true);
  };

  // 수정 모드 진입 시 현재 데이터로 임시 상태 초기화
  const handleEdit = (section: string) => {
    setTempData(bizLocData);
    setIsEditing((prev) => ({ ...prev, [section]: true }));
  };

  // 취소 시 임시 데이터를 원래 상태로 되돌리기
  const handleCancel = (section: string) => {
    setTempData(bizLocData);
    setIsEditing((prev) => ({ ...prev, [section]: false }));
  };

  const handleCloseProfileDialog = () => {
    setShowProfileDialog(false);
  };

  // update address, hours, contact
  const handleOptionsSave = (section: string) => {
    // 저장 시 tempData를 bizLocData에 적용
    setBizLocData(tempData);
    setIsEditing((prev) => ({ ...prev, [section]: false }));
  };

  // update title, description
  const handleProfileSave = () => {
    // 저장 시 tempData를 bizLocData에 적용
    setBizLocData(tempData);
    console.log("Saving basic information:", tempData);
    handleCloseProfileDialog();
  };

  // update field
  const handleTempInputChange = (field: string, value: string) => {
    setTempData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <BackHeader title="My Business Profile" />
      {isLoading && <LoadingScreen overlay={true} opacity="light" />}
      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-6 sm:py-8 space-y-4 sm:space-y-5">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 px-1 flex items-center justify-between">
          <span>Basic Information</span>
          <button
            onClick={handleProfileEdit}
            className="p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-200 touch-manipulation"
          >
            <Edit3 size={16} className="text-slate-600" />
          </button>
        </h3>

        {/* Business Profile */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg shadow-slate-200/50 border border-white/50">
          <div className="p-5 sm:p-8">
            <div className="flex flex-col items-center text-center sm:flex-row sm:text-left gap-4 sm:gap-6">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden">
                  <img
                    src={`${STORAGE_URLS.BIZ_LOC.PHOTO}${bizLocData?.logoImg}`}
                    alt={bizLocData?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={handleImageUploadDialog}
                  className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors duration-200"
                >
                  <Camera className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
                </button>
              </div>

              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                  {bizLocData?.name}
                </h2>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4 px-2 sm:px-0">
                  {bizLocData?.bizDescription}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                    <span>
                      Joined{" "}
                      {bizLocData?.created_at
                        ? formatYYYYMMDDtoMonthDayYear(bizLocData.created_at)
                        : "Unknown"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-slate-900 px-1 flex items-center justify-between">
          <span>Business Information</span>
        </h3>

        {/* 2️⃣ Address Section */}
        <InfoSection
          iconClassName="bg-gradient-to-br from-green-100 to-emerald-100"
          icon={<MapPin size={18} className="text-emerald-600" />}
          title="Business Address"
          subtitle="Your business location"
          onEdit={() => handleEdit("address")}
          isEditing={isEditing.address}
          onSave={() => handleOptionsSave("address")}
          onCancel={() => handleCancel("address")}
        >
          {isEditing.address ? (
            <Input
              label="Business Address"
              value={tempData.address}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTempData((prev) => ({ ...prev, address: e.target.value }))
              }
              placeholder="Enter your business address..."
              rightIcon={<MapPin className="w-5 h-5" />}
            />
          ) : (
            <p className="text-slate-700 leading-relaxed">{bizLocData?.address}</p>
          )}
        </InfoSection>

        {/* 3️⃣ Operating Hours Section */}
        <InfoSection
          iconClassName="bg-gradient-to-br from-blue-100 to-sky-100"
          icon={<Clock size={18} className="text-blue-600" />}
          title="Operating Hours"
          subtitle="When your business is open"
          onEdit={() => handleEdit("hours")}
          isEditing={isEditing.hours}
          onSave={() => handleOptionsSave("hours")}
          onCancel={() => handleCancel("hours")}
        >
          {isEditing.hours ? (
            <TimeRangePicker
              startTime={tempData.startTime!}
              endTime={tempData.endTime!}
              onStartTimeChange={(time) => setTempData((prev) => ({ ...prev, startTime: time }))}
              onEndTimeChange={(time) => setTempData((prev) => ({ ...prev, endTime: time }))}
              label="Operating Hours"
            />
          ) : (
            <p className="text-slate-700">
              {bizLocData?.startTime} - {bizLocData?.endTime}
            </p>
          )}
        </InfoSection>

        {/* 4️⃣ Contact Info Section */}
        <InfoSection
          iconClassName="bg-gradient-to-br from-purple-100 to-pink-100"
          icon={<Phone size={18} className="text-purple-600" />}
          title="Contact Information"
          subtitle="How customers can reach you"
          onEdit={() => handleEdit("contact")}
          isEditing={isEditing.contact}
          onSave={() => handleOptionsSave("contact")}
          onCancel={() => handleCancel("contact")}
        >
          {isEditing.contact ? (
            <div>
              <Input
                label="Phone Number"
                type="phone"
                value={tempData.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTempData((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="+1 (555) 123-4567"
              />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-slate-400" />
              <span className="text-slate-700 font-medium">{bizLocData?.phone}</span>
            </div>
          )}
        </InfoSection>

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

            {/* workplace photos */}
            <div>
              <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-4 scrollbar-hide px-2">
                {bizLocData?.extraPhotos.map((image, index) => {
                  if (image == "") return null;
                  return (
                  <div key={index} className="relative flex-shrink-0 group p-2">
                <div
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden ring-2 ring-slate-200 bg-slate-100 shadow-sm">
                  <img
                    src={`${STORAGE_URLS.BIZ_LOC.PHOTO}${image}`}
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
              </div>)}
                )}
                {bizLocData.extraPhotos.length < 5 && (
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
                  {bizLocData?.extraPhotos.length} of 5 photos
                </span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                         i < bizLocData.extraPhotos.length
                            ? "bg-indigo-400"
                            : "bg-slate-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Save Button */}
              {isWorkplacePhotoChanged && (
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
      </div>
      {/* Profile Edit Dialog */}
      <BaseDialog
        open={showProfileDialog}
        onClose={handleCloseProfileDialog}
        title="Edit Basic Information"
        size="md"
        type="bottomSheet"
      >
        <div className="space-y-4 mb-4">
          <div className="space-y-3">
            <Input
              label="Business Name"
              value={tempData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleTempInputChange("name", e.target.value)
              }
            />

            <TextArea
              label="Description"
              value={tempData.bizDescription}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleTempInputChange("description", e.target.value)
              }
              rows={3}
            />
          </div>
        </div>

        <Button onClick={handleProfileSave} size="lg" className="w-full">
          Save Changes
        </Button>
      </BaseDialog>
      {/* Logo Image Dialog */}
      <ImageUploadDialog
        open={showImageUploadDialog}
        onClose={() => setShowImageUploadDialog(false)}
        onSave={handleLogoSave}
        title="Change Business Logo"
        type="logo"
        currentImage={`${STORAGE_URLS.BIZ_LOC.PHOTO}${bizLocData?.logoImg}`}
      />
    </div>
  );
}

export default EmployerMypage;
