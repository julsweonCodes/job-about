import React from "react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface PostHeaderProps {
  title?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClickLeft?: () => void;
  onClickRight?: () => void;
}

export default function PostHeader({ rightIcon, onClickLeft, onClickRight }: PostHeaderProps) {
  const router = useRouter();

  return (
    <header className="bg-white lg:px-6 sticky top-0 z-20 border-b border-gray-100  h-16 lg:h-20 flex items-center justify-between">
      <div className="max-w-6xl mx-auto w-full px-5 lg:px-6">
        <div className="flex items-center justify-between w-full">
          <button
            onClick={
              onClickLeft ||
              (() => {
                router.back();
              })
            }
            className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          <button
            onClick={onClickRight}
            className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {rightIcon}
          </button>
        </div>
      </div>
    </header>
  );
}
