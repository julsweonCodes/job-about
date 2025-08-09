import { ApplicantStatus, WorkType } from "@/constants/enums";

/**
 * Work Type enum 값을 색상 클래스로 변환
 */
export const getWorkTypeConfig = (workType: WorkType) => {
  switch (workType) {
    case WorkType.REMOTE:
      return {
        label: "Remote",
        className: "bg-green-100 text-green-800 hover:bg-green-100/80",
      };
    case WorkType.HYBRID:
      return {
        label: "Hybrid",
        className: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white ",
      };
    case WorkType.ON_SITE:
      return {
        label: "On-Site",
        className: "bg-blue-100 text-blue-800 hover:bg-blue-100/80",
      };
    default:
      return {
        label: "On-Site",
        className: "bg-blue-100 text-blue-800 hover:bg-blue-100/80",
      };
  }
};

export const getApplicationStatusConfig = (status?: string) => {
  if (!status) return null;

  switch (status) {
    case ApplicantStatus.APPLIED:
      return {
        text: "Applied",
        style: "bg-amber-100 text-amber-700 border-amber-200",
      };
    case ApplicantStatus.IN_REVIEW:
      return {
        text: "In Review",
        style: "bg-blue-100 text-blue-700 border-blue-200",
      };
    case ApplicantStatus.HIRED:
      return {
        text: "Hired",
        style: "bg-emerald-100 text-emerald-700 border-emerald-200",
      };
    case ApplicantStatus.REJECTED:
      return {
        text: "Rejected",
        style: "bg-red-100 text-red-700 border-red-200",
      };
    case ApplicantStatus.WITHDRAWN:
      return {
        text: "Withdrawn",
        style: "bg-black text-white border-gray-200",
      };
    default:
      return {
        text: "Applied",
        style: "bg-gray-100 text-gray-700 border-gray-200",
      };
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
