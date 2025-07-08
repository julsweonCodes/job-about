import React, { useState, useRef, useEffect } from "react";
import { Clock } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { BottomSheet } from "@/components/common/BottomSheet";
import { Button } from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import Input from "@/components/ui/Input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/Select";

interface TimeRangePickerProps {
  startTime: string;
  endTime: string;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

// 시간 옵션 생성 (00:00~23:30, 30분 간격)
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    // 00:00, 00:30, 01:00, 01:30, ..., 23:00, 23:30
    const timeString1 = `${hour.toString().padStart(2, "0")}:00`;
    const timeString2 = `${hour.toString().padStart(2, "0")}:30`;
    options.push(timeString1);
    options.push(timeString2);
  }
  return options;
};

const timeOptions = generateTimeOptions();

// 시간 포맷팅 (00:00 → 00:00 AM, 13:30 → 13:30 PM)
const formatTimeForDisplay = (time: string) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const hourNum = Number(hours);
  const period = hourNum < 12 ? "AM" : "PM";
  return `${hours}:${minutes} ${period}`;
};

// 시간 범위 표시
const formatTimeRange = (start: string, end: string) => {
  if (!start && !end) return "";
  if (!start) return `${formatTimeForDisplay(end)}`;
  if (!end) return `${formatTimeForDisplay(start)}`;
  return `${formatTimeForDisplay(start)} - ${formatTimeForDisplay(end)}`;
};

// 스크롤 시간 선택 컴포넌트
function TimeScrollPicker({
  value,
  onValueChange,
  customItemClass,
}: {
  value: string;
  onValueChange: (time: string) => void;
  customItemClass?: (time: string) => string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && value) {
      const index = timeOptions.indexOf(value);
      if (index !== -1) {
        const itemHeight = 48; // 각 시간 옵션의 높이
        scrollRef.current.scrollTop = index * itemHeight;
      }
    }
  }, [value]);

  return (
    <div className="flex-1">
      <div
        ref={scrollRef}
        className="h-48 overflow-y-auto scrollbar-hide flex flex-col items-center"
        style={{
          scrollSnapType: "y mandatory",
        }}
      >
        <div className="py-24">
          {timeOptions.map((time) => {
            const isSelected = value === time;
            const itemClass = customItemClass
              ? customItemClass(time)
              : isSelected
                ? "text-text-primary font-bold text-xl"
                : "text-gray-400 text-xl";
            return (
              <div
                key={time}
                onClick={() => onValueChange(time)}
                className="h-12 flex items-center justify-center cursor-pointer transition-colors scroll-snap-align-center"
              >
                <Typography variant="bodyLg" className={itemClass}>
                  {formatTimeForDisplay(time)}
                </Typography>
              </div>
            );
          })}
        </div>
        <div className="py-24"></div>
      </div>
    </div>
  );
}

export default function TimeRangePicker({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  label,
  error,
  required,
  className = "",
}: TimeRangePickerProps) {
  const isMobile = useIsMobile();
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [tempStartTime, setTempStartTime] = useState(startTime);
  const [tempEndTime, setTempEndTime] = useState(endTime);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 데스크탑용 시간 선택 팝오버
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const startPickerRef = useRef<HTMLDivElement>(null);
  const endPickerRef = useRef<HTMLDivElement>(null);

  // 팝오버 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (startPickerRef.current && !startPickerRef.current.contains(event.target as Node)) {
        setShowStartPicker(false);
      }
      if (endPickerRef.current && !endPickerRef.current.contains(event.target as Node)) {
        setShowEndPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 모바일 BottomSheet에서 확인 버튼 클릭
  const handleMobileConfirm = () => {
    onStartTimeChange(tempStartTime);
    onEndTimeChange(tempEndTime);
    setIsBottomSheetOpen(false);
  };

  // 모바일 BottomSheet에서 취소 버튼 클릭
  const handleMobileCancel = () => {
    setTempStartTime(startTime);
    setTempEndTime(endTime);
    setIsBottomSheetOpen(false);
  };

  // 모바일 인풋 클릭
  const handleMobileInputClick = () => {
    setTempStartTime(startTime);
    setTempEndTime(endTime);
    setIsBottomSheetOpen(true);
  };

  // SSR 중에는 기본 UI 반환
  if (!isMounted) {
    return (
      <Input
        label={label}
        value=""
        placeholder="Select Time"
        readOnly
        rightIcon={<Clock className="w-5 h-5" />}
        error={error}
        required={required}
        className={className}
      />
    );
  }

  if (isMobile) {
    return (
      <div className={className}>
        <Input
          label={label}
          value={formatTimeRange(startTime, endTime)}
          placeholder="Select Time"
          readOnly
          rightIcon={<Clock className="w-5 h-5" />}
          error={error}
          required={required}
          onClick={handleMobileInputClick}
          className="cursor-pointer"
        />

        {/* 모바일 BottomSheet */}
        <BottomSheet open={isBottomSheetOpen} onClose={handleMobileCancel} size="lg">
          <div className="space-y-6">
            <Typography variant="titleBold" className="mb-6 text-left text-lg">
              근무 시간 선택
            </Typography>
            <div className="flex gap-4 items-center justify-center">
              <TimeScrollPicker
                value={tempStartTime}
                onValueChange={setTempStartTime}
                customItemClass={(time) =>
                  time === tempStartTime
                    ? "text-text-primary text-base font-semibold"
                    : "text-gray-400 text-base"
                }
              />
              <span className="mx-2 text-2xl font-bold text-text-primary">~</span>
              <TimeScrollPicker
                value={tempEndTime}
                onValueChange={setTempEndTime}
                customItemClass={(time) =>
                  time === tempEndTime
                    ? "text-text-primary text-base font-semibold"
                    : "text-gray-400 text-base"
                }
              />
            </div>

            <Button
              onClick={handleMobileConfirm}
              className="flex-1"
              disabled={!tempStartTime || !tempEndTime || tempStartTime >= tempEndTime}
            >
              확인
            </Button>
          </div>
        </BottomSheet>
      </div>
    );
  }

  // 데스크탑: 두 개의 인풋
  return (
    <div className={className}>
      {label && (
        <Typography as="label" variant="bodySm" className="block font-semibold text-gray-800 mb-3">
          {label} {required && <span className="text-red-500">*</span>}
        </Typography>
      )}
      <div className="grid grid-cols-2 gap-4">
        {/* 시작 시간 */}
        <Select value={startTime} onValueChange={onStartTimeChange}>
          <SelectTrigger>{startTime ? formatTimeForDisplay(startTime) : "시작 시간"}</SelectTrigger>
          <SelectContent>
            {timeOptions.map((time) => (
              <SelectItem key={time} value={time}>
                {formatTimeForDisplay(time)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* 종료 시간 */}
        <Select value={endTime} onValueChange={onEndTimeChange}>
          <SelectTrigger>{endTime ? formatTimeForDisplay(endTime) : "종료 시간"}</SelectTrigger>
          <SelectContent>
            {timeOptions.map((time) => (
              <SelectItem key={time} value={time}>
                {formatTimeForDisplay(time)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {error && (
        <Typography as="div" variant="bodyXs" className="text-red-500 mt-1">
          {error}
        </Typography>
      )}
    </div>
  );
}
