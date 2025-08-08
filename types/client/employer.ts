import { Location } from "@/constants/location";

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
