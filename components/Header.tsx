import React from "react";
import Typography from "@/components/ui/Typography";

interface HeaderProps {
  title: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Header({ title, leftIcon, rightIcon }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-background-primary">
      <div className="max-w-md mx-auto flex items-center justify-between h-16">
        <div className="w-6 h-6">{leftIcon}</div>

        <Typography as="h1" variant="headlineLg" className="text-center flex-1 truncate">
          {title}
        </Typography>

        <div className="w-6 h-6 flex justify-end">{rightIcon}</div>
      </div>
    </header>
  );
}
