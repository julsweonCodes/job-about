import { useState, useEffect, useCallback, useRef } from "react";
import { apiGetData } from "@/utils/client/API";
import { Dashboard, JobPost } from "@/types/employer";
import { API_URLS } from "@/constants/api";

interface UseEmployerDashboardParams {
  autoFetch?: boolean;
}

interface UseEmployerDashboardReturn {
  dashboard: Dashboard | undefined;
  activeJobPostList: JobPost[];
  draftJobPostList: JobPost[];
  loadingStates: {
    dashboard: boolean;
    activeJobPostList: boolean;
    draftJobPostList: boolean;
  };
  error: string | null;
  isInitialized: boolean;
  fetchDashboard: () => Promise<void>;
  fetchActiveJobPostList: () => Promise<void>;
  fetchDraftJobPostList: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

export function useEmployerDashboard({
  autoFetch = true,
}: UseEmployerDashboardParams = {}): UseEmployerDashboardReturn {
  // 상태 관리
  const [dashboard, setDashboard] = useState<Dashboard>();
  const [activeJobPostList, setActiveJobPostList] = useState<JobPost[]>([]);
  const [draftJobPostList, setDraftJobPostList] = useState<JobPost[]>([]);
  const [loadingStates, setLoadingStates] = useState({
    dashboard: true,
    activeJobPostList: true,
    draftJobPostList: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // 중복 요청 방지를 위한 ref
  const isInitializing = useRef(false);

  // 대시보드 데이터 조회
  const fetchDashboard = useCallback(async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, dashboard: true }));
      setError(null);

      const data = await apiGetData<Dashboard>(API_URLS.EMPLOYER.DASHBOARD.ROOT);
      setDashboard(data || undefined);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch dashboard";
      setError(errorMessage);
      setDashboard(undefined);
    } finally {
      setLoadingStates((prev) => ({ ...prev, dashboard: false }));
    }
  }, []);

  // 활성 채용 공고 조회
  const fetchActiveJobPostList = useCallback(async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, activeJobPostList: true }));
      setError(null);

      const data = await apiGetData<JobPost[]>(API_URLS.EMPLOYER.DASHBOARD.JOBPOSTS);
      setActiveJobPostList(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch active job posts";
      setError(errorMessage);
      setActiveJobPostList([]);
    } finally {
      setLoadingStates((prev) => ({ ...prev, activeJobPostList: false }));
    }
  }, []);

  // 초안 채용 공고 조회 (현재는 빈 배열 반환)
  const fetchDraftJobPostList = useCallback(async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, draftJobPostList: true }));
      setError(null);

      // TODO: draft API 엔드포인트가 구현되면 수정 필요
      // 현재는 빈 배열로 설정
      setDraftJobPostList([]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch draft job posts";
      setError(errorMessage);
      setDraftJobPostList([]);
    } finally {
      setLoadingStates((prev) => ({ ...prev, draftJobPostList: false }));
    }
  }, []);

  // 전체 데이터 새로고침
  const refreshAll = useCallback(async () => {
    if (isInitializing.current) return; // 중복 요청 방지

    try {
      isInitializing.current = true;

      // 로딩 상태 초기화
      setLoadingStates({
        dashboard: true,
        activeJobPostList: true,
        draftJobPostList: true,
      });
      setError(null);

      // 병렬로 API 호출 (하나가 실패해도 다른 것들은 계속 진행)
      await Promise.allSettled([
        fetchDashboard(),
        fetchActiveJobPostList(),
        fetchDraftJobPostList(),
      ]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to refresh data";
      setError(errorMessage);
    } finally {
      setIsInitialized(true);
      isInitializing.current = false;
    }
  }, [fetchDashboard, fetchActiveJobPostList, fetchDraftJobPostList]);

  // 초기 데이터 로딩
  useEffect(() => {
    if (autoFetch && !isInitializing.current) {
      refreshAll();
    }
  }, [autoFetch, refreshAll]);

  return {
    dashboard,
    activeJobPostList,
    draftJobPostList,
    loadingStates,
    error,
    isInitialized,
    fetchDashboard,
    fetchActiveJobPostList,
    fetchDraftJobPostList,
    refreshAll,
  };
}
