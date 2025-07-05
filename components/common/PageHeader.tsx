import React from "react";
import Typography from "@/components/ui/Typography";

interface PageHeaderProps {
  title: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function PageHeader({ title, leftIcon, rightIcon }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white flex items-center justify-between h-14 px-4">
      <div className="flex items-center min-w-[32px] justify-start">
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
      <div className="flex items-center min-w-[32px] justify-end">
        {rightIcon ? rightIcon : null}
      </div>
    </header>
  );
}
