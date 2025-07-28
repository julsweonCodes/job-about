// types/hooks.ts
export interface BaseHookParams {
  page?: number;
  limit?: number;
  autoFetch?: boolean;
}

export interface BaseHookReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  totalCount: number;
  isInitialized: boolean;
  currentPage: number;
  fetch: (params?: Partial<BaseHookParams>) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  setPage: (page: number) => void;
}

// 페이지네이션 전용 타입
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasMore: boolean;
}

export interface UsePaginationReturn {
  pagination: PaginationState;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
  fetchPage: (page: number) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  goToPage: (page: number) => void;
}
