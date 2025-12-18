import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import Store from 'electron-store';
import { startServer, stopServer } from './server';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración del store para persistir ambientes
interface EnvironmentConfig {
  name: string;
  url: string;
  headers?: Record<string, string>;
}

interface StoreSchema {
  environments: EnvironmentConfig[];
  activeEnvironment: string | null;
  serverPort: number;
}

const store = new Store<StoreSchema>({
  defaults: {
    environments: [],
    activeEnvironment: null,
    serverPort: 3005,
  },
});

let mainWindow: BrowserWindow | null = null;
let serverPort: number = 3005;

async function createWindow() {
  // Iniciar el servidor Express embebido
  serverPort = store.get('serverPort', 3005);
  try {
    serverPort = await startServer(serverPort);
    console.log(`Servidor proxy iniciado en puerto ${serverPort}`);
  } catch (error) {
    console.error('Error iniciando servidor:', error);
  }

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 15, y: 15 },
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // En desarrollo, carga desde Vite dev server
  // En producción, carga desde los archivos compilados
  if (process.env.NODE_ENV === 'development') {
    const devServerUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
    mainWindow.loadURL(devServerUrl);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC Handlers para gestión de ambientes
ipcMain.handle('environments:get', () => {
  return store.get('environments', []);
});

ipcMain.handle('environments:set', (_event, environments: EnvironmentConfig[]) => {
  store.set('environments', environments);
  return true;
});

ipcMain.handle('environments:add', (_event, environment: EnvironmentConfig) => {
  const environments = store.get('environments', []);
  environments.push(environment);
  store.set('environments', environments);
  return environments;
});

ipcMain.handle('environments:remove', (_event, name: string) => {
  const environments = store.get('environments', []);
  const filtered = environments.filter((env) => env.name !== name);
  store.set('environments', filtered);
  return filtered;
});

ipcMain.handle('environments:update', (_event, name: string, environment: EnvironmentConfig) => {
  const environments = store.get('environments', []);
  const index = environments.findIndex((env) => env.name === name);
  if (index !== -1) {
    environments[index] = environment;
    store.set('environments', environments);
  }
  return environments;
});

ipcMain.handle('environments:getActive', () => {
  return store.get('activeEnvironment', null);
});

ipcMain.handle('environments:setActive', (_event, name: string | null) => {
  store.set('activeEnvironment', name);
  return name;
});

ipcMain.handle('server:getPort', () => {
  return serverPort;
});

ipcMain.handle('server:getProxyUrl', () => {
  return `http://localhost:${serverPort}/api/proxy`;
});

// Lifecycle
app.whenReady().then(createWindow);

app.on('window-all-closed', async () => {
  await stopServer();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('before-quit', async () => {
  await stopServer();
});
