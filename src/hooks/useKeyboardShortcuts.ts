import { useEffect } from 'react';
import { useTicketsStore } from '../features/tickets/store';

export const useKeyboardShortcuts = () => {
  const { activeTicketId, getTicketById, updateTicket, createTicket } = useTicketsStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + N: New Ticket
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        createTicket({
            status: 'in-progress',
            queryName: 'New Ticket',
            environment: 'local',
            originalResponse: null,
            latestResponse: null,
            variables: {},
        });
      }

      // Cmd/Ctrl + S: Save Original
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        const ticket = activeTicketId ? getTicketById(activeTicketId) : undefined;
        if (ticket && ticket.latestResponse) {
          updateTicket(ticket.id, { originalResponse: ticket.latestResponse });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTicketId, getTicketById, updateTicket, createTicket]);
};
