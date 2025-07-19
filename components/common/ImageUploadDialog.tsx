import React, { useRef, useState } from "react";
import { Upload } from "lucide-react";
import BaseDialog from "./BaseDialog";
import { Button } from "../ui/Button";

interface ImageUploadDialogProps {
  open: boolean;
  onClose: () => void;
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
  title?: string;
  type?: "logo" | "profile";
  defaultImage?: string;
}

const ImageUploadDialog: React.FC<ImageUploadDialogProps> = ({
  open,
  onClose,
  currentImage,
  onImageChange,
  title,
  type = "logo",
  defaultImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviewImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // TODO: 이미지 업로드 로직 추가
    if (previewImage) {
      onImageChange(previewImage);
      setPreviewImage(null);
      onClose();
    }
  };

  const handleCancel = () => {
    setPreviewImage(null);
    onClose();
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  // 기본 이미지 설정
  const getDefaultImage = () => {
    if (defaultImage) return defaultImage;
    return type === "logo"
      ? "/images/img-default-business-profile.png"
      : "/images/img-default-profile.png";
  };

  const displayImage = previewImage || currentImage || getDefaultImage();

  // 제목 설정
  const getTitle = () => {
    if (title) return title;
    return type === "logo" ? "Change Business Logo" : "Change Profile Photo";
  };

  // 버튼 텍스트 설정
  const getButtonText = () => {
    return type === "logo" ? "Choose Logo" : "Choose Photo";
  };

  // 가이드라인 텍스트 설정
  const getGuidelines = () => {
    if (type === "logo") {
      return {
        line1: "Upload a square image for best results",
        line2: "Recommended size: 512x512 pixels",
      };
    } else {
      return {
        line1: "Upload a clear photo of yourself",
        line2: "Recommended size: 400x400 pixels",
      };
    }
  };

  const guidelines = getGuidelines();

  return (
    <BaseDialog open={open} onClose={handleCancel} title={getTitle()} size="sm" type="bottomSheet">
      <div className="space-y-6">
        {/* Image Preview */}
        <div className="text-center">
          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-slate-100 mt-4 mb-4">
            <img
              src={displayImage}
              alt={`${type} preview`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Instructions */}
          <div className="text-center text-sm sm:text-base text-slate-600 mb-4">
            <p>{guidelines.line1}</p>
            <p>{guidelines.line2}</p>
          </div>

          <div className="flex flex-col gap-2">
            {/* Upload Button */}
            <Button onClick={handleFileSelect} variant="secondary" size="md">
              <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
              <span className="text-sm sm:text-base">{getButtonText()}</span>
            </Button>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={!previewImage} size="md">
                <span className="text-sm sm:text-base">Save Changes</span>
              </Button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>
    </BaseDialog>
  );
};

export default ImageUploadDialog;
