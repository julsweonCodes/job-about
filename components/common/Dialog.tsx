import * as React from "react";
import { Modal } from "./Modal";
import { BottomSheet } from "./BottomSheet";
import { useIsMobile } from "@/hooks/useIsMobile";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  type?: "alert" | "bottomSheet";
  children: React.ReactNode;
}

export function Dialog({ open, onClose, type = "alert", children }: DialogProps) {
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
      <Modal open={open} onClose={onClose}>
        {children}
      </Modal>
    );
  }

  // 모바일: type에 따라 분기
  if (type === "bottomSheet") {
    return (
      <BottomSheet open={open} onClose={onClose}>
        {children}
      </BottomSheet>
    );
  }
  // 모바일 + alert
  return (
    <Modal open={open} onClose={onClose}>
      {children}
    </Modal>
  );
}
