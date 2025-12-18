import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: 'dist-electron/main',
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, 'electron/main.ts'),
        },
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: 'dist-electron/preload',
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, 'electron/preload.ts'),
        },
      },
    },
  },
  renderer: {
    root: '.',
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, 'index.html'),
        },
      },
    },
    plugins: [react()],
    css: {
      postcss: './postcss.config.js',
    },
  },
});
