import React, { useRef, useState } from "react";
import { Upload } from "lucide-react";
import BaseDialog from "./BaseDialog";

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
          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-slate-100 mb-4">
            <img
              src={displayImage}
              alt={`${type} preview`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Upload Button */}
          <button
            onClick={handleFileSelect}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
          >
            <Upload size={16} />
            <span>{getButtonText()}</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Instructions */}
        <div className="text-center text-sm text-slate-600">
          <p>{guidelines.line1}</p>
          <p>{guidelines.line2}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={handleCancel}
          className="flex-1 py-3 px-4 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!previewImage}
          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
        >
          Save Changes
        </button>
      </div>
    </BaseDialog>
  );
};

export default ImageUploadDialog;
