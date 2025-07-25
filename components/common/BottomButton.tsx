import React from "react";
import { Button } from "@/components/ui/Button";

interface BottomButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost" | "gradient";
  className?: string;
  disabled?: boolean;
  showBorder?: boolean;
}

export default function BottomButton({
  children,
  onClick,
  type = "button",
  size = "lg",
  variant = "default",
  className = "",
  disabled = false,
  showBorder = true,
}: BottomButtonProps) {
  return (
    <div className="md:relative">
      <div
        className={`fixed bottom-0 left-0 right-0 p-4 bg-white md:static md:p-0 md:bg-transparent ${
          showBorder ? "border-t border-gray-200 md:border-t-0" : "border-none"
        }`}
      >
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
