import * as React from "react";
import { Modal } from "./Modal";
import { BottomSheet } from "./BottomSheet";
import { useIsMobile } from "@/hooks/useIsMobile";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  type?: "alert" | "bottomSheet";
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ open, onClose, type = "alert", children, className }: DialogProps) {
  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  if (!isMobile) {
    // 데스크탑: 무조건 Modal
    return (
      <Modal open={open} onClose={onClose} className={className}>
        {children}
      </Modal>
    );
  }

  // 모바일: type에 따라 분기
  if (type === "bottomSheet") {
    return (
      <BottomSheet open={open} onClose={onClose} className={className}>
        {children}
      </BottomSheet>
    );
  }
  // 모바일 + alert
  return (
    <Modal open={open} onClose={onClose} className={className}>
      {children}
    </Modal>
  );
}
