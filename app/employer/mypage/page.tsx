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
import { apiGetData } from "@/utils/client/API";
import { API_URLS } from "@/constants/api";
import LoadingScreen from "@/components/common/LoadingScreen";
import { STORAGE_URLS } from "@/constants/storage";
import { Location } from "@/constants/location";
import { getLocationDisplayName } from "@/constants/location";
import { showErrorToast, showSuccessToast } from "@/utils/client/toastUtils";
import { apiPostData, apiPatchData } from "@/utils/client/API";

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
  const [bizLocData, setBizLocData] = useState<BizLocInfo>(emptyBizLocInfo);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // GET initial bizLocData
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await apiGetData<BizLocInfo>(API_URLS.EMPLOYER.PROFILE.ROOT);
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

  // 원본 workplace photos (서버에서 가져온 이미지들)
  const [originalImages, setOriginalImages] = useState<string[]>([]);
  // 새로 추가된 workplace photos
  const [extraPhotos, setExtraPhotos] = useState<string[]>([]);
  // 삭제된 이미지 인덱스 추적
  const [deletedImageIndexes, setDeletedImageIndexes] = useState<Set<number>>(new Set());

  // 드래그 앤 드롭을 위한 상태
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isOrderChanged, setIsOrderChanged] = useState(false);

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
    const hasImageChanges =
      extraPhotos.length > 0 || deletedImageIndexes.size > 0 || isOrderChanged;
    setIsWorkplacePhotoChanged(hasImageChanges);

    // bizLocData의 extraPhotos 업데이트 (무한 루프 방지)
    if (JSON.stringify(bizLocData.extraPhotos) !== JSON.stringify(currentImages)) {
      setBizLocData((prev) => ({
        ...prev,
        extraPhotos: currentImages,
      }));
    }
  }, [extraPhotos, originalImages, deletedImageIndexes, isOrderChanged]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // 최대 5개까지만 추가
      const currentImageCount =
        originalImages.filter((_, index) => !deletedImageIndexes.has(index)).length +
        extraPhotos.length;
      const remainingSlots = 5 - currentImageCount;
      const filesToProcess = Array.from(files).slice(0, remainingSlots);

      filesToProcess.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            const imageUrl = e.target!.result as string;
            setExtraPhotos((prev) => {
              const newPhotos = [...prev, imageUrl];
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

  // 드래그 시작 핸들러
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  // 드래그 오버 핸들러
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  // 드래그 리브 핸들러
  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  // 드롭 핸들러
  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    // 현재 표시되는 이미지들의 배열 생성
    const visibleOriginalImages = originalImages
      .map((image, originalIndex) => ({ image, originalIndex, type: "original" as const }))
      .filter(({ originalIndex }) => !deletedImageIndexes.has(originalIndex));

    const visibleExtraImages = extraPhotos.map((image, index) => ({
      image,
      originalIndex: originalImages.length + index,
      type: "extra" as const,
    }));

    const allVisibleImages = [...visibleOriginalImages, ...visibleExtraImages];

    // 드래그된 아이템과 드롭 위치에 따라 순서 변경
    const draggedItem = allVisibleImages[draggedIndex];
    const newOrder = [...allVisibleImages];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(dropIndex, 0, draggedItem);

    // 새로운 순서를 originalImages와 extraPhotos로 분리
    const newOriginalImages: string[] = [];
    const newExtraPhotos: string[] = [];
    const newDeletedIndexes = new Set<number>();

    newOrder.forEach((item) => {
      if (item.type === "original") {
        newOriginalImages.push(item.image);
      } else {
        newExtraPhotos.push(item.image);
      }
    });

    // 삭제된 인덱스 재계산
    originalImages.forEach((_, originalIndex) => {
      if (!newOriginalImages.includes(originalImages[originalIndex])) {
        newDeletedIndexes.add(originalIndex);
      }
    });

    setOriginalImages(newOriginalImages);
    setExtraPhotos(newExtraPhotos);
    setDeletedImageIndexes(newDeletedIndexes);
    setDraggedIndex(null);
    setDragOverIndex(null);
    setIsOrderChanged(true); // 순서가 변경되었음을 표시
  };

  const handleSaveImages = async () => {
    try {
      setIsUpdating(true);

      // 새로 추가된 이미지들을 File 객체로 변환
      const files: File[] = [];
      for (let i = 0; i < extraPhotos.length; i++) {
        const imageUrl = extraPhotos[i];
        if (imageUrl.startsWith("data:")) {
          // data URL을 File 객체로 변환
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const file = new File([blob], `photo_${i}.jpg`, { type: "image/jpeg" });
          files.push(file);
        }
      }

      // 1단계: 새 이미지들 업로드
      let newPhotoUrls: string[] = [];
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => formData.append("photos", file));

        const uploadResponse = await apiPostData(API_URLS.EMPLOYER.PROFILE.PHOTOS_UPLOAD, formData);
        newPhotoUrls = uploadResponse.photoUrls || [];
      }

      // 2단계: 최종 이미지 배열 생성
      const currentImages = originalImages
        .filter((_, index) => !deletedImageIndexes.has(index))
        .concat(newPhotoUrls);

      // 3단계: 최종 이미지 배열로 데이터베이스 업데이트
      await apiPatchData(API_URLS.EMPLOYER.PROFILE.PHOTOS, {
        photoUrls: currentImages,
      });

      // 성공 시 원본 이미지 업데이트
      setOriginalImages(currentImages);
      setExtraPhotos([]); // 새로 추가된 이미지 배열 초기화
      setDeletedImageIndexes(new Set()); // 삭제된 이미지 인덱스 초기화
      setIsWorkplacePhotoChanged(false);
      setIsOrderChanged(false); // 순서 변경 상태 초기화

      showSuccessToast("Images updated successfully");
    } catch (error) {
      console.error("Failed to save images:", error);
      showErrorToast("Failed to save images. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelImages = () => {
    // 변경사항을 취소하고 원본 상태로 되돌리기
    setExtraPhotos([]); // 새로 추가된 이미지 배열 초기화
    setDeletedImageIndexes(new Set()); // 삭제된 이미지 인덱스 초기화
    setIsWorkplacePhotoChanged(false);
    setIsOrderChanged(false); // 순서 변경 상태 초기화
  };

  const handleLogoSave = async (file: File) => {
    try {
      setIsUpdating(true);

      // FormData 생성
      const formData = new FormData();
      formData.append("logo", file);

      // 새로운 PATCH API 사용
      const responseData = await apiPatchData(API_URLS.EMPLOYER.PROFILE.LOGO, formData);

      // 서버 응답에서 실제 업로드된 파일명 사용
      if (responseData.logo_url) {
        setBizLocData((prev) => ({
          ...prev,
          logoImg: responseData.logo_url,
        }));
        showSuccessToast("Logo updated successfully");
      } else {
        showErrorToast("Failed to get uploaded logo URL");
      }
    } catch (error) {
      console.error("Error updating logo:", error);
      showErrorToast("Failed to update logo. Please try again.");
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

      // 섹션별 필드 매핑
      const sectionFields = {
        address: ["address"],
        hours: ["startTime", "endTime"],
        contact: ["phone"],
        location: ["location"],
      };

      // 수정된 섹션 데이터만 전송
      const updateData = Object.fromEntries(
        sectionFields[section as keyof typeof sectionFields]?.map((field) => [
          field,
          tempData[field as keyof BizLocInfo],
        ]) || []
      );

      // 새로운 PATCH API 사용
      const response = await apiPatchData(API_URLS.EMPLOYER.PROFILE.ROOT, updateData);

      // 저장 시 tempData를 bizLocData에 적용
      setBizLocData(tempData);
      setIsEditing((prev) => ({ ...prev, [section]: false }));
      showSuccessToast(`${section} updated successfully`);
    } catch (error) {
      console.error("Failed to save changes:", error);
      showErrorToast(`Failed to save ${section}. Please try again.`);
    } finally {
      setIsUpdating(false);
    }
  };

  // update title, description
  const handleProfileSave = async () => {
    try {
      setIsUpdating(true);

      // 수정된 기본 정보만 전송
      const updateData = {
        name: tempData.name,
        bizDescription: tempData.bizDescription,
      };

      // 새로운 PATCH API 사용
      const response = await apiPatchData(API_URLS.EMPLOYER.PROFILE.ROOT, updateData);

      // 저장 시 tempData를 bizLocData에 적용
      setBizLocData(tempData);
      handleCloseProfileDialog();
      showSuccessToast("Information updated successfully");
    } catch (error) {
      console.error("Failed to save profile:", error);
      showErrorToast("Failed to save profile. Please try again.");
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
            <div className="h-6 bg-gray-200 rounded animate-pulse w-40 mb-4 flex" />
            <div className="space-y-4 sm:space-y-5">
              {Array.from({ length: 4 }).map((_, index) => (
                <InfoSectionSkeleton key={index} />
              ))}
            </div>
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
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-1">
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
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              {bizLocData?.address}
            </p>
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
            <p className="text-slate-700 text-sm sm:text-base">
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
              <span className="text-slate-700 font-medium text-sm sm:text-base">
                {bizLocData?.phone}
              </span>
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
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900">
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
                  .map((image, originalIndex) => ({ image, originalIndex }))
                  .filter(({ originalIndex }) => !deletedImageIndexes.has(originalIndex))
                  .map(({ image, originalIndex }, displayIndex) => (
                    <div
                      key={`original-${originalIndex}`}
                      className={`relative flex-shrink-0 group p-1 sm:p-2 cursor-move ${
                        draggedIndex === displayIndex ? "opacity-50" : ""
                      } ${dragOverIndex === displayIndex ? "ring-2 ring-indigo-400" : ""}`}
                      draggable
                      onDragStart={() => handleDragStart(displayIndex)}
                      onDragOver={(e) => handleDragOver(e, displayIndex)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, displayIndex)}
                    >
                      <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl overflow-hidden ring-2 ring-slate-200 bg-slate-100 shadow-sm">
                        <img
                          src={
                            image.startsWith("data:")
                              ? image
                              : `${STORAGE_URLS.BIZ_LOC.PHOTO}${image}`
                          }
                          alt={`Workplace ${displayIndex + 1}`}
                          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                          onError={(e) => {
                            // 이미지 로드 실패 시 기본 이미지로 대체
                            const target = e.target as HTMLImageElement;
                            target.src = `${STORAGE_URLS.BIZ_LOC.PHOTO}bizLoc_default.png`;
                          }}
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveImage(originalIndex)}
                        className="absolute top-0 right-0 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 touch-manipulation z-10"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}

                {/* 새로 추가된 이미지들 */}
                {extraPhotos.map((image, index) => {
                  const displayIndex =
                    originalImages.filter((_, idx) => !deletedImageIndexes.has(idx)).length + index;
                  return (
                    <div
                      key={`new-${index}`}
                      className={`relative flex-shrink-0 group p-1 sm:p-2 cursor-move ${
                        draggedIndex === displayIndex ? "opacity-50" : ""
                      } ${dragOverIndex === displayIndex ? "ring-2 ring-indigo-400" : ""}`}
                      draggable
                      onDragStart={() => handleDragStart(displayIndex)}
                      onDragOver={(e) => handleDragOver(e, displayIndex)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, displayIndex)}
                    >
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
                        className="absolute top-0 right-0 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 touch-manipulation z-10"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  );
                })}
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
                      <span className="text-xs sm:text-sm text-slate-400 group-hover:text-indigo-500 font-medium">
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
                <span className="text-xs sm:text-sm text-slate-500">
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
