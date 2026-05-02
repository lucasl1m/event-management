import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ParticipantsFilter = 'all' | 'inside' | 'outside';

type UiStore = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

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
