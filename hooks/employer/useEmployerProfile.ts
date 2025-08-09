import { useState, useEffect } from "react";
import { apiGetData, apiPatchData, apiPostData } from "@/utils/client/API";
import { API_URLS } from "@/constants/api";
import { showErrorToast, showSuccessToast } from "@/utils/client/toastUtils";
import {
  BizLocInfo,
  EditingState,
  DragDropState,
  ImageManagementState,
  DialogState,
} from "@/types/client/employer";
import { Location } from "@/constants/location";

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

export const useEmployerProfile = () => {
  // 기본 상태
  const [bizLocData, setBizLocData] = useState<BizLocInfo>(emptyBizLocInfo);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [tempData, setTempData] = useState<BizLocInfo>({} as BizLocInfo);

  // 편집 상태
  const [isEditing, setIsEditing] = useState<EditingState>({
    businessInfo: false,
    address: false,
    hours: false,
    contact: false,
    location: false,
    workplaceAttributes: false,
  });

  // 드래그 앤 드롭 상태
  const [dragDropState, setDragDropState] = useState<DragDropState>({
    draggedIndex: null,
    dragOverIndex: null,
    isOrderChanged: false,
  });

  // 이미지 관리 상태
  const [imageState, setImageState] = useState<ImageManagementState>({
    originalImages: [],
    extraPhotos: [],
    deletedImageIndexes: new Set(),
    isWorkplacePhotoChanged: false,
  });

  // 다이얼로그 상태
  const [dialogState, setDialogState] = useState<DialogState>({
    showImageUploadDialog: false,
    showProfileDialog: false,
  });

  // 프로필 데이터 로드
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await apiGetData<BizLocInfo>(API_URLS.EMPLOYER.PROFILE.ROOT());
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

  // bizLocData가 변경될 때 originalImages 업데이트
  useEffect(() => {
    if (bizLocData?.extraPhotos && imageState.originalImages.length === 0) {
      setImageState((prev) => ({
        ...prev,
        originalImages: bizLocData.extraPhotos.filter((img) => img !== ""),
      }));
    }
  }, [bizLocData, imageState.originalImages.length]);

  // 변경사항 감지
  useEffect(() => {
    const currentImages = imageState.originalImages
      .filter((_, index) => !imageState.deletedImageIndexes.has(index))
      .concat(imageState.extraPhotos);

    const hasImageChanges =
      imageState.extraPhotos.length > 0 ||
      imageState.deletedImageIndexes.size > 0 ||
      dragDropState.isOrderChanged;

    setImageState((prev) => ({
      ...prev,
      isWorkplacePhotoChanged: hasImageChanges,
    }));

    if (JSON.stringify(bizLocData.extraPhotos) !== JSON.stringify(currentImages)) {
      setBizLocData((prev) => ({
        ...prev,
        extraPhotos: currentImages,
      }));
    }
  }, [
    imageState.extraPhotos,
    imageState.originalImages,
    imageState.deletedImageIndexes,
    dragDropState.isOrderChanged,
  ]);

  // 편집 모드 관리
  const handleEdit = (section: keyof EditingState) => {
    setTempData(bizLocData);
    setIsEditing((prev) => ({ ...prev, [section]: true }));
  };

  const handleCancel = (section: keyof EditingState) => {
    setTempData(bizLocData);
    setIsEditing((prev) => ({ ...prev, [section]: false }));
  };

  // 이미지 관리
  const handleRemoveImage = (index: number) => {
    if (index < imageState.originalImages.length) {
      setImageState((prev) => ({
        ...prev,
        deletedImageIndexes: new Set(Array.from(prev.deletedImageIndexes).concat(index)),
      }));
    } else {
      const newImageIndex = index - imageState.originalImages.length;
      setImageState((prev) => ({
        ...prev,
        extraPhotos: prev.extraPhotos.filter((_, i) => i !== newImageIndex),
      }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const currentImageCount =
        imageState.originalImages.filter((_, index) => !imageState.deletedImageIndexes.has(index))
          .length + imageState.extraPhotos.length;
      const remainingSlots = 5 - currentImageCount;
      const filesToProcess = Array.from(files).slice(0, remainingSlots);

      filesToProcess.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            const imageUrl = e.target!.result as string;
            setImageState((prev) => ({
              ...prev,
              extraPhotos: [...prev.extraPhotos, imageUrl],
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // 드래그 앤 드롭 관리
  const handleDragStart = (index: number) => {
    setDragDropState((prev) => ({ ...prev, draggedIndex: index }));
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragDropState((prev) => ({ ...prev, dragOverIndex: index }));
  };

  const handleDragLeave = () => {
    setDragDropState((prev) => ({ ...prev, dragOverIndex: null }));
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (dragDropState.draggedIndex === null || dragDropState.draggedIndex === dropIndex) {
      setDragDropState((prev) => ({ ...prev, draggedIndex: null, dragOverIndex: null }));
      return;
    }

    try {
      const visibleOriginalImages = imageState.originalImages
        .map((image, originalIndex) => ({ image, originalIndex, type: "original" as const }))
        .filter(({ originalIndex }) => !imageState.deletedImageIndexes.has(originalIndex));

      const visibleExtraImages = imageState.extraPhotos.map((image, index) => ({
        image,
        originalIndex: imageState.originalImages.length + index,
        type: "extra" as const,
      }));

      const allVisibleImages = [...visibleOriginalImages, ...visibleExtraImages];
      const draggedItem = allVisibleImages[dragDropState.draggedIndex!];

      if (!draggedItem) {
        console.error("Invalid dragged index:", dragDropState.draggedIndex);
        setDragDropState((prev) => ({ ...prev, draggedIndex: null, dragOverIndex: null }));
        return;
      }

      const newVisibleImages = [...allVisibleImages];
      newVisibleImages.splice(dragDropState.draggedIndex!, 1);
      newVisibleImages.splice(dropIndex, 0, draggedItem);

      const newOriginalImages: string[] = [];
      const newExtraImages: string[] = [];

      newVisibleImages.forEach((item) => {
        if (item.type === "original") {
          newOriginalImages.push(item.image);
        } else {
          newExtraImages.push(item.image);
        }
      });

      setImageState((prev) => ({
        ...prev,
        originalImages: newOriginalImages,
        extraPhotos: newExtraImages,
        deletedImageIndexes: new Set(),
      }));

      setDragDropState((prev) => ({
        ...prev,
        draggedIndex: null,
        dragOverIndex: null,
        isOrderChanged: true,
      }));
    } catch (error) {
      console.error("Error in handleDrop:", error);
      setDragDropState((prev) => ({ ...prev, draggedIndex: null, dragOverIndex: null }));
    }
  };

  // 저장 함수들
  const handleSaveImages = async () => {
    try {
      setIsUpdating(true);

      const files: File[] = [];
      for (let i = 0; i < imageState.extraPhotos.length; i++) {
        const imageUrl = imageState.extraPhotos[i];
        if (imageUrl.startsWith("data:")) {
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const file = new File([blob], `photo_${i}.jpg`, { type: "image/jpeg" });
          files.push(file);
        }
      }

      let newPhotoUrls: string[] = [];
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => formData.append("photos", file));
        const uploadResponse = await apiPostData(API_URLS.EMPLOYER.PROFILE.PHOTOS_UPLOAD, formData);
        newPhotoUrls = uploadResponse.photoUrls || [];
      }

      const currentImages = imageState.originalImages
        .filter((_, index) => !imageState.deletedImageIndexes.has(index))
        .concat(newPhotoUrls);

      await apiPatchData(API_URLS.EMPLOYER.PROFILE.PHOTOS, {
        photoUrls: currentImages,
      });

      setImageState((prev) => ({
        ...prev,
        originalImages: currentImages,
        extraPhotos: [],
        deletedImageIndexes: new Set(),
        isWorkplacePhotoChanged: false,
      }));

      setDragDropState((prev) => ({ ...prev, isOrderChanged: false }));

      showSuccessToast("Images updated successfully");
    } catch (error) {
      console.error("Failed to save images:", error);
      showErrorToast("Failed to save images. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelImages = () => {
    setImageState((prev) => ({
      ...prev,
      extraPhotos: [],
      deletedImageIndexes: new Set(),
      isWorkplacePhotoChanged: false,
    }));
    setDragDropState((prev) => ({ ...prev, isOrderChanged: false }));
  };

  const handleLogoSave = async (file: File) => {
    try {
      setIsUpdating(true);
      const formData = new FormData();
      formData.append("logo", file);

      const responseData = await apiPatchData(API_URLS.EMPLOYER.PROFILE.LOGO, formData);

      if (responseData.logo_url) {
        setBizLocData((prev) => ({
          ...prev,
          logoImg: responseData.logo_url,
        }));
        setDialogState((prev) => ({ ...prev, showImageUploadDialog: false }));
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

  const handleOptionsSave = async (section: string) => {
    try {
      setIsUpdating(true);

      const sectionFields = {
        address: ["address"],
        hours: ["startTime", "endTime"],
        contact: ["phone"],
        location: ["location"],
      };

      const updateData = Object.fromEntries(
        sectionFields[section as keyof typeof sectionFields]?.map((field) => [
          field,
          tempData[field as keyof BizLocInfo],
        ]) || []
      );

      await apiPatchData(API_URLS.EMPLOYER.PROFILE.ROOT(), updateData);

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

  const handleProfileSave = async () => {
    try {
      setIsUpdating(true);

      const updateData = {
        name: tempData.name,
        bizDescription: tempData.bizDescription,
      };

      await apiPatchData(API_URLS.EMPLOYER.PROFILE.ROOT(), updateData);

      setBizLocData(tempData);
      setDialogState((prev) => ({ ...prev, showProfileDialog: false }));
      showSuccessToast("Information updated successfully");
    } catch (error) {
      console.error("Failed to save profile:", error);
      showErrorToast("Failed to save profile. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  // 다이얼로그 관리
  const handleImageUploadDialog = () => {
    setDialogState((prev) => ({ ...prev, showImageUploadDialog: true }));
  };

  const handleProfileEdit = () => {
    setTempData(bizLocData);
    setDialogState((prev) => ({ ...prev, showProfileDialog: true }));
  };

  const handleCloseProfileDialog = () => {
    setDialogState((prev) => ({ ...prev, showProfileDialog: false }));
  };

  const handleTempInputChange = (field: string, value: string) => {
    setTempData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    // 상태
    bizLocData,
    isLoading,
    error,
    isUpdating,
    tempData,
    isEditing,
    dragDropState,
    imageState,
    dialogState,

    // 액션
    handleEdit,
    handleCancel,
    handleRemoveImage,
    handleImageUpload,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleSaveImages,
    handleCancelImages,
    handleLogoSave,
    handleOptionsSave,
    handleProfileSave,
    handleImageUploadDialog,
    handleProfileEdit,
    handleCloseProfileDialog,
    handleTempInputChange,
  };
};
