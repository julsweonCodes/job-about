import * as React from "react";
import { Dialog } from "@/components/common/Dialog";

interface BaseDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  type?: "alert" | "bottomSheet";
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const BaseDialog: React.FC<BaseDialogProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  type = "alert",
  className,
  size = "md",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      type={type}
      className={className}
      size={size}
      showCloseButton
    >
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <div>{children}</div>
        {actions && <div className="flex justify-between gap-2">{actions}</div>}
      </div>
    </Dialog>
  );
};

export default BaseDialog;
