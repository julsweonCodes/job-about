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
    >
      <div
        className={cn(
          "bg-white rounded-2xl shadow-xl p-8 w-full relative transition-all duration-300 transform scale-100 animate-modalIn",
          size === "sm" && "max-w-sm",
          size === "md" && "max-w-md",
          size === "lg" && "max-w-lg",
          size === "xl" && "max-w-2xl",
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
