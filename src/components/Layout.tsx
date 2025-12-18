import React from 'react';
import { Settings } from 'lucide-react';
import { TicketList } from '../features/tickets/components/TicketList';
import { SettingsPanel } from '../features/settings/components/SettingsPanel';
import { useSettingsStore } from '../features/settings/store';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

// Detectar si estamos en Electron (navegador vs app de escritorio)
// Verificamos si NO estamos en un navegador normal
const isElectron = typeof navigator !== 'undefined' && navigator.userAgent.includes('Electron');
const isMac = typeof navigator !== 'undefined' && navigator.platform.toLowerCase().includes('mac');
const isElectronMac = isElectron && isMac;

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toggleSettings = useSettingsStore(state => state.toggleSettings);
  useKeyboardShortcuts();

  return (
    <div className="flex h-screen bg-bg-primary text-text-primary overflow-hidden">
      <aside className="w-80 border-r border-border-default bg-bg-secondary flex flex-col">
        {/* Header con espacio para traffic lights en macOS */}
        <div 
          className="p-4 border-b border-border-default flex justify-between items-center"
          style={{
            ...(isElectronMac ? { paddingTop: '2.25rem', paddingLeft: '5rem' } : {}),
            ...(isElectron ? { WebkitAppRegion: 'drag' } as React.CSSProperties : {}),
          }}
        >
          <h1 className="text-xl font-bold bg-gradient-to-r from-neon-green to-neon-purple bg-clip-text text-transparent">
            Graf3QL
          </h1>
          <button
            onClick={toggleSettings}
            className="text-text-muted hover:text-text-primary transition-colors"
            title="Settings"
            style={isElectron ? { WebkitAppRegion: 'no-drag' } as React.CSSProperties : undefined}
          >
            <Settings size={20} />
          </button>
        </div>
        <TicketList />
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
      <SettingsPanel />
    </div>
  );
};
