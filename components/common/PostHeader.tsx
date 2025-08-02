import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, Eye, Pencil, EllipsisVertical } from "lucide-react";
import { useRouter } from "next/navigation";

interface PostHeaderProps {
  title?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  previewMode?: boolean;
  editMode?: boolean;
  onClickLeft?: () => void;
  onClickRight?: () => void;
  // 드롭다운 관련 props
  showDropdown?: boolean;
  dropdownItems?: Array<{
    label: string;
    color?: string;
    onClick: () => void;
    isDestructive?: boolean;
  }>;
  onDropdownToggle?: () => void;
}

export default function PostHeader({
  rightIcon,
  onClickLeft,
  onClickRight,
  previewMode,
  editMode,
  showDropdown = false,
  dropdownItems = [],
  onDropdownToggle,
}: PostHeaderProps) {
  const router = useRouter();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleRightClick = () => {
    if (onDropdownToggle) {
      onDropdownToggle();
    } else if (onClickRight) {
      onClickRight();
    } else {
      setIsDropdownVisible(!isDropdownVisible);
    }
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownVisible(false);
        if (onDropdownToggle) {
          onDropdownToggle();
        }
      }
    };

    if (showDropdown || isDropdownVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown, isDropdownVisible, onDropdownToggle]);

  const getItemClasses = (isDestructive: boolean = false) => {
    const baseClasses =
      "w-full cursor-pointer text-left flex items-center gap-4 transition-all duration-200 text-sm md:text-lg font-semibold";
    const paddingClasses = "px-4 py-5 md:px-5 md:py-6";
    const colorClasses = isDestructive
      ? "text-red-600 hover:bg-gray-100"
      : "text-gray-800 hover:bg-gray-100";

    return `${baseClasses} ${paddingClasses} ${colorClasses}`;
  };

  return (
    <header className="bg-white lg:px-6 sticky top-0 z-20 border-b border-gray-100 min-h-16 lg:min-h-20 flex items-center justify-between">
      <div className="max-w-6xl mx-auto w-full px-5 lg:px-6">
        <div className="flex items-center justify-between w-full">
          <button
            onClick={
              onClickLeft ||
              (() => {
                router.back();
              })
            }
            className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          {previewMode && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Eye className="w-4 h-4" />
                <span>Preview Mode</span>
              </div>
            </div>
          )}

          {editMode && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Pencil className="w-4 h-4" />
                <span>Edit Mode</span>
              </div>
            </div>
          )}

          {rightIcon && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleRightClick}
                className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {rightIcon}
              </button>

              {/* 드롭다운 */}
              {(showDropdown || isDropdownVisible) && dropdownItems.length > 0 && (
                <div className="absolute top-full right-0 mt-1 w-[180px] md:w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 backdrop-blur-sm overflow-hidden">
                  {dropdownItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        item.onClick();
                        setIsDropdownVisible(false);
                      }}
                      className={getItemClasses(item.isDestructive || false)}
                    >
                      <span className={`font-medium ${item.color}`}>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
