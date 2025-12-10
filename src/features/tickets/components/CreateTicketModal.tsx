import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTicketsStore } from '../store';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTicketModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const createTicket = useTicketsStore(state => state.createTicket);
  const [queryName, setQueryName] = useState('');
  const [environment, setEnvironment] = useState('local');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTicket({
      status: 'in-progress',
      queryName,
      environment,
      originalResponse: null,
      latestResponse: null,
      variables: {},
    });
    onClose();
    setQueryName('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-bg-secondary border border-border-default rounded-lg w-full max-w-md p-6 shadow-xl shadow-neon-purple/10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">New Ticket</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Query Name</label>
            <input
              type="text"
              required
              value={queryName}
              onChange={(e) => setQueryName(e.target.value)}
              className="w-full bg-bg-tertiary border border-border-default rounded-md px-3 py-2 focus:outline-none focus:border-neon-purple"
              placeholder="e.g. GetUserProfile"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Environment</label>
            <select
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              className="w-full bg-bg-tertiary border border-border-default rounded-md px-3 py-2 focus:outline-none focus:border-neon-purple"
            >
              <option value="local">Local</option>
              <option value="acc">Acceptance</option>
              <option value="stage">Staging</option>
              <option value="prod">Production</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md hover:bg-bg-tertiary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-neon-purple/20 text-neon-purple border border-neon-purple/50 rounded-md hover:bg-neon-purple/30 transition-all"
            >
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
