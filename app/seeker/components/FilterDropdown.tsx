import React from "react";
import { Briefcase, ChevronDown, MapPin } from "lucide-react";
import { useFilterStore } from "@/stores/useFilterStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

interface FilterOption {
  key: string;
  label: string;
}

interface Filter {
  id: string;
  label: string;
  iconType: "workType" | "location";
  options: FilterOption[];
}

interface FilterDropdownProps {
  filter: Filter;
  className?: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ filter, className = "" }) => {
  const { filters, setFilter } = useFilterStore();
  const [isMounted, setIsMounted] = React.useState(false);

  // 표시 값을 가져오는 함수
  const getDisplayValue = (value: string) => {
    const option = filter.options.find((opt) => opt.key === value);
    return option ? option.label : value;
  };

  // 클라이언트 사이드에서만 마운트
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleValueChange = (value: string) => {
    setFilter(filter.id as keyof typeof filters, value);
  };

  // 서버에서는 아무것도 렌더링하지 않음
  if (!isMounted) {
    return (
      <div className={`relative ${className}`}>
        <div className="flex items-center text-gray-600 gap-3 px-3 py-2 sm:px-5 sm:py-3 bg-white border border-gray-200 rounded-xl shadow-sm">
          <span className="text-xs sm:text-base  text-gray-600">{filter.label}</span>
          <ChevronDown className="ml-2 w-5 h-5" />
        </div>
      </div>
    );
  }

  const selectedValue = filters[filter.id as keyof typeof filters] || "all";

  return (
    <div className={`relative ${className}`}>
      <Select value={selectedValue} onValueChange={handleValueChange}>
        <SelectTrigger
          className="flex items-center text-gray-600 gap-3 px-3 py-2 sm:px-5 sm:py-3 text-xs sm:text-base  bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-0 focus:border-gray-200 data-[state=open]:border-gray-200 data-[state=closed]:border-gray-200"
          inputStyle={false}
        >
          <SelectValue className="font-medium text-gray-600">
            {selectedValue === "all" ? filter.label : getDisplayValue(selectedValue)}
          </SelectValue>
        </SelectTrigger>

        <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg">
          {filter.options.map((option) => (
            <SelectItem
              key={option.key}
              value={option.key}
              selectedValue={selectedValue}
              className={`text-sm sm:text-base transition-all duration-150 ${
                selectedValue === option.key
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterDropdown;
