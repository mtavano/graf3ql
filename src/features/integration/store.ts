import { create } from 'zustand';

interface IntegrationState {
  availableQueries: string[];
  setAvailableQueries: (queries: string[]) => void;
}

export const useIntegrationStore = create<IntegrationState>((set) => ({
  availableQueries: [],
  setAvailableQueries: (queries) => set({ availableQueries: queries }),
}));
