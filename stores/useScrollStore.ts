import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ScrollPosition {
  position: number;
  timestamp: number;
}

interface ScrollState {
  // 페이지별 스크롤 위치 저장
  scrollPositions: Record<string, ScrollPosition>;

  // 현재 페이지에서 상세 페이지로 이동했는지 확인하는 플래그
  fromDetailPage: Record<string, boolean>;

  // 스크롤 위치 저장
  saveScrollPosition: (pageId: string, position: number) => void;

  // 스크롤 위치 가져오기
  getScrollPosition: (pageId: string) => number | null;

  // 상세 페이지 이동 플래그 설정
  setFromDetailPage: (pageId: string, value: boolean) => void;

  // 상세 페이지에서 왔는지 확인
  isFromDetailPage: (pageId: string) => boolean;

  // 스크롤 위치 삭제
  clearScrollPosition: (pageId: string) => void;

  // 오래된 스크롤 위치 정리 (24시간 이상 된 것들)
  cleanupOldPositions: () => void;

  // 모든 스크롤 위치 초기화
  clearAllPositions: () => void;
}

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

export const useScrollStore = create<ScrollState>()(
  persist(
    (set, get) => ({
      scrollPositions: {},
      fromDetailPage: {},

      saveScrollPosition: (pageId: string, position: number) => {
        set((state) => ({
          scrollPositions: {
            ...state.scrollPositions,
            [pageId]: {
              position,
              timestamp: Date.now(),
            },
          },
        }));
      },

      getScrollPosition: (pageId: string) => {
        const state = get();
        const scrollData = state.scrollPositions[pageId];

        if (!scrollData) return null;

        // 24시간이 지난 데이터는 무효화
        if (Date.now() - scrollData.timestamp > TWENTY_FOUR_HOURS) {
          get().clearScrollPosition(pageId);
          return null;
        }

        return scrollData.position;
      },

      setFromDetailPage: (pageId: string, value: boolean) => {
        set((state) => ({
          fromDetailPage: {
            ...state.fromDetailPage,
            [pageId]: value,
          },
        }));
      },

      isFromDetailPage: (pageId: string) => {
        const state = get();
        return state.fromDetailPage[pageId] || false;
      },

      clearScrollPosition: (pageId: string) => {
        set((state) => {
          const newScrollPositions = { ...state.scrollPositions };
          delete newScrollPositions[pageId];

          const newFromDetailPage = { ...state.fromDetailPage };
          delete newFromDetailPage[pageId];

          return {
            scrollPositions: newScrollPositions,
            fromDetailPage: newFromDetailPage,
          };
        });
      },

      cleanupOldPositions: () => {
        const state = get();
        const now = Date.now();
        const newScrollPositions: Record<string, ScrollPosition> = {};

        Object.entries(state.scrollPositions).forEach(([pageId, scrollData]) => {
          if (now - scrollData.timestamp <= TWENTY_FOUR_HOURS) {
            newScrollPositions[pageId] = scrollData;
          }
        });

        set({ scrollPositions: newScrollPositions });
      },

      clearAllPositions: () => {
        set({ scrollPositions: {}, fromDetailPage: {} });
      },
    }),
    {
      name: "scroll-storage",
      // 스크롤 위치만 저장하고 플래그는 저장하지 않음
      partialize: (state) => ({ scrollPositions: state.scrollPositions }),
    }
  )
);
