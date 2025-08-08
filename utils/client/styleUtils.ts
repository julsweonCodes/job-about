import { WorkType } from "@/constants/enums";

/**
 * Work Type enum 값을 색상 클래스로 변환
 */
export const getWorkTypeColor = (value: string): string => {
  switch (value) {
    case WorkType.ON_SITE:
      return "bg-green-100 text-green-700";
    case WorkType.HYBRID:
      return "bg-blue-100 text-blue-700";
    case WorkType.REMOTE:
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

/**
 * Job Type enum 값을 색상 클래스로 변환
 */
export const getJobTypeColor = (value: string): string => {
  switch (value) {
    case "FULL_TIME":
      return "bg-blue-100 text-blue-700";
    case "PART_TIME":
      return "bg-orange-100 text-orange-700";
    case "CONTRACT":
      return "bg-purple-100 text-purple-700";
    case "INTERNSHIP":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

/**
 * 상태별 색상 클래스 반환
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case "PUBLISHED":
      return "bg-green-100 text-green-700";
    case "DRAFT":
      return "bg-gray-100 text-gray-700";
    case "CLOSED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

/**
 * 우선순위별 색상 클래스 반환
 */
export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case "HIGH":
      return "bg-red-100 text-red-700";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-700";
    case "LOW":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};
