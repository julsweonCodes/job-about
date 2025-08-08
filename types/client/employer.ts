import { JobStatus, WorkType } from "@/constants/enums";
import { JobType } from "@/constants/jobTypes";
import { Location } from "@/constants/location";
import { Dashboard } from "@/types/server/employer";
import { fromPrismaJobStatus, fromPrismaJobType, fromPrismaWorkType } from "../enumMapper";

/**
 * 비즈니스 위치 정보 (Employer Profile)
 */
export interface BizLocInfo {
  bizLocId: string;
  name: string;
  bizDescription: string;
  logoImg: string;
  extraPhotos: string[];
  location: Location;
  workingHours: string;
  address?: string;
  startTime?: string;
  endTime?: string;
  created_at?: string;
  phone?: string;
}

/**
 * 이미지 아이템 타입 (드래그 앤 드롭용)
 */
export interface ImageItem {
  image: string;
  originalIndex: number;
  type: "original" | "extra";
}

/**
 * 편집 모드 상태
 */
export interface EditingState {
  businessInfo: boolean;
  address: boolean;
  hours: boolean;
  contact: boolean;
  location: boolean;
  workplaceAttributes: boolean;
}

/**
 * 드래그 앤 드롭 상태
 */
export interface DragDropState {
  draggedIndex: number | null;
  dragOverIndex: number | null;
  isOrderChanged: boolean;
}

/**
 * 이미지 관리 상태
 */
export interface ImageManagementState {
  originalImages: string[];
  extraPhotos: string[];
  deletedImageIndexes: Set<number>;
  isWorkplacePhotoChanged: boolean;
}

/**
 * 다이얼로그 상태
 */
export interface DialogState {
  showImageUploadDialog: boolean;
  showProfileDialog: boolean;
}

export interface ClientJobPost {
  id: string;
  title: string;
  type: WorkType;
  wage: string;
  location: string;
  businessName: string;
  description: string;
  applicants: number;
  views: number;
  needsUpdate: boolean;
  coverImage: string;
  strt_date: string;
  deadline_date: string;
  status: JobStatus;
  jobType: JobType;
}

export interface UrgentClientJobPost extends ClientJobPost {
  pendingReviewCnt: number;
  totalApplicationsCnt: number;
}

// ============================================================================
// API RESPONSE TYPES - API 응답 타입들
// ============================================================================

/**
 * 서버 Job Post API 응답 타입
 */
export interface ApiJobPost {
  id: string;
  title: string;
  type: string;
  jobType: string;
  wage: string;
  location: string;
  businessName: string;
  description: string;
  applicants: number;
  views: number;
  needsUpdate: boolean;
  coverImage: string;
  strt_date: string;
  deadline_date: string;
  status: string;
}

/**
 * 서버 Urgent Job Post API 응답 타입
 */
export interface ApiUrgentJobPost extends ApiJobPost {
  pendingReviewCnt: number;
  totalApplicationsCnt: number;
}

/**
 * 서버 Dashboard API 응답 타입
 */
export interface ApiDashboard {
  activeJobPostsCnt: number;
  allAppsCnt: number;
  needsUpdateCnt: number;
}

// ============================================================================
// MAPPER CLASSES - 매퍼 클래스들
// ============================================================================

/**
 * Employer 데이터 변환을 담당하는 메인 매퍼
 */
export class EmployerMapper {
  /**
   * 서버 Job Post API 응답을 ClientJobPost로 변환
   */
  static fromJobPost(apiJobPost: ApiJobPost): ClientJobPost {
    return {
      id: apiJobPost.id,
      title: apiJobPost.title,
      type: fromPrismaWorkType(apiJobPost.type),
      jobType: fromPrismaJobType(apiJobPost.jobType),
      wage: apiJobPost.wage,
      location: apiJobPost.location,
      businessName: apiJobPost.businessName,
      description: apiJobPost.description,
      applicants: apiJobPost.applicants,
      views: apiJobPost.views,
      needsUpdate: apiJobPost.needsUpdate,
      coverImage: apiJobPost.coverImage,
      strt_date: apiJobPost.strt_date,
      deadline_date: apiJobPost.deadline_date,
      status: fromPrismaJobStatus(apiJobPost.status),
    };
  }

  /**
   * 서버 Urgent Job Post API 응답을 UrgentClientJobPost로 변환
   */
  static fromUrgentJobPost(apiJobPost: ApiUrgentJobPost): UrgentClientJobPost {
    return {
      ...this.fromJobPost(apiJobPost),
      pendingReviewCnt: apiJobPost.pendingReviewCnt,
      totalApplicationsCnt: apiJobPost.totalApplicationsCnt,
    };
  }

  /**
   * 서버 Dashboard API 응답을 Dashboard로 변환
   */
  static fromDashboard(apiDashboard: ApiDashboard): Dashboard {
    return {
      activeJobPostsCnt: apiDashboard.activeJobPostsCnt,
      allAppsCnt: apiDashboard.allAppsCnt,
      needsUpdateCnt: apiDashboard.needsUpdateCnt,
    };
  }

  /**
   * 배열 형태의 API 응답을 클라이언트 타입 배열로 변환
   */
  static fromJobPostArray(apiJobPosts: ApiJobPost[]): ClientJobPost[] {
    return apiJobPosts.map((jobPost) => this.fromJobPost(jobPost));
  }

  static fromUrgentJobPostArray(apiJobPosts: ApiUrgentJobPost[]): UrgentClientJobPost[] {
    return apiJobPosts.map((jobPost) => this.fromUrgentJobPost(jobPost));
  }
}
