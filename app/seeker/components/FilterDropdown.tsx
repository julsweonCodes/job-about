import React from "react";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/Select";

interface FilterOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  options: string[];
}

interface FilterDropdownProps {
  filter: FilterOption;
  selectedValue: string;
  onSelect: (value: string) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ filter, selectedValue, onSelect }) => {
  return (
    <Select value={selectedValue} onValueChange={onSelect}>
      <SelectTrigger
        className={`min-w-[180px] focus:outline-none px-4 py-2.5 rounded-xl border text-sm ${selectedValue !== "All" ? "bg-purple-100 text-purple-700 border-purple-200" : "bg-white text-gray-600"}`}
        inputStyle={false}
      >
        <div className="flex items-center space-x-2">
          {filter.icon}
          <span className="font-medium">
            {selectedValue === "All" ? filter.label : selectedValue}
          </span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {filter.options.map((option) => (
          <SelectItem key={option} value={option} selectedValue={selectedValue}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FilterDropdown;
