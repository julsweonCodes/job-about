import React from "react";
import Typography from "@/components/ui/Typography";

interface PageHeaderProps {
  title?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClickLeft?: () => void;
  onClickRight?: () => void;
}

export default function PageHeader({
  title,
  leftIcon,
  rightIcon,
  onClickLeft,
  onClickRight,
}: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white flex items-center justify-between h-14 px-4">
      <div
        className={`flex items-center justify-center w-8 h-8 ${leftIcon && onClickLeft ? "hover:bg-gray-100 active:bg-gray-200 rounded-full transition-colors duration-150 cursor-pointer" : ""}`}
        tabIndex={leftIcon && onClickLeft ? 0 : -1}
        role={leftIcon && onClickLeft ? "button" : undefined}
        aria-label={leftIcon ? "왼쪽 아이콘" : undefined}
        onClick={leftIcon && onClickLeft ? onClickLeft : undefined}
      >
        {leftIcon ? leftIcon : null}
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none">
        <Typography
          as="span"
          variant="headlineMd"
          className="text-center pointer-events-none select-none"
        >
          {title}
        </Typography>
      </div>
      <div
        className={`flex items-center justify-center w-8 h-8 ${rightIcon && onClickRight ? "hover:bg-gray-100 active:bg-gray-200 rounded-full transition-colors duration-150 cursor-pointer" : ""}`}
        tabIndex={rightIcon && onClickRight ? 0 : -1}
        role={rightIcon && onClickRight ? "button" : undefined}
        aria-label={rightIcon ? "오른쪽 아이콘" : undefined}
        onClick={rightIcon && onClickRight ? onClickRight : undefined}
      >
        {rightIcon ? rightIcon : null}
      </div>
    </header>
  );
}
