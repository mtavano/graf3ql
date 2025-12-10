import React from 'react';
import { useTicketsStore } from '../store';
import { type TicketStatus } from '../types';
import { CheckCircle, AlertCircle, Clock, Trash2 } from 'lucide-react';
import { cn } from '../../../lib/utils';

export const TicketDetail: React.FC = () => {
  const { activeTicketId, getTicketById, updateTicket, deleteTicket } = useTicketsStore();
  const ticket = activeTicketId ? getTicketById(activeTicketId) : undefined;

  if (!ticket) return null;

  const handleStatusChange = (status: TicketStatus) => {
    updateTicket(ticket.id, { status });
  };

  return (
    <div className="h-16 border-b border-border-default bg-bg-secondary flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-neon-purple">{ticket.id}</span>
            <span className="text-text-muted text-sm">/</span>
            <span className="font-medium">{ticket.queryName}</span>
          </div>
          <span className="text-xs text-text-muted">
            Last updated: {new Date(ticket.updatedAt).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center bg-bg-tertiary rounded-md p-1 border border-border-default">
          <button
            onClick={() => handleStatusChange('in-progress')}
            className={cn(
              "p-1.5 rounded transition-all",
              ticket.status === 'in-progress' ? "bg-neon-orange/20 text-neon-orange" : "text-text-muted hover:text-text-primary"
            )}
            title="In Progress"
          >
            <Clock size={16} />
          </button>
          <button
            onClick={() => handleStatusChange('completed')}
            className={cn(
              "p-1.5 rounded transition-all",
              ticket.status === 'completed' ? "bg-neon-green/20 text-neon-green" : "text-text-muted hover:text-text-primary"
            )}
            title="Completed"
          >
            <CheckCircle size={16} />
          </button>
          <button
            onClick={() => handleStatusChange('error')}
            className={cn(
              "p-1.5 rounded transition-all",
              ticket.status === 'error' ? "bg-neon-pink/20 text-neon-pink" : "text-text-muted hover:text-text-primary"
            )}
            title="Error"
          >
            <AlertCircle size={16} />
          </button>
        </div>

        <div className="h-6 w-px bg-border-default mx-2" />

        <button
          onClick={() => {
            if (confirm('Are you sure you want to delete this ticket?')) {
              deleteTicket(ticket.id);
            }
          }}
          className="text-text-muted hover:text-neon-pink transition-colors"
          title="Delete Ticket"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};
