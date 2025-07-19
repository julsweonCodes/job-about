import React from "react";
import Image from "next/image";

interface HeaderProps {
  profileImage?: string;
  onClickLogo?: () => void;
  onClickProfile?: () => void;
}

export const ProfileHeader: React.FC<HeaderProps> = ({
  profileImage,
  onClickLogo,
  onClickProfile,
}) => {
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
            <div className="relative">
              <Image
                src={profileImage || "/images/img-default-profile.png"}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full cursor-pointer"
                onClick={onClickProfile}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
