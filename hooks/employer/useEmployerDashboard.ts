import { useState, useEffect, useCallback } from "react";
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

  const fetchDashboard = useCallback(async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, dashboard: true }));
      setError(null);

      const data = await apiGetData<Dashboard>(API_URLS.EMPLOYER.DASHBOARD.ROOT);

      if (data) {
        setDashboard(data);
      } else {
        setError("Failed to fetch employer dashboard");
        setDashboard(undefined);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      setDashboard(undefined);
    } finally {
      setLoadingStates((prev) => ({ ...prev, dashboard: false }));
    }
  }, []);

  const fetchActiveJobPostList = useCallback(async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, activeJobPostList: true }));
      setError(null);

      const data = await apiGetData<JobPost[]>(API_URLS.EMPLOYER.DASHBOARD.JOBPOSTS);

      if (data && Array.isArray(data)) {
        setActiveJobPostList(data);
      } else {
        setError("Failed to fetch active job posts");
        setActiveJobPostList([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      setActiveJobPostList([]);
    } finally {
      setLoadingStates((prev) => ({ ...prev, activeJobPostList: false }));
    }
  }, []);

  const fetchDraftJobPostList = useCallback(async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, draftJobPostList: true }));
      setError(null);

      // TODO: draft API 엔드포인트가 구현되면 수정 필요
      // 임시로 active와 동일한 API 사용 (draft API가 구현되면 변경)
      const data = await apiGetData<JobPost[]>(API_URLS.EMPLOYER.DASHBOARD.JOBPOSTS);

      if (data && Array.isArray(data)) {
        // 임시로 빈 배열 설정 (draft 데이터가 없으므로)
        setDraftJobPostList([]);
      } else {
        setError("Failed to fetch draft job posts");
        setDraftJobPostList([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      setDraftJobPostList([]);
    } finally {
      setLoadingStates((prev) => ({ ...prev, draftJobPostList: false }));
    }
  }, []);

  const refreshAll = useCallback(async () => {
    try {
      // 초기 로딩 상태 설정
      setLoadingStates({
        dashboard: true,
        activeJobPostList: true,
        draftJobPostList: true,
      });

      // 각 API 호출을 개별적으로 실행하여 하나가 실패해도 다른 것들이 영향을 받지 않도록 함
      await Promise.allSettled([
        fetchDashboard(),
        fetchActiveJobPostList(),
        fetchDraftJobPostList(),
      ]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setIsInitialized(true);
    }
  }, [fetchDashboard, fetchActiveJobPostList, fetchDraftJobPostList]);

  useEffect(() => {
    if (autoFetch) {
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
