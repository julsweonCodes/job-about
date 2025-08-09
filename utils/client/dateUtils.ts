/**
 * D-day 계산 함수
 * @param deadlineDate - 마감일 (YYYY-MM-DD 형식의 문자열)
 * @returns 마감일까지 남은 일수 (음수면 이미 마감)
 */
export const calculateDDay = (deadlineDate: string): number => {
  const deadline = new Date(deadlineDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);

  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

/**
 * D-day 텍스트와 스타일을 반환하는 함수
 * @param deadlineDate - 마감일
 * @returns { text: string, className: string }
 */
export const getDDayConfig = (deadlineDate: string) => {
  const dDay = calculateDDay(deadlineDate);

  if (dDay < 0) {
    return {
      text: "Overdue",
      className: "bg-red-100 text-red-900 border border-red-200 hover:bg-red-100/80",
    };
  } else if (dDay === 0) {
    return {
      text: "D-day",
      className: "bg-red-100 text-red-900 border border-red-200 hover:bg-red-100/80",
    };
  } else if (dDay <= 3) {
    return {
      text: `D-${dDay}`,
      className: "bg-amber-100 text-amber-900 border border-amber-200 hover:bg-amber-100/80",
    };
  } else {
    return {
      text: `D-${dDay}`,
      className: "bg-slate-100 text-slate-900 border border-slate-200 hover:bg-slate-100/80",
    };
  }
};

/**
 * 날짜가 오늘인지 확인
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * 날짜가 내일인지 확인
 */
export const isTomorrow = (date: Date): boolean => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  );
};

/**
 * 날짜가 이번 주인지 확인
 */
export const isThisWeek = (date: Date): boolean => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return date >= startOfWeek && date <= endOfWeek;
};
