"use client";
import React from "react";
import { Clock, MapPin, Phone } from "lucide-react";
import BackHeader from "@/components/common/BackHeader";
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
import LoadingScreen from "@/components/common/LoadingScreen";
import { STORAGE_URLS } from "@/constants/storage";
import { Location } from "@/constants/location";
import { getLocationDisplayName } from "@/constants/location";
import { useEmployerProfile } from "@/hooks/employer/useEmployerProfile";
import { BusinessProfileSection } from "@/components/employer/BusinessProfileSection";
import { WorkplacePhotosSection } from "@/components/employer/WorkplacePhotosSection";
import { LoadingScreen as EmployerLoadingScreen } from "@/components/employer/EmployerMypageSkeletons";

function EmployerMypage() {
  const {
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
  } = useEmployerProfile();

  if (isLoading) {
    return <EmployerLoadingScreen />;
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
      <BackHeader title="My Business Profile" />
      {isUpdating && <LoadingScreen overlay={true} opacity="light" />}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-5">
        {/* Business Profile Section */}
        <BusinessProfileSection
          bizLocData={bizLocData}
          onProfileEdit={handleProfileEdit}
          onImageUploadDialog={handleImageUploadDialog}
        />

        <div className="px-1">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">Business Information</h3>
        </div>

        {/* Business Information Sections */}
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
                onValueChange={(value) => handleTempInputChange("location", value)}
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
                handleTempInputChange("address", e.target.value)
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
              onStartTimeChange={(time) => handleTempInputChange("startTime", time)}
              onEndTimeChange={(time) => handleTempInputChange("endTime", time)}
              label="Operating Hours"
            />
          ) : (
            <p className="text-slate-700 text-sm sm:text-base">
              {bizLocData?.startTime} - {bizLocData?.endTime}
            </p>
          )}
        </InfoSection>

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
                  handleTempInputChange("phone", e.target.value)
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

        {/* Workplace Photos Section */}
        <WorkplacePhotosSection
          imageState={imageState}
          dragDropState={dragDropState}
          isWorkplacePhotoChanged={imageState.isWorkplacePhotoChanged}
          onRemoveImage={handleRemoveImage}
          onImageUpload={handleImageUpload}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onSaveImages={handleSaveImages}
          onCancelImages={handleCancelImages}
        />
      </div>

      {/* Bottom Spacing for Mobile */}
      <div className="h-4 sm:h-0"></div>

      {/* Profile Edit Dialog */}
      <BaseDialog
        open={dialogState.showProfileDialog}
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
        open={dialogState.showImageUploadDialog}
        onClose={() => handleCloseProfileDialog()}
        onSave={handleLogoSave}
        title="Change Business Logo"
        type="logo"
        currentImage={`${STORAGE_URLS.BIZ_LOC.PHOTO}${bizLocData?.logoImg}`}
      />
    </div>
  );
}

export default EmployerMypage;
