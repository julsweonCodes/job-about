"use client";

import { JobPost as ApiJobPost, JobPostCard as JobPostCardType } from "@/types/job";
import { WorkType } from "@/constants/enums";
import { STORAGE_URLS } from "@/constants/storage";

// 상수 분리
const DEFAULT_VALUES = {
  LOCATION: "Location not specified",
  BUSINESS_NAME: "Company",
  VIEWS: 0,
} as const;

/**
 * API JobPost를 JobPostCard로 변환하는 공통 함수
 */
export const convertToJobPostCard = (apiJob: ApiJobPost): JobPostCardType => {
  // business_loc에는 logo_url만 있으므로 기본값 사용
  const location = DEFAULT_VALUES.LOCATION;

  return {
    id: apiJob.id,
    title: apiJob.title,
    workType: apiJob.work_type as WorkType,
    wage: apiJob.wage,
    location: location,
    workSchedule: apiJob.work_schedule,
    businessName: apiJob.business_loc?.name || DEFAULT_VALUES.BUSINESS_NAME,
    description: apiJob.description,
    applicants: apiJob.applicantCount || 0,
    views: DEFAULT_VALUES.VIEWS,
    logoImage: apiJob.business_loc?.logo_url
      ? `${STORAGE_URLS.BIZ_LOC.PHOTO}${apiJob.business_loc.logo_url}`
      : undefined,
  };
};
