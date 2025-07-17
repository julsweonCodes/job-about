import React, { useState, useEffect } from "react";
import { Dialog } from "@/components/common/Dialog";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";

const MAX_SELECTED = 3;

const SKILLS = [
  "Customer Service",
  "Communication",
  "Problem Solving",
  "Teamwork",
  "Leadership",
  "Time Management",
  "Organization",
  "Adaptability",
  "Creativity",
  "Critical Thinking",
  "Technical Skills",
  "Sales",
  "Marketing",
  "Data Analysis",
  "Project Management",
  "Research",
  "Writing",
  "Presentation",
  "Negotiation",
  "Conflict Resolution",
  "Decision Making",
  "Strategic Planning",
  "Quality Assurance",
  "Training",
  "Mentoring",
];

const RequiredSkillsDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  selectedSkills: string[];
  onConfirm: (skills: string[]) => void;
}> = ({ open, onClose, selectedSkills, onConfirm }) => {
  const [localSelected, setLocalSelected] = useState<string[]>(selectedSkills);

  useEffect(() => {
    setLocalSelected(selectedSkills);
  }, [selectedSkills, open]);

  const toggleSkill = (skill: string) => {
    if (localSelected.includes(skill)) {
      setLocalSelected(localSelected.filter((s) => s !== skill));
    } else if (localSelected.length < MAX_SELECTED) {
      setLocalSelected([...localSelected, skill]);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} type="bottomSheet" size="lg">
      <div className="flex flex-col items-start w-full">
        <h2 className="mb-2 text-left text-[18px] sm:text-[24px] font-bold">
          Select Required Skills
        </h2>
        <p className="mb-2 text-left text-[14px] sm:text-[16px] text-gray-500">
          Select the skills required for this position.
        </p>

        <div className="flex flex-wrap gap-2 w-full py-6 max-h-[50vh] overflow-y-auto">
          {SKILLS.map((skill) => {
            const selected = localSelected.includes(skill);
            const disabled = !selected && localSelected.length >= MAX_SELECTED;
            return (
              <Chip
                key={skill}
                id={skill}
                variant="outline"
                selected={selected}
                onClick={() => toggleSkill(skill)}
                disabled={disabled}
              >
                {skill}
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

export default RequiredSkillsDialog;
