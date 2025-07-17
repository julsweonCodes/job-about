import React from "react";
import { DayPicker } from "react-day-picker";
import { enUS } from "date-fns/locale";
import { Dialog } from "@/components/common/Dialog";
import { Button } from "@/components/ui/Button";

interface DatePickerDialogProps {
  open: boolean;
  onClose: () => void;
  value: Date | null;
  onChange: (date: Date | null) => void;

  confirmLabel?: string;
  required?: boolean;
  locale?: any;
  minDate?: Date;
  maxDate?: Date;
}

const DatePickerDialog: React.FC<DatePickerDialogProps> = ({
  open,
  onClose,
  value,
  onChange,
  confirmLabel = "Select",
  required = false,
  locale = enUS,
}) => {
  const [tempDate, setTempDate] = React.useState<Date | null>(value);

  React.useEffect(() => {
    setTempDate(value);
  }, [value, open]);

  return (
    <Dialog className="px-0 pb-0" open={open} onClose={onClose} type="bottomSheet">
      <div className="p-4 md:p-6 flex flex-col gap-4 items-center">
        <DayPicker
          animate
          mode="single"
          required={required}
          selected={tempDate ?? undefined}
          onSelect={(date: any) => setTempDate(date ?? null)}
          locale={locale}
          navLayout="around"
          modifiersClassNames={{
            selected: "bg-indigo-500 text-white rounded-2xl",
            today: "font-bold rounded-2xl",
          }}
          className="w-[310px] max-w-full"
        />
        <Button
          type="button"
          className="w-full mt-4"
          onClick={() => {
            onChange(tempDate ?? null);
            onClose();
          }}
          disabled={required && !tempDate}
        >
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
};

export default DatePickerDialog;
