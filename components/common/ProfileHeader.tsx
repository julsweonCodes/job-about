import React from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { ImageWithSkeleton } from "@/components/ui/ImageWithSkeleton";

interface HeaderProps {
  onClickLogo?: () => void;
  onClickProfile?: () => void;
}

export const ProfileHeader: React.FC<HeaderProps> = ({ onClickLogo, onClickProfile }) => {
  const { getUserProfileImageUrl } = useAuthStore();

  // 우선순위: props > store의 img_url > 기본 이미지
  const displayImage = getUserProfileImageUrl() || "/images/img-default-profile.png";
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Left side - Logo/Brand */}
          <div className="flex items-center">
            <div
              className="text-xl md:text-2xl font-bold text-black hover:text-[#7A73F1] transition-colors duration-200 cursor-pointer"
              onClick={onClickLogo}
            >
              job:about
            </div>
          </div>

          {/* Center - (비워둠, 필요시 추가) */}
          <div className="flex-1"></div>

          {/* Right side - Profile */}
          <div className="flex items-center space-x-3 lg:space-x-4">
            {/* Profile Avatar */}
            {onClickProfile && (
              <div className="relative cursor-pointer" onClick={onClickProfile}>
                <ImageWithSkeleton
                  src={displayImage}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                  fallbackSrc="/images/img-default-profile.png"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
