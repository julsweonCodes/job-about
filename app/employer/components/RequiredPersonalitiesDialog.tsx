import React, { useState, useEffect } from "react";
import { Dialog } from "@/components/common/Dialog";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { WorkStyle } from "@/types/profile";
import { useCommonData } from "@/hooks/useCommonData";

const MAX_SELECTED = 5;

const PreferredPersonalityDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  selectedTraits: WorkStyle[];
  onConfirm: (workStyle: WorkStyle[]) => void;
}> = ({ open, onClose, selectedTraits, onConfirm }) => {
  const [localSelected, setLocalSelected] = useState<WorkStyle[]>(selectedTraits);
  const { workStyles } = useCommonData();

  useEffect(() => {
    setLocalSelected(selectedTraits);
  }, [selectedTraits, open]);

  const toggleTrait = (workStyle: WorkStyle) => {
    /*if (localSelected.includes(trait)) {
      setLocalSelected(localSelected.filter((t) => t !== trait));
    } else if (localSelected.length < MAX_SELECTED) {
      setLocalSelected([...localSelected, trait]);
    }*/
    if (localSelected.find((ws) => ws.id === workStyle.id)) {
      setLocalSelected(localSelected.filter((ws) => ws.id !== workStyle.id));
    } else if (localSelected.length < MAX_SELECTED) {
      setLocalSelected([...localSelected, workStyle]);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} type="bottomSheet" size={"md"}>
      <div className="flex flex-col items-start w-full max-w-2xl">
        <h2 className="mb-2 text-left text-[18px] sm:text-[24px] font-bold">
          Select Preferred Personality
        </h2>
        <p className="mb-2 text-left text-[14px] sm:text-[16px] text-gray-500">
          Select the personality you want to work with.
        </p>

        <div className="flex flex-wrap gap-2 w-full py-6 max-h-64 overflow-y-auto pr-2">
          {workStyles.map((ws) => {
            // const selected = localSelected.includes(trait);
            const selected = localSelected.find((wss) => wss.id === ws.id);
            const disabled = !selected && localSelected.length >= MAX_SELECTED;
            return (
              <Chip
                key={ws.id}
                id={ws.id.toString()}
                variant="outline"
                selected={!!selected}
                onClick={() => toggleTrait(ws)}
                disabled={disabled}
              >
                {ws.name_en}
              </Chip>
            );
          })}
        </div>

        <div className="flex gap-3 w-full pt-4">
          <Button
            variant="default"
            size="lg"
            onClick={() => onConfirm(localSelected)}
            disabled={localSelected.length === 0}
          >
            Save
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default PreferredPersonalityDialog;
