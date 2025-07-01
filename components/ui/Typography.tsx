// components/ui/Text.tsx
import React from "react";
import { cn } from "@/lib/utils";

type Variant =
  | "headlineLg" // 22px Bold
  | "headlineMd" // 18px Bold
  | "headlineSm" // 18px SemiBold
  | "titleBold" // 16px Bold
  | "titleMd" // 16px Medium
  | "titleRegular" // 16px Regular
  | "bodySmBold" // 14px Bold
  | "bodySm" // 14px Medium
  | "bodyXs" // 14px regular

interface TypographyProps<T extends React.ElementType = "p"> {
  as?: T;
  variant?: Variant;
  className?: string;
  children?: React.ReactNode;
}

export default function Typography<T extends React.ElementType = "p">({
  as,
  children,
  variant = "titleRegular",
  className,
  ...props
}: TypographyProps<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof TypographyProps>) {
  const Component = as || "p";

  const variants: Record<Variant, string> = {
    headlineLg: "text-[22px] sm:text-[28px] font-bold",
    headlineMd: "text-[18px] sm:text-[24px] font-bold",
    headlineSm: "text-[18px] sm:text-[22px] font-semibold",
    titleBold: "text-[16px] sm:text-[22px] font-bold",
    titleMd: "text-[16px] sm:text-[22px] font-medium",
    titleRegular: "text-[16px] sm:text-[18px] font-normal",
    bodySmBold: "text-[14px] sm:text-[20px] font-bold",
    bodySm: "text-[14px] sm:text-[20px] font-medium",
    bodyXs: "text-[14px] sm:text-[20px] font-normal",
  };

  return (
    <Component className={cn("text-text-primary", variants[variant], className)} {...props}>
      {children}
    </Component>
  );
}
