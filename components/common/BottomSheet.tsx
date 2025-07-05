import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const bottomSheetVariants = cva("fixed inset-0 z-50 flex items-end justify-center bg-black/40", {
  variants: {
    size: {
      md: "max-w-md",
      lg: "max-w-lg",
      full: "max-w-full",
    },
    align: {
      center: "items-end justify-center",
      left: "items-end justify-start",
      right: "items-end justify-end",
    },
  },
  defaultVariants: {
    size: "md",
    align: "center",
  },
});

const bottomSheetContentVariants = cva(
  "relative w-full bg-white rounded-t-2xl shadow-lg p-6 pt-4 transition-all duration-300 animate-bottomSheetIn",
  {
    variants: {
      size: {
        md: "max-w-md",
        lg: "max-w-lg",
        full: "max-w-full",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface BottomSheetProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bottomSheetVariants> {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function BottomSheet({
  open,
  onClose,
  children,
  className,
  size,
  align,
  ...props
}: BottomSheetProps) {
  if (!open) return null;

  return (
    <div className={cn(bottomSheetVariants({ size, align }), className)} onClick={onClose}>
      <div
        className={cn(bottomSheetContentVariants({ size }), "min-h-[60vh]")}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {/* Drag handle */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-2 bg-gray-300 rounded-full" />
        </div>
        {children}
      </div>
      <style jsx global>{`
        @keyframes bottomSheetIn {
          from {
            opacity: 0;
            transform: translateY(100px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-bottomSheetIn {
          animation: bottomSheetIn 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>
    </div>
  );
}
