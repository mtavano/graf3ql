import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type QueryInfo } from './services/queryLoader';

interface IntegrationState {
  availableQueries: QueryInfo[];
  directoryHandle: FileSystemDirectoryHandle | null;
  setAvailableQueries: (queries: QueryInfo[]) => void;
  setDirectoryHandle: (handle: FileSystemDirectoryHandle | null) => void;
  getQueryByName: (name: string) => QueryInfo | undefined;
}

export const useIntegrationStore = create<IntegrationState>()(
  persist(
    (set, get) => ({
      availableQueries: [],
      directoryHandle: null,
      setAvailableQueries: (queries) => set({ availableQueries: queries }),
      setDirectoryHandle: (handle) => set({ directoryHandle: handle }),
      getQueryByName: (name) => get().availableQueries.find(q => q.name === name),
    }),
    {
      name: 'graf3ql:integration',
      partialize: (state) => ({ 
        // Persistir queries con contenido (el handle no es serializable)
        availableQueries: state.availableQueries.map(q => ({
          name: q.name,
          path: q.path,
          content: q.content,
        }))
      }),
    }
  )
);
