export interface EnvironmentConfig {
  name: string;
  url: string;
  headers?: Record<string, string>;
}

export interface ElectronAPI {
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
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};
