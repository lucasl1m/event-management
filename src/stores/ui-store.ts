import { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ParticipantsFilter = 'all' | 'inside' | 'outside';

type UiStore = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  isMobile: boolean;
  setIsMobile: (value: boolean) => void;

  lastVisitedEventId: string | null;
  setLastVisitedEventId: (id: string) => void;

  participantsFilter: ParticipantsFilter;
  setParticipantsFilter: (filter: ParticipantsFilter) => void;
};

type PersistedState = Pick<UiStore, 'lastVisitedEventId'>;

export const useUiStore = create<UiStore>()(
  persist(
    (set) => ({
      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      isMobile: false,
      setIsMobile: (value) => set({ isMobile: value }),

      lastVisitedEventId: null,
      setLastVisitedEventId: (id) => set({ lastVisitedEventId: id }),

      participantsFilter: 'all',
      setParticipantsFilter: (filter) => set({ participantsFilter: filter }),
    }),
    {
      name: 'ui-store',
      partialize: (state): PersistedState => ({
        lastVisitedEventId: state.lastVisitedEventId,
      }),
    },
  ),
);

export function useInitMobile() {
  const setIsMobile = useUiStore((s) => s.setIsMobile);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [setIsMobile]);
}
