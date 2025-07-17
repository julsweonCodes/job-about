"use client";

import { getJobTypeConfigFromServer, getJobTypeConfig } from "@/constants/jobTypes";
import { JobType } from "@/constants/enums";

// 서버에서 받은 JobType enum 값으로부터 UI에 필요한 정보를 가져오는 함수들

/**
 * 서버에서 받은 JobType enum 값으로부터 표시 이름을 가져옴
 */
export const getJobTypeName = (serverJobType: string): string => {
  const config = getJobTypeConfigFromServer(serverJobType);
  return config?.name || serverJobType;
};

/**
 * 서버에서 받은 JobType enum 값으로부터 아이콘을 가져옴
 */
export const getJobTypeIcon = (serverJobType: string) => {
  const config = getJobTypeConfigFromServer(serverJobType);
  return config?.icon || null;
};

/**
 * 서버에서 받은 JobType enum 값으로부터 카테고리를 가져옴
 */
export const getJobTypeCategory = (serverJobType: string): string => {
  const config = getJobTypeConfigFromServer(serverJobType);
  return config?.category || "Other";
};

/**
 * 서버에서 받은 JobType enum 값이 유효한지 확인
 */
export const isValidJobType = (serverJobType: string): boolean => {
  return getJobTypeConfigFromServer(serverJobType) !== null;
};

/**
 * 서버에서 받은 JobType enum 값들을 클라이언트 설정으로 변환
 */
export const convertServerJobTypes = (serverJobTypes: string[]) => {
  return serverJobTypes
    .map((serverJobType) => getJobTypeConfigFromServer(serverJobType))
    .filter((config) => config !== null);
};

/**
 * 서버에서 받은 JobType enum 값으로부터 완전한 설정을 가져오는 함수
 */
export const getJobTypeConfigFromServerData = (serverJobType: string) => {
  return getJobTypeConfigFromServer(serverJobType);
};

// 사용 예시:
// const jobPost = {
//   id: "123",
//   jobType: "server", // 서버에서 받은 enum 값
//   title: "Server Position",
//   // ... 기타 데이터
// };
//
// const jobTypeName = getJobTypeName(jobPost.jobType); // "Server"
// const jobTypeIcon = getJobTypeIcon(jobPost.jobType); // Server 아이콘 컴포넌트
// const jobTypeCategory = getJobTypeCategory(jobPost.jobType); // "Restaurant"
