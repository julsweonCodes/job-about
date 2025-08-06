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

  // 디버깅용 로그
  console.log("FilterDropdown received filter:", filter);
  console.log("Filter options:", filter.options);

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
        <div className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="w-4 h-4 md:w-5 md:h-5 bg-gray-200 rounded animate-pulse" />
          <span className="text-sm font-medium text-gray-600">{filter.label}</span>
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
        className="flex items-center gap-3 px-3 py-3 sm:px-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200"
      >
        {filter.iconType === "workType" ? (
          <Briefcase className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
        ) : (
          <MapPin className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
        )}
        <span className="text-sm font-medium text-gray-700">
          {selectedValue === "all" ? filter.label : getDisplayValue(selectedValue)}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
          <div className="py-2">
            {filter.options.map((option) => (
              <button
                key={option.key}
                onClick={() => handleSelect(option.key)}
                className={`w-full px-4 py-3 text-left text-sm transition-all duration-150 ${
                  selectedValue === option.key
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
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
