import { useCallback, useEffect, useRef } from "react";

interface UseScrollRestorationOptions {
  key: string;
  enabled?: boolean;
  delay?: number;
}

interface UseScrollRestorationReturn {
  saveScrollPosition: () => void;
  restoreScrollPosition: () => void;
  clearScrollPosition: () => void;
}

export function useScrollRestoration({
  key,
  enabled = true,
  delay = 100,
}: UseScrollRestorationOptions): UseScrollRestorationReturn {
  const elementRef = useRef<HTMLElement | null>(null);
  const restoredRef = useRef(false);

  // 스크롤 위치 저장
  const saveScrollPosition = useCallback(() => {
    if (!enabled || !elementRef.current) return;

    // 브라우저 환경에서만 실행
    if (typeof window === "undefined") return;

    try {
      const scrollTop = elementRef.current.scrollTop;
      sessionStorage.setItem(`scroll-${key}`, scrollTop.toString());
    } catch (error) {
      console.warn("Failed to save scroll position:", error);
    }
  }, [key, enabled]);

  // 스크롤 위치 복원
  const restoreScrollPosition = useCallback(() => {
    if (!enabled || !elementRef.current || restoredRef.current) return;

    // 브라우저 환경에서만 실행
    if (typeof window === "undefined") return;

    try {
      const savedPosition = sessionStorage.getItem(`scroll-${key}`);
      if (savedPosition) {
        const scrollTop = parseInt(savedPosition, 10);
        if (!isNaN(scrollTop) && scrollTop > 0) {
          elementRef.current.scrollTop = scrollTop;
          restoredRef.current = true;
        }
      }
    } catch (error) {
      console.warn("Failed to restore scroll position:", error);
    }
  }, [key, enabled]);

  // 스크롤 위치 삭제
  const clearScrollPosition = useCallback(() => {
    try {
      sessionStorage.removeItem(`scroll-${key}`);
      restoredRef.current = false;
    } catch (error) {
      console.warn("Failed to clear scroll position:", error);
    }
  }, [key]);

  // 스크롤 이벤트 리스너
  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    const handleScroll = () => {
      saveScrollPosition();
    };

    const element = elementRef.current;
    element.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      element.removeEventListener("scroll", handleScroll);
    };
  }, [saveScrollPosition, enabled]);

  // 페이지 진입 시 스크롤 위치 복원
  useEffect(() => {
    if (!enabled) return;

    const timer = setTimeout(() => {
      restoreScrollPosition();
    }, delay);

    return () => clearTimeout(timer);
  }, [restoreScrollPosition, enabled, delay]);

  return {
    saveScrollPosition,
    restoreScrollPosition,
    clearScrollPosition,
  };
}

// ref를 받는 버전
export function useScrollRestorationWithRef(
  ref: React.RefObject<HTMLElement>,
  key: string,
  options: Omit<UseScrollRestorationOptions, "key"> = {}
) {
  const { enabled = true, delay = 100 } = options;
  const restoredRef = useRef(false);

  // 스크롤 위치 저장
  const saveScrollPosition = useCallback(() => {
    if (!enabled || !ref.current) {
      console.log("🔄 Scroll save skipped:", { enabled, hasRef: !!ref.current });
      return;
    }

    // 브라우저 환경에서만 실행
    if (typeof window === "undefined") {
      console.log("🔄 Scroll save skipped - not in browser");
      return;
    }

    try {
      const scrollTop = ref.current.scrollTop;
      console.log("🔄 Saving scroll position:", { scrollTop, key });
      sessionStorage.setItem(`scroll-${key}`, scrollTop.toString());
      console.log("🔄 Scroll position saved successfully");
    } catch (error) {
      console.warn("Failed to save scroll position:", error);
    }
  }, [key, enabled, ref]);

  // 스크롤 위치 복원
  const restoreScrollPosition = useCallback(() => {
    if (!enabled || !ref.current || restoredRef.current) {
      console.log("🔄 Scroll restore skipped:", {
        enabled,
        hasRef: !!ref.current,
        alreadyRestored: restoredRef.current,
      });
      return;
    }

    // 브라우저 환경에서만 실행
    if (typeof window === "undefined") {
      console.log("🔄 Scroll restore skipped - not in browser");
      return;
    }

    try {
      const savedPosition = sessionStorage.getItem(`scroll-${key}`);
      console.log("🔄 Attempting to restore scroll position:", { savedPosition, key });

      if (savedPosition) {
        const scrollTop = parseInt(savedPosition, 10);
        if (!isNaN(scrollTop) && scrollTop > 0) {
          console.log("🔄 Restoring scroll position to:", scrollTop);
          ref.current.scrollTop = scrollTop;
          restoredRef.current = true;
          console.log("🔄 Scroll position restored successfully");
        } else {
          console.log("🔄 Invalid scroll position:", savedPosition);
        }
      } else {
        console.log("🔄 No saved scroll position found");
      }
    } catch (error) {
      console.warn("Failed to restore scroll position:", error);
    }
  }, [key, enabled, ref]);

  // 스크롤 위치 삭제
  const clearScrollPosition = useCallback(() => {
    // 브라우저 환경에서만 실행
    if (typeof window === "undefined") return;

    try {
      sessionStorage.removeItem(`scroll-${key}`);
      restoredRef.current = false;
    } catch (error) {
      console.warn("Failed to clear scroll position:", error);
    }
  }, [key]);

  // 스크롤 이벤트 리스너
  useEffect(() => {
    if (!enabled || !ref.current) return;

    const handleScroll = () => {
      saveScrollPosition();
    };

    const element = ref.current;
    element.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      element.removeEventListener("scroll", handleScroll);
    };
  }, [saveScrollPosition, enabled, ref]);

  // 페이지 진입 시 스크롤 위치 복원
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const timer = setTimeout(() => {
      restoreScrollPosition();
    }, delay);

    return () => clearTimeout(timer);
  }, [restoreScrollPosition, enabled, delay]);

  return {
    saveScrollPosition,
    restoreScrollPosition,
    clearScrollPosition,
  };
}
