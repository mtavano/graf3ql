import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  f3QaPath: string | null;
  setF3QaPath: (path: string) => void;
  isSettingsOpen: boolean;
  toggleSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      f3QaPath: null,
      setF3QaPath: (path) => set({ f3QaPath: path }),
      isSettingsOpen: false,
      toggleSettings: () => set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),
    }),
    {
      name: 'graf3ql:settings',
    }
  )
);
