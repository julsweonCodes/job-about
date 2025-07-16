import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const typographyVariants = cva("text-text-primary", {
  variants: {
    variant: {
      headlineLg: "text-[22px] sm:text-[28px] font-bold",
      headlineMd: "text-[18px] sm:text-[24px] font-bold",
      headlineSm: "text-[18px] sm:text-[22px] font-semibold",
      titleBold: "text-[16px] sm:text-[22px] font-bold",
      titleMd: "text-[16px] sm:text-[22px] font-medium",
      titleRegular: "text-[16px] sm:text-[18px] font-normal",
      bodySmBold: "text-[14px] sm:text-[20px] font-bold",
      bodyXs: "text-[12px] sm:text-[14px] font-normal",
      bodySm: "text-[14px] sm:text-[16px] font-medium",
      bodyMd: "text-[14px] sm:text-[20px] font-medium",
      bodyLg: "text-[14px] sm:text-[20px] font-normal",
    },
  },
  defaultVariants: {
    variant: "titleRegular",
  },
});

export interface TypographyProps<T extends React.ElementType = "p">
  extends React.HTMLAttributes<T>,
    VariantProps<typeof typographyVariants> {
  as?: T;
  children?: React.ReactNode;
}

export default function Typography<T extends React.ElementType = "p">({
  as,
  children,
  variant,
  className,
  ...props
}: TypographyProps<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof TypographyProps>) {
  const Component = as || "p";
  return (
    <Component className={cn("truncate", typographyVariants({ variant }), className)} {...props}>
      {children}
    </Component>
  );
}
