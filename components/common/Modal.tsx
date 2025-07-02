import * as React from "react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity duration-300 opacity-100 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={cn(
          "bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative transition-all duration-300 transform scale-100 animate-modalIn"
        )}
        onClick={(e) => e.stopPropagation()}
      >
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
