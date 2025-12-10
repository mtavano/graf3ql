import React, { useState } from 'react';
import { useTicketsStore } from '../store';
import { Plus, Search, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { CreateTicketModal } from './CreateTicketModal';

export const TicketList: React.FC = () => {
  const { tickets, activeTicketId, setActiveTicket } = useTicketsStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('');

  const filteredTickets = tickets.filter(t => 
    t.id.toLowerCase().includes(filter.toLowerCase()) || 
    t.queryName.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="p-4 space-y-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-neon-purple/10 hover:bg-neon-purple/20 text-neon-purple border border-neon-purple/50 p-2 rounded-md transition-all"
        >
          <Plus size={18} />
          <span>New Ticket</span>
        </button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
          <input
            type="text"
            placeholder="Search tickets..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-bg-tertiary border border-border-default rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-neon-purple/50"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {filteredTickets.map((ticket) => (
          <div
            key={ticket.id}
            onClick={() => setActiveTicket(ticket.id)}
            className={cn(
              "p-3 rounded-md cursor-pointer border border-transparent transition-all hover:bg-bg-tertiary/50",
              activeTicketId === ticket.id && "bg-bg-tertiary border-neon-purple/30"
            )}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="font-mono text-sm font-medium text-neon-purple">{ticket.id}</span>
              {ticket.status === 'completed' && <CheckCircle size={14} className="text-neon-green" />}
              {ticket.status === 'error' && <AlertCircle size={14} className="text-neon-pink" />}
              {ticket.status === 'in-progress' && <Clock size={14} className="text-neon-orange" />}
            </div>
            <div className="text-sm font-medium truncate">{ticket.queryName}</div>
            <div className="flex justify-between items-center mt-2 text-xs text-text-muted">
              <span>{ticket.environment}</span>
              <span>{new Date(ticket.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
      
      <CreateTicketModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
