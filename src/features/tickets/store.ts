import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Ticket } from './types';

interface TicketsState {
  tickets: Ticket[];
  activeTicketId: string | null;
  createTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  deleteTicket: (id: string) => void;
  setActiveTicket: (id: string | null) => void;
  getTicketById: (id: string) => Ticket | undefined;
}

export const useTicketsStore = create<TicketsState>()(
  persist(
    (set, get) => ({
      tickets: [],
      activeTicketId: null,
      createTicket: (ticketData) => {
        const newTicket: Ticket = {
          ...ticketData,
          id: `F3-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`, // Simple ID generation for now
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({
          tickets: [newTicket, ...state.tickets],
          activeTicketId: newTicket.id,
        }));
      },
      updateTicket: (id, updates) => {
        set((state) => ({
          tickets: state.tickets.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t
          ),
        }));
      },
      deleteTicket: (id) => {
        set((state) => ({
          tickets: state.tickets.filter((t) => t.id !== id),
          activeTicketId: state.activeTicketId === id ? null : state.activeTicketId,
        }));
      },
      setActiveTicket: (id) => set({ activeTicketId: id }),
      getTicketById: (id) => get().tickets.find((t) => t.id === id),
    }),
    {
      name: 'graf3ql:tickets',
    }
  )
);
