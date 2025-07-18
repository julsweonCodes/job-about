import React from "react";
import { ChevronLeft, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

interface PostHeaderProps {
  title?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  previewMode?: boolean;
  onClickLeft?: () => void;
  onClickRight?: () => void;
}

export default function PostHeader({
  rightIcon,
  onClickLeft,
  onClickRight,
  previewMode,
}: PostHeaderProps) {
  const router = useRouter();

  return (
    <header className="bg-white lg:px-6 sticky top-0 z-20 border-b border-gray-100  min-h-16 lg:min-h-20 flex items-center justify-between">
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

          {rightIcon && (
            <button
              onClick={onClickRight}
              className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {rightIcon}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
