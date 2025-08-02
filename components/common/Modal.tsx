import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
}

export function Modal({
  open,
  onClose,
  children,
  className,
  size = "md",
  showCloseButton = false,
}: ModalProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity duration-300 opacity-100 animate-fadeIn"
      onClick={onClose}
      data-dialog-open={open}
    >
      <div
        className={cn(
          "bg-white rounded-2xl shadow-xl p-8 w-full relative transition-all duration-300 transform scale-100 animate-modalIn",
          size === "sm" && "mx-8 sm:mx-5 md:mx-10 lg:mx-20 xl:mx-30 max-w-sm",
          size === "md" && "mx-8 sm:mx-6 md:mx-12 lg:mx-24 xl:mx-30 max-w-md",
          size === "lg" && "mx-8 sm:mx-4 md:mx-8 lg:mx-16 xl:mx-20 max-w-lg",
          size === "xl" && "mx-8 sm:mx-2 md:mx-4 lg:mx-8 xl:mx-10 max-w-2xl",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-[10px] right-[10px] md:top-4 md:right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
            style={{ lineHeight: 0 }}
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
        {children}
      </div>
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s;
        }
        .animate-modalIn {
          animation: modalIn 0.3s;
        }
      `}</style>
    </div>
  );
}
