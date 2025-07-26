export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateYYYYMMDD(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}

export function formatYYYYMMDDtoMonthDayYear(dateStr: string): string {
  if (!/^\d{8}$/.test(dateStr)) {
    throw new Error("Invalid date string format. Expected 'YYYYMMDD'.");
  }

  const year = dateStr.slice(0, 4);
  const month = parseInt(dateStr.slice(4, 6), 10) - 1; // Month is 0-indexed
  const day = parseInt(dateStr.slice(6, 8), 10);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const monthName = monthNames[month];

  return `${monthName} ${day}, ${year}`;
}

export const parseBigInt = (obj: any) =>
  JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

export function capitalize(text: string) {
  return text
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}