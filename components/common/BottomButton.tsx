import React from "react";
import { Button } from "@/components/ui/Button";

interface BottomButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost";
  className?: string;
  disabled?: boolean;
}

export default function BottomButton({
  children,
  onClick,
  type = "button",
  size = "lg",
  variant = "default",
  className = "",
  disabled = false,
}: BottomButtonProps) {
  return (
    <div className="md:relative">
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white md:static md:p-0 md:bg-transparent md:border-t-0">
        <Button
          type={type}
          size={size}
          variant={variant}
          className={`w-full ${className}`}
          onClick={onClick}
          disabled={disabled}
        >
          {children}
        </Button>
      </div>
    </div>
  );
}
