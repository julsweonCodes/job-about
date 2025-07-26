import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";

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
  "relative w-full bg-white rounded-t-2xl shadow-lg p-5 pt-4 transition-all duration-300 animate-bottomSheetIn",
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
  // BottomSheet가 열렸을 때 배경 스크롤 방지
  React.useEffect(() => {
    if (open) {
      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      return () => {
        // BottomSheet가 닫힐 때 다른 다이얼로그가 열려있는지 확인
        setTimeout(() => {
          const hasOpenDialogs = document.querySelectorAll('[data-dialog-open="true"]').length > 0;
          if (!hasOpenDialogs) {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
          }
        }, 0);
      };
    }
  }, [open]);

  if (!open) return null;

  const sheet = (
    <div
      className={cn(bottomSheetVariants({ size, align }), className)}
      onClick={onClose}
      data-dialog-open={open}
    >
      <div
        className={cn(bottomSheetContentVariants({ size }), "min-h-[10vh]", className)}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {/* Drag handle */}
        <div className="flex justify-center mb-4">
          <div className="w-8 h-1 bg-gray-300 rounded-full" />
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

  // Portal로 body에 렌더링
  if (typeof window !== "undefined") {
    return createPortal(sheet, document.body);
  }
  return null;
}
