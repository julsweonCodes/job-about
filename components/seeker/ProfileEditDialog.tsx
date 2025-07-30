import React from "react";
import BaseDialog from "@/components/common/BaseDialog";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface ProfileEditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  data: {
    name: string;
    phone_number: string;
  };
  onChange: (field: "name" | "phone_number", value: string) => void;
}

export const ProfileEditDialog: React.FC<ProfileEditDialogProps> = ({
  open,
  onClose,
  onSave,
  data,
  onChange,
}) => {
  return (
    <BaseDialog open={open} onClose={onClose} title="Edit Profile" size="md" type="bottomSheet">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
          <Input
            value={data.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Enter your name"
            className="w-full"
          />
        </div>
        <div>
          <Input
            label="Phone Number"
            value={data.phone_number}
            onChange={(e) => onChange("phone_number", e.target.value)}
            placeholder="Enter your phone number"
            type="phone"
            className="w-full"
          />
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <Button variant="secondary" size="lg" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button onClick={onSave} className="flex-1" variant="gradient" size="lg">
          Save
        </Button>
      </div>
    </BaseDialog>
  );
};
