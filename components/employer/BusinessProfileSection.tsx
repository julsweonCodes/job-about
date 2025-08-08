import React from "react";
import { Calendar, Camera, Edit3 } from "lucide-react";
import { formatYYYYMMDDtoMonthDayYear } from "@/lib/utils";
import { STORAGE_URLS } from "@/constants/storage";
import { BizLocInfo } from "@/types/client/employer";

interface BusinessProfileSectionProps {
  bizLocData: BizLocInfo;
  onProfileEdit: () => void;
  onImageUploadDialog: () => void;
}

export const BusinessProfileSection: React.FC<BusinessProfileSectionProps> = ({
  bizLocData,
  onProfileEdit,
  onImageUploadDialog,
}) => {
  return (
    <>
      <div className="px-1">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center justify-between">
          <span>Basic Information</span>
          <button
            onClick={onProfileEdit}
            className="p-2 sm:p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-200 touch-manipulation"
          >
            <Edit3 size={16} className="text-slate-600" />
          </button>
        </h3>
      </div>

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
                    const target = e.target as HTMLImageElement;
                    target.src = `${STORAGE_URLS.BIZ_LOC.PHOTO}bizLoc_default.png`;
                  }}
                />
              </div>
              <button
                onClick={onImageUploadDialog}
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
    </>
  );
};
