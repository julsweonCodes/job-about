import { useCallback, useEffect, useRef } from "react";
import { useScrollStore } from "@/stores/useScrollStore";

interface UseScrollRestorationOptions {
  pageId: string;
  enabled?: boolean;
  delay?: number;
}

export const useScrollRestoration = ({
  pageId,
  enabled = true,
  delay = 100,
}: UseScrollRestorationOptions) => {
  const {
    saveScrollPosition,
    getScrollPosition,
    setFromDetailPage,
    isFromDetailPage,
    clearScrollPosition,
  } = useScrollStore();

  const isRestoringRef = useRef(false);
  const hasRestoredRef = useRef(false);

  // 스크롤 위치 저장
  const saveCurrentScrollPosition = useCallback(() => {
    if (!enabled || typeof window === "undefined") return;

    const currentScrollY = window.scrollY;
    if (currentScrollY > 0) {
      saveScrollPosition(pageId, currentScrollY);
    }
  }, [pageId, saveScrollPosition, enabled]);

  // 스크롤 위치 복원
  const restoreScrollPosition = useCallback(() => {
    if (!enabled || typeof window === "undefined" || hasRestoredRef.current) return;

    const savedPosition = getScrollPosition(pageId);
    const fromDetail = isFromDetailPage(pageId);

    if (savedPosition && fromDetail) {
      isRestoringRef.current = true;

      setTimeout(() => {
        try {
          // 스크롤 가능한 최대 높이 확인
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          const safeScrollY = Math.min(savedPosition, maxScroll);

          window.scrollTo({ top: safeScrollY, behavior: "instant" });

          // 복원 완료 후 플래그 제거
          setFromDetailPage(pageId, false);
        } catch (error) {
          console.warn("Failed to restore scroll position:", error);
        } finally {
          isRestoringRef.current = false;
          hasRestoredRef.current = true;
        }
      }, delay);
    }
  }, [pageId, getScrollPosition, isFromDetailPage, setFromDetailPage, enabled, delay]);

  // 상세 페이지로 이동할 때 스크롤 위치 저장
  const handleNavigateToDetail = useCallback(() => {
    if (!enabled || typeof window === "undefined") return;

    const currentScrollY = window.scrollY;
    if (currentScrollY > 0) {
      saveScrollPosition(pageId, currentScrollY);
      setFromDetailPage(pageId, true);
    }
  }, [pageId, saveScrollPosition, setFromDetailPage, enabled]);

  // 브라우저 뒤로가기 감지 및 처리
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const handlePopState = () => {
      // 뒤로가기로 페이지를 벗어날 때 스크롤 위치 초기화
      clearScrollPosition(pageId);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [pageId, clearScrollPosition, enabled]);

  // 스크롤 이벤트 리스너 (디바운싱)
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      if (isRestoringRef.current) return;

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        saveCurrentScrollPosition();
      }, 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [enabled, saveCurrentScrollPosition]);

  return {
    restoreScrollPosition,
    handleNavigateToDetail,
    saveCurrentScrollPosition,
    isFromDetailPage: isFromDetailPage(pageId),
  };
};
