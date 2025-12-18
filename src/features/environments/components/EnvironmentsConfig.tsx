import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, Server } from 'lucide-react';
import { useEnvironmentsStore } from '../store';
import type { EnvironmentConfig } from '../store';

interface EditingState {
  name: string;
  url: string;
  originalName?: string;
}

export const EnvironmentsConfig: React.FC = () => {
  const { environments, addEnvironment, updateEnvironment, removeEnvironment, isElectron } =
    useEnvironmentsStore();

  const [isAdding, setIsAdding] = useState(false);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [formState, setFormState] = useState<EditingState>({ name: '', url: '' });

  const handleAdd = () => {
    setIsAdding(true);
    setFormState({ name: '', url: '' });
  };

  const handleEdit = (env: EnvironmentConfig) => {
    setEditingName(env.name);
    setFormState({ name: env.name, url: env.url, originalName: env.name });
  };

  const handleSave = () => {
    if (!formState.name.trim() || !formState.url.trim()) return;

    const newEnv: EnvironmentConfig = {
      name: formState.name.trim().toLowerCase().replace(/\s+/g, '-'),
      url: formState.url.trim(),
    };

    if (isAdding) {
      addEnvironment(newEnv);
      setIsAdding(false);
    } else if (editingName && formState.originalName) {
      updateEnvironment(formState.originalName, newEnv);
      setEditingName(null);
    }

    setFormState({ name: '', url: '' });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingName(null);
    setFormState({ name: '', url: '' });
  };

  const handleDelete = (name: string) => {
    if (confirm(`¿Eliminar el ambiente "${name}"?`)) {
      removeEnvironment(name);
    }
  };

  const renderForm = () => (
    <div className="bg-bg-tertiary border border-border-default rounded-lg p-3 space-y-3">
      <div>
        <label className="block text-xs font-medium text-text-secondary mb-1">Nombre</label>
        <input
          type="text"
          value={formState.name}
          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
          placeholder="ej: staging, production"
          className="w-full bg-bg-primary border border-border-default rounded px-3 py-2 text-sm focus:outline-none focus:border-neon-purple"
          autoFocus
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-text-secondary mb-1">URL del endpoint GraphQL</label>
        <input
          type="text"
          value={formState.url}
          onChange={(e) => setFormState({ ...formState, url: e.target.value })}
          placeholder="https://api.example.com/graphql"
          className="w-full bg-bg-primary border border-border-default rounded px-3 py-2 text-sm focus:outline-none focus:border-neon-purple"
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={handleCancel}
          className="px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <X size={16} className="inline mr-1" />
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={!formState.name.trim() || !formState.url.trim()}
          className="px-3 py-1.5 text-sm bg-neon-purple/20 text-neon-purple border border-neon-purple/50 rounded hover:bg-neon-purple/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check size={16} className="inline mr-1" />
          Guardar
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Server size={18} className="text-neon-cyan" />
          <h3 className="text-sm font-semibold">Ambientes GraphQL</h3>
          {isElectron && (
            <span className="text-xs bg-neon-green/20 text-neon-green px-2 py-0.5 rounded">
              Electron
            </span>
          )}
        </div>
        {!isAdding && !editingName && (
          <button
            onClick={handleAdd}
            className="flex items-center gap-1 text-xs text-neon-purple hover:text-neon-purple/80 transition-colors"
          >
            <Plus size={14} />
            Agregar
          </button>
        )}
      </div>

      <p className="text-xs text-text-muted">
        Configura las URLs de tus endpoints GraphQL para cada ambiente. Los datos se guardan de forma segura en tu dispositivo.
      </p>

      {isAdding && renderForm()}

      <div className="space-y-2">
        {environments.map((env) =>
          editingName === env.name ? (
            <div key={env.name}>{renderForm()}</div>
          ) : (
            <div
              key={env.name}
              className="flex items-center justify-between bg-bg-tertiary border border-border-default rounded-lg p-3 group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm capitalize">{env.name}</span>
                </div>
                <p className="text-xs text-text-muted truncate mt-0.5" title={env.url}>
                  {env.url}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(env)}
                  className="p-1.5 text-text-muted hover:text-neon-cyan transition-colors"
                  title="Editar"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(env.name)}
                  className="p-1.5 text-text-muted hover:text-neon-red transition-colors"
                  title="Eliminar"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {environments.length === 0 && !isAdding && (
        <div className="text-center py-6 text-text-muted text-sm">
          No hay ambientes configurados. Agrega uno para comenzar.
        </div>
      )}
    </div>
  );
};
