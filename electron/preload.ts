import { contextBridge, ipcRenderer } from 'electron';

export interface EnvironmentConfig {
  name: string;
  url: string;
  headers?: Record<string, string>;
}

// Exponer APIs seguras al renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Gestión de ambientes
  environments: {
    getAll: (): Promise<EnvironmentConfig[]> => ipcRenderer.invoke('environments:get'),
    set: (environments: EnvironmentConfig[]): Promise<boolean> =>
      ipcRenderer.invoke('environments:set', environments),
    add: (environment: EnvironmentConfig): Promise<EnvironmentConfig[]> =>
      ipcRenderer.invoke('environments:add', environment),
    remove: (name: string): Promise<EnvironmentConfig[]> =>
      ipcRenderer.invoke('environments:remove', name),
    update: (name: string, environment: EnvironmentConfig): Promise<EnvironmentConfig[]> =>
      ipcRenderer.invoke('environments:update', name, environment),
    getActive: (): Promise<string | null> => ipcRenderer.invoke('environments:getActive'),
    setActive: (name: string | null): Promise<string | null> =>
      ipcRenderer.invoke('environments:setActive', name),
  },

  // Información del servidor
  server: {
    getPort: (): Promise<number> => ipcRenderer.invoke('server:getPort'),
    getProxyUrl: (): Promise<string> => ipcRenderer.invoke('server:getProxyUrl'),
  },

  // Utilidades
  platform: process.platform,
  isElectron: true,
});

// Tipos para TypeScript en el renderer
declare global {
  interface Window {
    electronAPI: {
      environments: {
        getAll: () => Promise<EnvironmentConfig[]>;
        set: (environments: EnvironmentConfig[]) => Promise<boolean>;
        add: (environment: EnvironmentConfig) => Promise<EnvironmentConfig[]>;
        remove: (name: string) => Promise<EnvironmentConfig[]>;
        update: (name: string, environment: EnvironmentConfig) => Promise<EnvironmentConfig[]>;
        getActive: () => Promise<string | null>;
        setActive: (name: string | null) => Promise<string | null>;
      };
      server: {
        getPort: () => Promise<number>;
        getProxyUrl: () => Promise<string>;
      };
      platform: string;
      isElectron: boolean;
    };
  }
}
