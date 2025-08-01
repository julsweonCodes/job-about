import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { ImageWithSkeleton } from "@/components/ui/ImageWithSkeleton";
import GoogleLoginButton from "@/components/buttons/GoogleLoginButton";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ProfileDropdown } from "./ProfileDropdown";

interface HeaderProps {
  showProfileImage?: boolean;
}

// 상수 정의
const DROPDOWN_TIMEOUT_DELAY = 100;
const DEFAULT_PROFILE_IMAGE = "/images/img-default-profile.png";

export const ProfileHeader: React.FC<HeaderProps> = ({ showProfileImage = true }) => {
  const router = useRouter();
  const { getUserProfileImageUrl, isEmployer, isApplicant } = useAuthStore();
  const { authState, handleLogout } = useAuth();
  const isMobile = useIsMobile();

  // 상태 관리
  const [isClient, setIsClient] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // refs
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 프로필 이미지 URL
  const displayImage = getUserProfileImageUrl() || DEFAULT_PROFILE_IMAGE;

  const mypagePath = useMemo(() => {
    if (isEmployer()) return "/employer/mypage";
    if (isApplicant()) return "/seeker/mypage";
    return "/seeker/mypage"; // 기본값
  }, [isEmployer, isApplicant]);

  const homePath = useMemo(() => {
    if (isEmployer()) return "/employer";
    if (isApplicant()) return "/seeker";
    return "/seeker"; // 기본값
  }, [isEmployer, isApplicant]);

  // 이벤트 핸들러들
  const handleLogoClick = useCallback(() => {
    router.replace("/");
  }, [router]);

  const handleProfileClick = useCallback(() => {
    router.push(mypagePath);
  }, [router, mypagePath]);

  const handleDropdownToggle = useCallback(() => {
    if (isMobile) {
      setShowDropdown((prev) => !prev);
    }
  }, [isMobile]);

  const handleMouseEnter = useCallback(() => {
    if (!isMobile) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setShowDropdown(true);
    }
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    if (!isMobile) {
      timeoutRef.current = setTimeout(() => {
        setShowDropdown(false);
      }, DROPDOWN_TIMEOUT_DELAY);
    }
  }, [isMobile]);

  const handleProfileAction = useCallback(() => {
    handleProfileClick();
    setShowDropdown(false);
  }, [handleProfileClick]);

  const handleHomeAction = useCallback(() => {
    router.push(homePath);
    setShowDropdown(false);
  }, [router, homePath]);

  const handleLogoutAction = useCallback(() => {
    handleLogout();
    setShowDropdown(false);
  }, [handleLogout]);

  // 클라이언트 사이드 렌더링 확인
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // 인증 상태별 UI 렌더링
  const renderAuthUI = useCallback(() => {
    if (!isClient) {
      return <div />; // 서버 렌더링 시 빈 div (hydration 일치)
    }

    switch (authState) {
      case "initializing":
        return <LoadingSpinner />;

      case "error":
      case "unauthenticated":
        return <GoogleLoginButton />;

      case "authenticated":
        return showProfileImage ? (
          <AuthenticatedUserUI
            displayImage={displayImage}
            dropdownRef={dropdownRef}
            showDropdown={showDropdown}
            onToggle={handleDropdownToggle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onProfileClick={handleProfileAction}
            onHomeClick={handleHomeAction}
            onLogoutClick={handleLogoutAction}
            isEmployer={isEmployer}
          />
        ) : null;

      default:
        return <LoadingSpinner />;
    }
  }, [
    isClient,
    authState,
    showProfileImage,
    displayImage,
    showDropdown,
    isMobile,
    handleDropdownToggle,
    handleMouseEnter,
    handleMouseLeave,
    handleProfileAction,
    handleLogoutAction,
  ]);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Logo onClick={handleLogoClick} />

          {/* Spacer */}
          <div className="flex-1" />

          {/* Auth UI */}
          <div className="flex items-center space-x-3 lg:space-x-4">{renderAuthUI()}</div>
        </div>
      </div>
    </header>
  );
};

// 하위 컴포넌트들
const Logo: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div className="flex items-center">
    <div
      className="text-xl md:text-2xl font-bold text-black hover:text-[#7A73F1] transition-colors duration-200 cursor-pointer"
      onClick={onClick}
    >
      job:about
    </div>
  </div>
);

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center gap-3">
    <div className="w-4 h-4 border-2 border-gray-300 border-t-purple-600 rounded-full animate-spin" />
  </div>
);

const AuthenticatedUserUI: React.FC<{
  displayImage: string;
  dropdownRef: React.RefObject<HTMLDivElement>;
  showDropdown: boolean;
  onToggle: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onProfileClick: () => void;
  onHomeClick: () => void;
  onLogoutClick: () => void;
  isEmployer: () => boolean;
}> = ({
  displayImage,
  dropdownRef,
  showDropdown,
  onToggle,
  onMouseEnter,
  onMouseLeave,
  onProfileClick,
  onHomeClick,
  onLogoutClick,
  isEmployer,
}) => (
  <div className="flex items-center gap-6">
    <div ref={dropdownRef} className="relative">
      <div
        className="cursor-pointer"
        onClick={onToggle}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <ImageWithSkeleton
          src={displayImage}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 hover:border-purple-300 transition-colors duration-200"
          fallbackSrc={DEFAULT_PROFILE_IMAGE}
        />
      </div>

      <ProfileDropdown
        isVisible={showDropdown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onProfileClick={onProfileClick}
        onLogoutClick={onLogoutClick}
        onHomeClick={onHomeClick}
        userRole={isEmployer() ? "employer" : "seeker"}
      />
    </div>
  </div>
);
