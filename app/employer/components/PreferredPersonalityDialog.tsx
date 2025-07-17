import React, { useState, useEffect } from "react";
import { Dialog } from "@/components/common/Dialog";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";

const MAX_SELECTED = 3;

const TRAITS = [
  "Collaborative",
  "Detail-Oriented",
  "Fast-Paced",
  "Independent",
  "Team Player",
  "Adaptable",
  "Creative",
  "Curious",
  "Dedicated",
  "Flexible",
  "Organized",
  "Problem-Solver",
  "Quick-Learner",
  "Resilient",
  "Self-Motivated",
  "Team-Oriented",
];

const PreferredPersonalityDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  selectedTraits: string[];
  onConfirm: (traits: string[]) => void;
}> = ({ open, onClose, selectedTraits, onConfirm }) => {
  const [localSelected, setLocalSelected] = useState<string[]>(selectedTraits);

  useEffect(() => {
    setLocalSelected(selectedTraits);
  }, [selectedTraits, open]);

  const toggleTrait = (trait: string) => {
    if (localSelected.includes(trait)) {
      setLocalSelected(localSelected.filter((t) => t !== trait));
    } else if (localSelected.length < MAX_SELECTED) {
      setLocalSelected([...localSelected, trait]);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} type="bottomSheet">
      <div className="flex flex-col items-start w-full max-w-md">
        <h2 className="mb-2 text-left text-[18px] sm:text-[24px] font-bold">
          Select Preferred Personality
        </h2>
        <p className="mb-2 text-left text-[14px] sm:text-[16px] text-gray-500">
          Select the personality you want to work with.
        </p>

        <div className="flex flex-wrap gap-2 w-full py-6">
          {TRAITS.map((trait) => {
            const selected = localSelected.includes(trait);
            const disabled = !selected && localSelected.length >= MAX_SELECTED;
            return (
              <Chip
                key={trait}
                id={trait}
                variant="outline"
                selected={selected}
                onClick={() => toggleTrait(trait)}
                disabled={disabled}
              >
                {trait}
              </Chip>
            );
          })}
        </div>

        <div className="flex gap-3 w-full">
          <Button
            variant="default"
            size="lg"
            onClick={() => onConfirm(localSelected)}
            disabled={!selectedTraits}
          >
            Save
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default PreferredPersonalityDialog;
