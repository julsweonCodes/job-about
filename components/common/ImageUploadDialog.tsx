import React, { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import BaseDialog from "./BaseDialog";
import { Button } from "@/components/ui/Button";

interface ImageUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (file: File) => void;
  title: string;
  type: "logo" | "profile";
  currentImages?: string[];
}

const ImageUploadDialog: React.FC<ImageUploadDialogProps> = ({
  open,
  onClose,
  onSave,
  title,
  type,
  currentImages = [],
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    onClose();
  };

  const handleSave = () => {
    if (selectedFile) {
      onSave(selectedFile);
      setPreviewImage(null);
      setSelectedFile(null);
      onClose();
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <BaseDialog open={open} onClose={handleClose} title={title} size="md" type="bottomSheet">
      <div className="space-y-4">
        {/* Current Images Display */}
        {currentImages.length > 0 && (
          <div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {currentImages.map((image, index) => (
                <div key={index} className="relative flex-shrink-0">
                  <img
                    src={image}
                    alt={`Current ${type}`}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div className="space-y-3 flex flex-col items-center w-full">
          <div className="flex flex-col items-start w-full">
            <h4 className="text-sm sm:text-base text-gray-500">Upload New Image</h4>
            <p className="text-sm sm:text-base text-gray-500">
              Please upload a new image for your {type === "logo" ? "logo" : "profile"}.
            </p>
          </div>

          {previewImage ? (
            <div className="relative">
              <img
                src={previewImage}
                alt="Preview"
                className="h-32 sm:h-48 aspect-square object-cover rounded-lg"
              />
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <Button
              onClick={handleUploadClick}
              variant="outline"
              size="lg"
              className="h-32 sm:h-48 aspect-square border-dashed border-2 border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50 py-10"
            >
              <div className="flex flex-col items-center gap-2">
                <Upload className="text-gray-400 w-10 h-10" />
                <span className="text-sm text-slate-500">Click to upload image</span>
              </div>
            </Button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleSave}
            size="lg"
            className="flex-1"
            disabled={!selectedFile}
          >
            Save
          </Button>
        </div>
      </div>
    </BaseDialog>
  );
};

export default ImageUploadDialog;
