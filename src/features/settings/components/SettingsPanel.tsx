import React from 'react';
import { X, FolderOpen } from 'lucide-react';
import { useSettingsStore } from '../store';

import { loadQueriesFromDirectory } from '../../integration/services/queryLoader';
import { useIntegrationStore } from '../../integration/store';
import { EnvironmentsConfig } from '../../environments/components/EnvironmentsConfig';

export const SettingsPanel: React.FC = () => {
  const { isSettingsOpen, toggleSettings, f3QaPath, setF3QaPath } = useSettingsStore();
  const { availableQueries, setAvailableQueries, setDirectoryHandle } = useIntegrationStore();

  if (!isSettingsOpen) return null;

  const handleSelectFolder = async () => {
    try {
      // @ts-ignore - File System Access API
      const handle = await window.showDirectoryPicker();
      setF3QaPath(handle.name);
      setDirectoryHandle(handle);
      const queries = await loadQueriesFromDirectory(handle);
      setAvailableQueries(queries);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-bg-secondary border border-border-default rounded-lg w-full max-w-lg max-h-[80vh] overflow-y-auto p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Settings</h2>
          <button onClick={toggleSettings} className="text-text-muted hover:text-text-primary">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Configuración de Ambientes */}
          <EnvironmentsConfig />

          {/* Separador */}
          <div className="border-t border-border-default" />

          {/* F3-QA Repository */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">F3-QA Repository Path</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={f3QaPath || ''}
                readOnly
                className="flex-1 bg-bg-tertiary border border-border-default rounded-md px-3 py-2 text-sm text-text-muted"
                placeholder="No directory selected"
              />
              <button
                onClick={handleSelectFolder}
                className="bg-neon-purple/20 text-neon-purple border border-neon-purple/50 px-3 py-2 rounded-md hover:bg-neon-purple/30 transition-all"
              >
                <FolderOpen size={18} />
              </button>
            </div>
            <p className="text-xs text-text-muted mt-1">
              Select the local f3-qa repository to load queries automatically.
            </p>
            {availableQueries.length > 0 && (
              <p className="text-xs text-neon-green mt-2">
                ✓ {availableQueries.length} queries loaded
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
