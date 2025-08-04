import React from "react";
import { ChevronDown, Briefcase, MapPin } from "lucide-react";
import { useFilterStore } from "@/stores/useFilterStore";

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
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // 표시 값을 가져오는 함수
  const getDisplayValue = (value: string) => {
    const option = filter.options.find((opt) => opt.key === value);
    return option ? option.label : value;
  };

  // 클라이언트 사이드에서만 마운트
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSelect = (value: string) => {
    setFilter(filter.id as keyof typeof filters, value);
    setIsOpen(false);
  };

  // 외부 클릭 감지
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // 서버에서는 아무것도 렌더링하지 않음
  if (!isMounted) {
    return (
      <div className={`relative ${className}`}>
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg">
          <div className="w-4 h-4 md:w-5 md:h-5 bg-gray-200 rounded animate-pulse" />
          <span className="text-sm font-medium text-gray-700">{filter.label}</span>
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  const selectedValue = filters[filter.id as keyof typeof filters] || "all";

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        {filter.iconType === "workType" ? (
          <Briefcase className="w-4 h-4 md:w-5 md:h-5" />
        ) : (
          <MapPin className="w-4 h-4 md:w-5 md:h-5" />
        )}
        <span className="text-sm font-medium text-gray-700">
          {selectedValue === "all" ? filter.label : getDisplayValue(selectedValue)}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          <div className="py-1">
            {filter.options.map((option) => (
              <button
                key={option.key}
                onClick={() => handleSelect(option.key)}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${
                  selectedValue === option.key ? "bg-purple-50 text-purple-700" : "text-gray-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
