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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { formatYYYYMMDDtoMonthDayYear } from "@/lib/utils";
import { BizLocInfo } from "@/types/client/jobPost";
import { apiGetData, apiPostData } from "@/utils/client/API";
import { API_URLS } from "@/constants/api";
import LoadingScreen from "@/components/common/LoadingScreen";
import { STORAGE_URLS } from "@/constants/storage";
import { Location } from "@/constants/location";
import { getLocationDisplayName } from "@/constants/location";

const emptyBizLocInfo: BizLocInfo = {
  bizLocId: "",
  name: "",
  bizDescription: "",
  logoImg: "",
  extraPhotos: [],
  location: Location.BURLINGTON,
  address: "",
  workingHours: "",
  startTime: "",
  endTime: "",
  created_at: "",
  phone: "",
};

// 스켈레톤 컴포넌트들
const InfoSectionSkeleton = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg shadow-slate-200/50 border border-white/50 overflow-hidden">
    <div className="p-5 sm:p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 rounded animate-pulse w-32 sm:w-40" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-48 sm:w-56" />
        </div>
        <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
      </div>
    </div>
  </div>
);

const ProfileSkeleton = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg shadow-slate-200/50 border border-white/50">
    <div className="p-5 sm:p-8">
      <div className="flex flex-col items-center text-center sm:flex-row sm:text-left gap-4 sm:gap-6">
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-32 sm:w-48" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full max-w-xs" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 max-w-sm" />
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const WorkplacePhotosSkeleton = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg shadow-slate-200/50 border border-white/50 p-5 sm:p-6">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="flex-1">
        <div className="h-5 bg-gray-200 rounded animate-pulse w-32 mb-1" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-48" />
      </div>
    </div>
    <div className="flex gap-2 overflow-x-auto pb-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex-shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-gray-200 animate-pulse" />
        </div>
      ))}
      <div className="flex-shrink-0">
        <div className="w-24 h-24 sm:w-28 sm:h-28 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 animate-pulse" />
      </div>
    </div>
  </div>
);

function EmployerMypage() {
  const [isEditing, setIsEditing] = useState({
    businessInfo: false,
    address: false,
    hours: false,
    contact: false,
    location: false,
    workplaceAttributes: false,
  });
  const img_base_url = STORAGE_URLS.BIZ_LOC.PHOTO;
  const [bizLocData, setBizLocData] = useState<BizLocInfo>(emptyBizLocInfo);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

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

  // 원본 workplace photos (서버에서 가져온 이미지들)
  const [originalImages, setOriginalImages] = useState<string[]>([]);
  // 새로 추가된 workplace photos
  const [extraPhotos, setExtraPhotos] = useState<string[]>([]);
  // 삭제된 이미지 인덱스 추적
  const [deletedImageIndexes, setDeletedImageIndexes] = useState<Set<number>>(new Set());

  // 변경사항 감지
  const [isWorkplacePhotoChanged, setIsWorkplacePhotoChanged] = useState(false);

  // 이미지 업로드 다이얼로그
  const [showImageUploadDialog, setShowImageUploadDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // 임시 데이터
  const [tempData, setTempData] = useState<BizLocInfo>({} as BizLocInfo);

  // bizLocData가 변경될 때 originalImages 업데이트 (초기 로드 시에만)
  useEffect(() => {
    if (bizLocData?.extraPhotos && originalImages.length === 0) {
      setOriginalImages(bizLocData.extraPhotos.filter((img) => img !== ""));
    }
  }, [bizLocData, originalImages.length]);

  // 변경사항 감지
  React.useEffect(() => {
    // 삭제된 이미지를 제외한 현재 이미지들
    const currentImages = originalImages
      .filter((_, index) => !deletedImageIndexes.has(index))
      .concat(extraPhotos);

    // 변경사항이 있는지 확인 (추가, 삭제, 순서 변경 등)
    const hasImageChanges = extraPhotos.length > 0 || deletedImageIndexes.size > 0;
    setIsWorkplacePhotoChanged(hasImageChanges);

    console.log("Image state update:", {
      originalImages: originalImages.length,
      extraPhotos: extraPhotos.length,
      deletedImageIndexes: deletedImageIndexes.size,
      hasImageChanges,
    });

    // bizLocData의 extraPhotos 업데이트 (무한 루프 방지)
    if (JSON.stringify(bizLocData.extraPhotos) !== JSON.stringify(currentImages)) {
      setBizLocData((prev) => ({
        ...prev,
        extraPhotos: currentImages,
      }));
    }
  }, [extraPhotos, originalImages, deletedImageIndexes]);

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
      const currentImageCount =
        originalImages.filter((_, index) => !deletedImageIndexes.has(index)).length +
        extraPhotos.length;
      const remainingSlots = 5 - currentImageCount;
      const filesToProcess = Array.from(files).slice(0, remainingSlots);

      console.log("Uploading images:", {
        currentImageCount,
        remainingSlots,
        filesToProcess: filesToProcess.length,
      });

      filesToProcess.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            const imageUrl = e.target!.result as string;
            console.log("New image added:", imageUrl.substring(0, 50) + "...");
            setExtraPhotos((prev) => {
              const newPhotos = [...prev, imageUrl];
              console.log("Updated extraPhotos:", newPhotos.length);
              return newPhotos;
            });
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
      // 원본 이미지에서 제거된 경우 - 삭제된 인덱스로 추적
      setDeletedImageIndexes((prev) => new Set(Array.from(prev).concat(index)));
    } else {
      // 새로 추가된 이미지에서 제거된 경우
      const newImageIndex = index - originalImages.length;
      setExtraPhotos(extraPhotos.filter((_, i) => i !== newImageIndex));
    }
  };

  const handleSaveImages = async () => {
    try {
      setIsUpdating(true);
      // 여기서 서버에 이미지 변경사항을 전송
      const currentImages = originalImages
        .filter((_, index) => !deletedImageIndexes.has(index))
        .concat(extraPhotos);
      console.log("Saving images to server:", currentImages);

      // TODO: API 호출로 이미지 저장
      // const response = await apiPostData(API_URLS.EMPLOYER.PROFILE, {
      //   extraPhotos: currentImages
      // });

      // 성공 시 원본 이미지 업데이트
      setOriginalImages(currentImages);
      setExtraPhotos([]); // 새로 추가된 이미지 배열 초기화
      setDeletedImageIndexes(new Set()); // 삭제된 이미지 인덱스 초기화
      setIsWorkplacePhotoChanged(false);

      console.log("Images saved successfully");
    } catch (error) {
      console.error("Failed to save images:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelImages = () => {
    // 변경사항을 취소하고 원본 상태로 되돌리기
    setExtraPhotos([]); // 새로 추가된 이미지 배열 초기화
    setDeletedImageIndexes(new Set()); // 삭제된 이미지 인덱스 초기화
    setIsWorkplacePhotoChanged(false);
    console.log("Image changes cancelled");
  };

  const handleLogoSave = async (file: File) => {
    try {
      setIsUpdating(true);
      // 파일을 읽어서 이미지 URL로 변환
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        // 로고 이미지 상태 업데이트 (실제로는 서버에 저장)
        setBizLocData((prev) => ({
          ...prev,
          logoImg: imageUrl,
        }));
        console.log("Saving logo image:", imageUrl);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error updating logo:", error);
    } finally {
      setIsUpdating(false);
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
  const handleOptionsSave = async (section: string) => {
    try {
      setIsUpdating(true);
      // TODO: API 호출로 데이터 저장
      // const response = await apiPostData(API_URLS.EMPLOYER.PROFILE, {
      //   [section]: tempData[section as keyof BizLocInfo]
      // });

      // 저장 시 tempData를 bizLocData에 적용
      setBizLocData(tempData);
      setIsEditing((prev) => ({ ...prev, [section]: false }));
    } catch (error) {
      console.error("Failed to save changes:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // update title, description
  const handleProfileSave = async () => {
    try {
      setIsUpdating(true);
      // TODO: API 호출로 데이터 저장
      // const response = await apiPostData(API_URLS.EMPLOYER.PROFILE, {
      //   name: tempData.name,
      //   bizDescription: tempData.bizDescription
      // });

      // 저장 시 tempData를 bizLocData에 적용
      setBizLocData(tempData);
      console.log("Saving basic information:", tempData);
      handleCloseProfileDialog();
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // update field
  const handleTempInputChange = (field: string, value: string) => {
    setTempData((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <BackHeader title="My Business Profile" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-5">
          <div className="px-1">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mb-4" />
            <ProfileSkeleton />
          </div>

          <div className="px-1">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-40 mb-4" />
            {Array.from({ length: 4 }).map((_, index) => (
              <InfoSectionSkeleton key={index} />
            ))}
          </div>

          <div className="px-1">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-36 mb-4" />
            <WorkplacePhotosSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <BackHeader title="My Business Profile" />
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-6 sm:py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <BackHeader title="My Business Profile" />
      {isUpdating && <LoadingScreen overlay={true} opacity="light" />}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-5">
        <div className="px-1">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center justify-between">
            <span>Basic Information</span>
            <button
              onClick={handleProfileEdit}
              className="p-2 sm:p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-200 touch-manipulation"
            >
              <Edit3 size={16} className="text-slate-600" />
            </button>
          </h3>
        </div>

        {/* Business Profile */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg shadow-slate-200/50 border border-white/50">
          <div className="p-5 sm:p-8">
            <div className="flex flex-col items-center text-center sm:flex-row sm:text-left gap-4 sm:gap-6">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden">
                  <img
                    src={
                      bizLocData?.logoImg?.startsWith("data:")
                        ? bizLocData.logoImg
                        : `${STORAGE_URLS.BIZ_LOC.PHOTO}${bizLocData?.logoImg}`
                    }
                    alt={bizLocData?.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // 이미지 로드 실패 시 기본 이미지로 대체
                      const target = e.target as HTMLImageElement;
                      target.src = `${STORAGE_URLS.BIZ_LOC.PHOTO}bizLoc_default.png`;
                    }}
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

        <div className="px-1">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">Business Information</h3>
        </div>

        <InfoSection
          iconClassName="bg-gradient-to-br from-indigo-100 to-blue-100"
          icon={<MapPin size={18} className="text-indigo-600" />}
          title="Business Location"
          subtitle="Your business location"
          onEdit={() => handleEdit("location")}
          isEditing={isEditing.location}
          onSave={() => handleOptionsSave("location")}
          onCancel={() => handleCancel("location")}
        >
          {isEditing.location ? (
            <div>
              <Select
                value={tempData.location}
                onValueChange={(value) =>
                  setTempData((prev) => ({ ...prev, location: value as Location }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your location" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Location).map((location) => (
                    <SelectItem key={location} value={location}>
                      {getLocationDisplayName(location)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <span className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
              {getLocationDisplayName(bizLocData?.location) || "Not specified"}
            </span>
          )}
        </InfoSection>

        {/* 2️⃣ Address Section */}
        <InfoSection
          iconClassName="bg-gradient-to-br from-green-100 to-emerald-100"
          icon={<MapPin size={18} className="text-emerald-600" />}
          title="Business Address"
          subtitle="Your business address"
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
          <div className="px-1">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">Workplace Photos</h3>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg shadow-slate-200/50 border border-white/50 p-4 sm:p-6">
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
              <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide px-1 sm:px-2">
                {/* 원본 이미지들 (삭제되지 않은 것들만) */}
                {originalImages
                  .filter((_, index) => !deletedImageIndexes.has(index))
                  .map((image, index) => (
                    <div
                      key={`original-${index}`}
                      className="relative flex-shrink-0 group p-1 sm:p-2"
                    >
                      <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl overflow-hidden ring-2 ring-slate-200 bg-slate-100 shadow-sm">
                        <img
                          src={
                            image.startsWith("data:")
                              ? image
                              : `${STORAGE_URLS.BIZ_LOC.PHOTO}${image}`
                          }
                          alt={`Workplace ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                          onError={(e) => {
                            // 이미지 로드 실패 시 기본 이미지로 대체
                            const target = e.target as HTMLImageElement;
                            target.src = `${STORAGE_URLS.BIZ_LOC.PHOTO}bizLoc_default.png`;
                          }}
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

                {/* 새로 추가된 이미지들 */}
                {extraPhotos.map((image, index) => (
                  <div key={`new-${index}`} className="relative flex-shrink-0 group p-1 sm:p-2">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl overflow-hidden ring-2 ring-slate-200 bg-slate-100 shadow-sm">
                      <img
                        src={image}
                        alt={`New Workplace ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                        onError={(e) => {
                          // 이미지 로드 실패 시 기본 이미지로 대체
                          const target = e.target as HTMLImageElement;
                          target.src = `${STORAGE_URLS.BIZ_LOC.PHOTO}bizLoc_default.png`;
                        }}
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveImage(originalImages.length + index)}
                      className="absolute top-0 right-0 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100 touch-manipulation z-10"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {originalImages.filter((_, index) => !deletedImageIndexes.has(index)).length +
                  extraPhotos.length <
                  5 && (
                  <div className="flex-shrink-0 p-1 sm:p-2">
                    <button
                      onClick={handleAddPhotoClick}
                      className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50 rounded-xl flex flex-col items-center justify-center transition-all duration-200 touch-manipulation group"
                    >
                      <Plus
                        size={16}
                        className="sm:w-[18px] sm:h-[18px] text-slate-400 group-hover:text-indigo-500 mb-1"
                      />
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
              <div className="flex items-center justify-between mt-3 mb-4 sm:mb-6">
                <span className="text-xs text-slate-500">
                  {originalImages.filter((_, index) => !deletedImageIndexes.has(index)).length +
                    extraPhotos.length}{" "}
                  of 5 photos
                </span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors duration-200 ${
                        i <
                        originalImages.filter((_, index) => !deletedImageIndexes.has(index))
                          .length +
                          extraPhotos.length
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

      {/* Bottom Spacing for Mobile */}
      <div className="h-4 sm:h-0"></div>

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
              placeholder="Enter your business name..."
            />

            <TextArea
              label="Description"
              value={tempData.bizDescription}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleTempInputChange("bizDescription", e.target.value)
              }
              placeholder="Enter your business description..."
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
