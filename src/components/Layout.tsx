import React from 'react';
import { Settings } from 'lucide-react';
import { TicketList } from '../features/tickets/components/TicketList';
import { SettingsPanel } from '../features/settings/components/SettingsPanel';
import { useSettingsStore } from '../features/settings/store';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toggleSettings = useSettingsStore(state => state.toggleSettings);
  useKeyboardShortcuts();

  return (
    <div className="flex h-screen bg-bg-primary text-text-primary overflow-hidden">
      <aside className="w-80 border-r border-border-default bg-bg-secondary flex flex-col">
        <div className="p-4 border-b border-border-default flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-neon-green to-neon-purple bg-clip-text text-transparent">
            Graf3QL
          </h1>
          <button
            onClick={toggleSettings}
            className="text-text-muted hover:text-text-primary transition-colors"
            title="Settings"
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
