import React from "react";

interface ProfileDropdownProps {
  isVisible: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onProfileClick: () => void;
  onHomeClick: () => void;
  onLogoutClick: () => void;
  userRole: "employer" | "seeker";
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  isVisible,
  onMouseEnter,
  onMouseLeave,
  onProfileClick,
  onHomeClick,
  onLogoutClick,
  userRole,
}) => {
  if (!isVisible) return null;

  // 드롭다운 아이템 스타일 함수
  const getItemClasses = (isLogout: boolean = false) => {
    const baseClasses =
      "w-full cursor-pointer text-left flex items-center gap-4 transition-all duration-200 text-sm md:text-lg font-semibold";
    const paddingClasses = "px-4 py-5 md:px-5 md:py-6";
    const colorClasses = isLogout
      ? "text-red-600 hover:bg-gray-100"
      : "text-gray-800 hover:bg-gray-100";

    return `${baseClasses} ${paddingClasses} ${colorClasses}`;
  };

  return (
    <div
      className="absolute right-0 mt-2 w-[150px] md:w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 backdrop-blur-sm overflow-hidden"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button onClick={onHomeClick} className={getItemClasses()}>
        <span className="font-medium">
          {userRole === "employer" ? "Employer Home" : "Seeker Home"}
        </span>
      </button>
      <button onClick={onProfileClick} className={getItemClasses()}>
        <span className="font-medium">MyPage</span>
      </button>
      <button onClick={onLogoutClick} className={getItemClasses(true)}>
        <span className="font-medium">Logout</span>
      </button>
    </div>
  );
};
