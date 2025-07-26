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
  size?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
}

export function Dialog({
  open,
  onClose,
  type = "alert",
  children,
  className,
  size = "md",
  showCloseButton = false,
}: DialogProps) {
  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      // 다이얼로그가 닫힐 때 다른 다이얼로그가 열려있는지 확인
      setTimeout(() => {
        const hasOpenDialogs = document.querySelectorAll('[data-dialog-open="true"]').length > 0;
        if (!hasOpenDialogs) {
          document.body.style.overflow = "";
        }
      }, 0);
    }
    return () => {
      // cleanup 시에도 다른 다이얼로그가 열려있는지 확인
      setTimeout(() => {
        const hasOpenDialogs = document.querySelectorAll('[data-dialog-open="true"]').length > 0;
        if (!hasOpenDialogs) {
          document.body.style.overflow = "";
        }
      }, 0);
    };
  }, [open]);

  if (!open) return null;

  if (!isMobile) {
    // 데스크탑: 무조건 Modal
    return (
      <Modal
        open={open}
        onClose={onClose}
        className={className}
        size={size}
        showCloseButton={showCloseButton}
        data-dialog-open={open}
      >
        {children}
      </Modal>
    );
  }

  // 모바일: type에 따라 분기
  if (type === "bottomSheet") {
    return (
      <BottomSheet open={open} onClose={onClose} className={className} data-dialog-open={open}>
        {children}
      </BottomSheet>
    );
  }
  // 모바일 + alert
  return (
    <Modal
      open={open}
      onClose={onClose}
      className={className}
      size={size}
      showCloseButton={showCloseButton}
      data-dialog-open={open}
    >
      {children}
    </Modal>
  );
}
