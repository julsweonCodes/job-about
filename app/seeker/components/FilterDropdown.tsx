import React from "react";
import { ChevronDown } from "lucide-react";
import { useFilterStore } from "@/stores/useFilterStore";

interface Filter {
  id: string;
  label: string;
  icon: React.ReactNode;
  options: string[];
}

interface FilterDropdownProps {
  filter: Filter;
  className?: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ filter, className = "" }) => {
  const { filters, setFilter } = useFilterStore();
  const [isOpen, setIsOpen] = React.useState(false);

  const selectedValue = filters[filter.id as keyof typeof filters] || "all";

  const handleSelect = (value: string) => {
    setFilter(filter.id as keyof typeof filters, value);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        {filter.icon}
        <span className="text-sm font-medium text-gray-700">
          {selectedValue === "all" ? filter.label : selectedValue}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          <div className="py-1">
            {filter.options.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${
                  selectedValue === option ? "bg-purple-50 text-purple-700" : "text-gray-700"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
