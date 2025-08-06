import React from "react";
import { useFilterStore } from "@/stores/useFilterStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { BottomSheet } from "@/components/common/BottomSheet";
import JobTypesDialog from "@/components/common/JobTypesDialog";
import { Button } from "@/components/ui/Button";
import { useIsMobile } from "@/hooks/useIsMobile";
import { getJobTypeName } from "@/utils/client/enumDisplayUtils";
import { ChevronDown } from "lucide-react";

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

// Dropdown Button Component
const DropdownButton: React.FC<{
  label: string;
  selectedValue: string;
  onClick: () => void;
  className?: string;
}> = ({ label, selectedValue, onClick, className = "" }) => {
  return (
    <div className={`relative ${className} flex-shrink-0`}>
      <button
        onClick={onClick}
        className="flex items-center text-gray-600 gap-3 px-3 py-2 sm:px-5 sm:py-3 text-xs sm:text-base bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-0 focus:border-gray-200"
      >
        <span className="font-medium text-gray-600">
          {selectedValue === "all" ? label : selectedValue}
        </span>
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>
    </div>
  );
};

const FilterDropdown: React.FC<FilterDropdownProps> = ({ filter, className = "" }) => {
  const { filters, setFilter } = useFilterStore();
  const [isMounted, setIsMounted] = React.useState(false);
  const [showMobileDialog, setShowMobileDialog] = React.useState(false);
  const [tempSelectedValue, setTempSelectedValue] = React.useState<string>("");
  const isMobile = useIsMobile();

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
    setShowMobileDialog(false);
  };

  const handleMobileDialogOpen = () => {
    setTempSelectedValue(selectedValue);
    setShowMobileDialog(true);
  };

  const handleMobileApply = () => {
    setFilter(filter.id as keyof typeof filters, tempSelectedValue);
    setShowMobileDialog(false);
  };

  // 서버에서는 아무것도 렌더링하지 않음
  if (!isMounted) {
    return (
      <div className={`relative ${className} flex-shrink-0`}>
        <div className="sm:w-32 sm:h-12 w-24 h-8 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  const selectedValue = filters[filter.id as keyof typeof filters] || "all";

  // Job Type인 경우 모바일/데스크탑 모두 JobTypesDialog 사용
  if (filter.id === "jobType") {
    return (
      <>
        <DropdownButton
          label={filter.label}
          selectedValue={selectedValue === "all" ? "all" : getJobTypeName(selectedValue)}
          onClick={() => setShowMobileDialog(true)}
          className={className}
        />

        <JobTypesDialog
          title="Select Job Type"
          open={showMobileDialog}
          onClose={() => setShowMobileDialog(false)}
          selectedJobTypes={selectedValue === "all" ? [] : [selectedValue as any]}
          onConfirm={(jobTypes) => {
            if (jobTypes.length > 0) {
              handleValueChange(jobTypes[0]);
            } else {
              handleValueChange("all");
            }
          }}
          maxSelected={1}
          allowEmptySelection={true}
        />
      </>
    );
  }

  // 모바일에서 Work Type인 경우 BottomSheet 사용 (LanguageLevelSelector 스타일)
  if (isMobile && filter.id === "workType") {
    return (
      <>
        <DropdownButton
          label={filter.label}
          selectedValue={selectedValue === "all" ? "all" : getDisplayValue(selectedValue)}
          onClick={handleMobileDialogOpen}
          className={className}
        />

        <BottomSheet open={showMobileDialog} onClose={() => setShowMobileDialog(false)} size="md">
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-gray-900">{filter.label}</h3>
            <div className="grid grid-cols-1 gap-3">
              {filter.options.map((option) => {
                const isSelected = tempSelectedValue === option.key;
                return (
                  <button
                    key={option.key}
                    onClick={() => setTempSelectedValue(option.key)}
                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                      isSelected
                        ? "border-purple-500 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-md"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-medium text-base ${
                          isSelected ? "text-purple-700" : "text-gray-700"
                        }`}
                      >
                        {option.label}
                      </span>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="pt-5">
              <Button variant="default" size="lg" onClick={handleMobileApply}>
                Apply
              </Button>
            </div>
          </div>
        </BottomSheet>
      </>
    );
  }

  // 모바일에서 Location인 경우 BottomSheet 사용 (LanguageLevelSelector 스타일)
  if (isMobile && filter.id === "location") {
    return (
      <>
        <DropdownButton
          label={filter.label}
          selectedValue={selectedValue === "all" ? "all" : getDisplayValue(selectedValue)}
          onClick={handleMobileDialogOpen}
          className={className}
        />

        <BottomSheet open={showMobileDialog} onClose={() => setShowMobileDialog(false)} size="lg">
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-gray-900">{filter.label}</h3>
            <div className="max-h-[50vh] overflow-y-auto">
              <div className="grid grid-cols-1 gap-3">
                {filter.options.map((option) => {
                  const isSelected = tempSelectedValue === option.key;
                  return (
                    <button
                      key={option.key}
                      onClick={() => setTempSelectedValue(option.key)}
                      className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                        isSelected
                          ? "border-purple-500 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-medium text-base ${
                            isSelected ? "text-purple-700" : "text-gray-700"
                          }`}
                        >
                          {option.label}
                        </span>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="pt-5">
              <Button variant="default" size="lg" onClick={handleMobileApply}>
                Apply
              </Button>
            </div>
          </div>
        </BottomSheet>
      </>
    );
  }

  // 데스크탑에서는 기존 Select 사용
  return (
    <div className={`relative ${className} flex-shrink-0`}>
      <Select value={selectedValue} onValueChange={handleValueChange}>
        <SelectTrigger
          className="flex items-center text-gray-600 gap-3 px-3 py-2 sm:px-5 sm:py-3 text-xs sm:text-base  bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-0 focus:border-gray-200 data-[state=open]:border-gray-200 data-[state=closed]:border-gray-200 min-w-[180px]"
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
