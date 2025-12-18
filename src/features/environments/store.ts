import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface EnvironmentConfig {
  name: string;
  url: string;
  headers?: Record<string, string>;
}

interface EnvironmentsState {
  environments: EnvironmentConfig[];
  activeEnvironmentName: string | null;
  proxyUrl: string;
  isElectron: boolean;

  // Actions
  setEnvironments: (environments: EnvironmentConfig[]) => void;
  addEnvironment: (environment: EnvironmentConfig) => void;
  updateEnvironment: (name: string, environment: EnvironmentConfig) => void;
  removeEnvironment: (name: string) => void;
  setActiveEnvironment: (name: string | null) => void;
  setProxyUrl: (url: string) => void;
  getActiveEnvironment: () => EnvironmentConfig | undefined;
  getEnvironmentByName: (name: string) => EnvironmentConfig | undefined;
  initializeFromElectron: () => Promise<void>;
  syncToElectron: () => Promise<void>;
}

// Detectar si estamos en Electron
const isElectronEnv = (): boolean => {
  return typeof window !== 'undefined' && window.electronAPI?.isElectron === true;
};

// Default environments para desarrollo
const defaultEnvironments: EnvironmentConfig[] = [
  { name: 'local', url: 'http://localhost:3000/graphql' },
];

export const useEnvironmentsStore = create<EnvironmentsState>()(
  persist(
    (set, get) => ({
      environments: defaultEnvironments,
      activeEnvironmentName: 'local',
      proxyUrl: '/api/proxy',
      isElectron: isElectronEnv(),

      setEnvironments: (environments) => {
        set({ environments });
        get().syncToElectron();
      },

      addEnvironment: (environment) => {
        const { environments } = get();
        const exists = environments.some((e) => e.name === environment.name);
        if (!exists) {
          set({ environments: [...environments, environment] });
          get().syncToElectron();
        }
      },

      updateEnvironment: (name, environment) => {
        const { environments } = get();
        const index = environments.findIndex((e) => e.name === name);
        if (index !== -1) {
          const updated = [...environments];
          updated[index] = environment;
          set({ environments: updated });
          get().syncToElectron();
        }
      },

      removeEnvironment: (name) => {
        const { environments, activeEnvironmentName } = get();
        const filtered = environments.filter((e) => e.name !== name);
        set({
          environments: filtered,
          activeEnvironmentName: activeEnvironmentName === name ? null : activeEnvironmentName,
        });
        get().syncToElectron();
      },

      setActiveEnvironment: (name) => {
        set({ activeEnvironmentName: name });
        if (isElectronEnv()) {
          window.electronAPI?.environments.setActive(name);
        }
      },

      setProxyUrl: (url) => set({ proxyUrl: url }),

      getActiveEnvironment: () => {
        const { environments, activeEnvironmentName } = get();
        return environments.find((e) => e.name === activeEnvironmentName);
      },

      getEnvironmentByName: (name) => {
        const { environments } = get();
        return environments.find((e) => e.name === name);
      },

      initializeFromElectron: async () => {
        if (!isElectronEnv()) return;

        try {
          const [environments, activeEnv, proxyUrl] = await Promise.all([
            window.electronAPI!.environments.getAll(),
            window.electronAPI!.environments.getActive(),
            window.electronAPI!.server.getProxyUrl(),
          ]);

          set({
            environments: environments.length > 0 ? environments : defaultEnvironments,
            activeEnvironmentName: activeEnv,
            proxyUrl,
            isElectron: true,
          });
        } catch (error) {
          console.error('Error inicializando desde Electron:', error);
        }
      },

      syncToElectron: async () => {
        if (!isElectronEnv()) return;

        try {
          const { environments } = get();
          await window.electronAPI!.environments.set(environments);
        } catch (error) {
          console.error('Error sincronizando con Electron:', error);
        }
      },
    }),
    {
      name: 'graf3ql:environments',
      partialize: (state) => ({
        environments: state.environments,
        activeEnvironmentName: state.activeEnvironmentName,
      }),
    }
  )
);
