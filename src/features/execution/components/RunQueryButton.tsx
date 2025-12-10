import React, { useState } from 'react';
import { Play, Loader2 } from 'lucide-react';
import { useTicketsStore } from '../../tickets/store';
import { executeQuery } from '../services/graphqlClient';
import { getEndpointForEnvironment, type Environment } from '../../../config/environment';

export const RunQueryButton: React.FC = () => {
  const { activeTicketId, getTicketById, updateTicket } = useTicketsStore();
  const ticket = activeTicketId ? getTicketById(activeTicketId) : undefined;
  const [isLoading, setIsLoading] = useState(false);

  if (!ticket) return null;

  const handleRun = async () => {
    if (!ticket.queryText) return;
    
    setIsLoading(true);
    const endpoint = getEndpointForEnvironment(ticket.environment as Environment);
    
    if (!endpoint) {
      updateTicket(ticket.id, {
        latestResponse: { error: `No endpoint configured for environment: ${ticket.environment}` },
        status: 'error',
      });
      setIsLoading(false);
      return;
    }
    
    const result = await executeQuery(endpoint, ticket.queryText, ticket.variables);
    
    updateTicket(ticket.id, {
      latestResponse: result.error || result.data,
      updatedAt: Date.now(),
      status: result.error ? 'error' : 'completed',
    });
    
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleRun}
      disabled={isLoading || !ticket.queryText}
      className="flex items-center gap-2 bg-neon-green/20 text-neon-green border border-neon-green/50 px-3 py-1.5 rounded hover:bg-neon-green/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
      <span className="text-sm font-medium">Run Query</span>
    </button>
  );
};
