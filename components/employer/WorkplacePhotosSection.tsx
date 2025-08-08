import React, { useRef } from "react";
import { ImageIcon, Plus, X } from "lucide-react";
import { STORAGE_URLS } from "@/constants/storage";
import MypageActionButtons from "@/components/common/MypageActionButtons";
import { ImageManagementState, DragDropState } from "@/types/client/employer";

interface WorkplacePhotosSectionProps {
  imageState: ImageManagementState;
  dragDropState: DragDropState;
  isWorkplacePhotoChanged: boolean;
  onRemoveImage: (index: number) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, dropIndex: number) => void;
  onSaveImages: () => void;
  onCancelImages: () => void;
}

export const WorkplacePhotosSection: React.FC<WorkplacePhotosSectionProps> = ({
  imageState,
  dragDropState,
  isWorkplacePhotoChanged,
  onRemoveImage,
  onImageUpload,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onSaveImages,
  onCancelImages,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddPhotoClick = () => {
    fileInputRef.current?.click();
  };

  const visibleOriginalImages = imageState.originalImages
    .map((image, originalIndex) => ({
      image,
      originalIndex,
      type: "original" as const,
    }))
    .filter(({ originalIndex }) => !imageState.deletedImageIndexes.has(originalIndex));

  const visibleExtraImages = imageState.extraPhotos.map((image, index) => ({
    image,
    originalIndex: imageState.originalImages.length + index,
    type: "extra" as const,
  }));

  const allVisibleImages = [...visibleOriginalImages, ...visibleExtraImages];
  const currentImageCount = allVisibleImages.length;

  return (
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

        <div>
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide px-1 sm:px-2">
            {allVisibleImages.map((item, displayIndex) => (
              <div
                key={`${item.type}-${item.originalIndex}`}
                className={`relative flex-shrink-0 group p-1 sm:p-2 cursor-move ${
                  dragDropState.draggedIndex === displayIndex ? "opacity-50" : ""
                } ${dragDropState.dragOverIndex === displayIndex ? "ring-2 ring-indigo-400" : ""}`}
                draggable
                onDragStart={() => onDragStart(displayIndex)}
                onDragOver={(e) => onDragOver(e, displayIndex)}
                onDragLeave={onDragLeave}
                onDrop={(e) => onDrop(e, displayIndex)}
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl overflow-hidden ring-2 ring-slate-200 bg-slate-100 shadow-sm">
                  <img
                    src={
                      item.image.startsWith("data:")
                        ? item.image
                        : `${STORAGE_URLS.BIZ_LOC.PHOTO}${item.image}`
                    }
                    alt={`Workplace ${displayIndex + 1}`}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `${STORAGE_URLS.BIZ_LOC.PHOTO}bizLoc_default.png`;
                    }}
                  />
                </div>
                <button
                  onClick={() => onRemoveImage(item.originalIndex)}
                  className="absolute top-0 right-0 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 touch-manipulation z-10"
                >
                  <X size={12} />
                </button>
              </div>
            ))}

            {currentImageCount < 5 && (
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
                  onChange={onImageUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-3 mb-4 sm:mb-6">
            <span className="text-xs sm:text-sm text-slate-500">
              {currentImageCount} of 5 photos
            </span>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors duration-200 ${
                    i < currentImageCount ? "bg-indigo-400" : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
          </div>

          {isWorkplacePhotoChanged && (
            <MypageActionButtons
              onCancel={onCancelImages}
              onSave={onSaveImages}
              cancelText="Cancel"
              saveText="Save Changes"
            />
          )}
        </div>
      </div>
    </div>
  );
};
