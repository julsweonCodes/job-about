import React, { useState, useEffect, useMemo } from "react";
import { Dialog } from "@/components/common/Dialog";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Skill } from "@/types/profile";
import { useCommonData } from "@/hooks/useCommonData";

const MAX_SELECTED = 5;

const RequiredSkillsDialog: React.FC<{
  maxSelected?: number;
  open: boolean;
  onClose: () => void;
  selectedSkills: Skill[];
  onConfirm: (skills: Skill[]) => void;
}> = ({ maxSelected = MAX_SELECTED, open, onClose, selectedSkills, onConfirm }) => {
  const [localSelected, setLocalSelected] = useState<Skill[]>(selectedSkills);
  const { skills } = useCommonData();

  useEffect(() => {
    setLocalSelected(selectedSkills);
  }, [selectedSkills, open]);

  const toggleSkill = (skill: Skill) => {
    if (localSelected.find((s) => s.id === skill.id)) {
      setLocalSelected(localSelected.filter((s) => s.id !== skill.id));
    } else if (localSelected.length < maxSelected) {
      setLocalSelected([...localSelected, skill]);
    }
  };

  // Group skills by category_en (or use category_ko if preferred)
  const groupedSkills = useMemo(() => {
    return skills.reduce<Record<string, Skill[]>>((acc, skill) => {
      const key = skill.category_en;
      if (!acc[key]) acc[key] = [];
      acc[key].push(skill);
      return acc;
    }, {});
  }, [skills]);

  return (
    <Dialog open={open} onClose={onClose} type="bottomSheet" size="xl">
      <div className="flex flex-col items-start w-full">
        <h2 className="mb-2 text-left text-[18px] sm:text-[24px] font-bold">
          Select Required Skills
        </h2>
        <p className="mb-2 text-left text-[14px] sm:text-[16px] text-gray-500">
          Select the skills required for this position.
        </p>

        <div className="w-full py-6 max-h-[50vh] overflow-y-auto">
          {Object.entries(groupedSkills).map(([category, items]) => (
            <div key={category} className="w-full mb-4">
              <h3 className="text-left font-bold mb-2">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => {
                  const selected = localSelected.find((s) => s.id === skill.id);
                  const disabled = !selected && localSelected.length >= maxSelected;
                  return (
                    <Chip
                      key={skill.id}
                      id={skill.id.toString()}
                      variant="outline"
                      selected={!!selected}
                      onClick={() => toggleSkill(skill)}
                      disabled={disabled}
                    >
                      {skill.name_en}
                    </Chip>
                  );
                })}
              </div>
            </div>
          ))}
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
