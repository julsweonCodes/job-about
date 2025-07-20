"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Dialog } from "@/components/common/Dialog";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import Input from "@/components/ui/Input";
import { X, Search } from "lucide-react";
import { getJobTypesByCategory, getJobTypeConfig } from "@/constants/jobTypes";
import { JobType } from "@/constants/enums";

// Job type categories
const JOB_CATEGORIES_DISPLAY = {
  Restaurant: "Restaurant",
  Retail: "Retail",
  Service: "Service",
  Technical: "Technical",
  Medical: "Medical",
  Trades: "Trades",
  Office: "Office",
  Other: "Other",
} as const;

interface JobTypesDialogProps {
  open: boolean;
  onClose: () => void;
  selectedJobTypes: JobType[];
  onConfirm: (jobTypes: JobType[]) => void;
  maxSelected?: number; // 최대 선택 가능한 개수 (기본값: 3)
}

const JobTypesDialog: React.FC<JobTypesDialogProps> = ({
  open,
  onClose,
  selectedJobTypes,
  onConfirm,
  maxSelected = 3, // 기본값 3
}) => {
  const [localSelected, setLocalSelected] = useState<JobType[]>(selectedJobTypes);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const jobTypesByCategory = getJobTypesByCategory();

  // 검색 결과 필터링
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    // 모든 JobType 설정을 가져오기
    const allJobTypes = Object.values(jobTypesByCategory).flat();

    const results = allJobTypes
      .filter(
        (config: any) =>
          config.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          config.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          config.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 10); // 최대 10개 결과만 표시

    return results;
  }, [searchQuery, jobTypesByCategory]);

  useEffect(() => {
    setLocalSelected(selectedJobTypes);
  }, [selectedJobTypes, open]);

  const toggleJobType = (jobType: JobType) => {
    if (localSelected.includes(jobType)) {
      setLocalSelected(localSelected.filter((t) => t !== jobType));
    } else if (localSelected.length < maxSelected) {
      setLocalSelected([...localSelected, jobType]);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setShowSearchResults(value.length > 0);
  };

  const handleSearchSelect = (jobType: JobType) => {
    toggleJobType(jobType);
  };

  const handleConfirm = () => {
    onConfirm(localSelected);
    onClose();
  };

  const removeSelected = (jobType: JobType) => {
    setLocalSelected(localSelected.filter((t) => t !== jobType));
  };

  return (
    <Dialog open={open} onClose={onClose} type="bottomSheet" size="xl" className="px-0">
      <div className="flex flex-col">
        {/* header */}
        <div className="px-5 md:px-8">
          <h2 className="mb-4 text-left text-[18px] sm:text-[24px] font-bold">Select Job Types</h2>

          {/* Search Bar */}
          <div className="border-b border-gray-100 pb-2 ">
            <div className="relative">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e: any) => handleSearchChange(e.target.value)}
                placeholder="Search job types e.g. server, delivery"
                required
                rightIcon={<Search className="w-5 h-5 text-gray-400" />}
              />
            </div>
          </div>
        </div>

        {/* Search Results */}
        {showSearchResults && (
          <div className="py-2 border-gray-100 max-h-[50vh] overflow-y-auto px-5 md:px-8">
            {searchResults.length > 0 ? (
              searchResults.map((config) => {
                const Icon = config.icon;
                const isSelected = localSelected.includes(config.id);
                const disabled = !isSelected && localSelected.length >= maxSelected;

                return (
                  <button
                    key={config.id}
                    onClick={() => handleSearchSelect(config.id)}
                    disabled={disabled}
                    className={`w-full text-left p-5 rounded-lg mb-2 transition-colors ${
                      isSelected
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : disabled
                          ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span className="flex-1">{config.name}</span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No search results for "{searchQuery}".</p>
                <p className="text-gray-400 text-xs mt-1">Try searching with different keywords.</p>
              </div>
            )}
          </div>
        )}

        {/* Job Types by Category - Only show when not searching */}
        {!showSearchResults && (
          <div className="max-h-[40vh] overflow-y-auto py-4 px-5 md:px-8">
            {Object.entries(jobTypesByCategory).map(([category, jobTypes]) => (
              <div key={category} className="mb-6">
                <h3 className="text-sm md:text-xl font-semibold text-gray-700 mb-3 capitalize">
                  {JOB_CATEGORIES_DISPLAY[category as keyof typeof JOB_CATEGORIES_DISPLAY] ||
                    category}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {jobTypes.map((config) => {
                    const isSelected = localSelected.includes(config.id);
                    const disabled = !isSelected && localSelected.length >= maxSelected;

                    return (
                      <Chip
                        key={config.id}
                        selected={isSelected}
                        onClick={() => toggleJobType(config.id)}
                        disabled={disabled}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="truncate">{config.name}</span>
                      </Chip>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Items */}
        {localSelected.length > 0 && (
          <div className="pt-3 md:pt-5 border-t border-gray-200 px-5 md:px-8">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {localSelected.map((jobType) => {
                const config = getJobTypeConfig(jobType);
                return (
                  <Chip key={jobType} selected={true} onClick={() => removeSelected(jobType)}>
                    <span className="truncate">{config.name}</span>
                    <X className="w-3 h-3 ml-1" />
                  </Chip>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="px-5 pt-5 md:px-8">
          <Button
            variant="default"
            onClick={handleConfirm}
            disabled={localSelected.length === 0}
            size="lg"
          >
            {localSelected.length > 0 ? `Apply ${localSelected.length} Job Types` : "Apply"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default JobTypesDialog;
