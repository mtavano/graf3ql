import React from 'react';
import { useTicketsStore } from '../../tickets/store';
import { useIntegrationStore } from '../../integration/store';
import { type QueryInfo } from '../../integration/services/queryLoader';

const MOCK_QUERIES: QueryInfo[] = [
  { name: 'GetUserProfile', path: 'GetUserProfile.graphql' },
  { name: 'GetPage', path: 'GetPage.graphql' },
  { name: 'SearchItems', path: 'SearchItems.graphql' },
  { name: 'GetMenu', path: 'GetMenu.graphql' },
];

export const QuerySelector: React.FC = () => {
  const { activeTicketId, getTicketById, updateTicket } = useTicketsStore();
  const ticket = activeTicketId ? getTicketById(activeTicketId) : undefined;
  const availableQueries = useIntegrationStore(state => state.availableQueries);

  if (!ticket) return null;

  const queries = availableQueries.length > 0 ? availableQueries : MOCK_QUERIES;
  const queryNames = queries.map(q => q.name);

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-text-secondary">QUERY:</span>
      <select
        value={ticket.queryName}
        onChange={(e) => updateTicket(ticket.id, { queryName: e.target.value })}
        className="bg-bg-tertiary border border-border-default rounded px-2 py-1 text-xs focus:outline-none focus:border-neon-purple min-w-[150px]"
      >
        <option value="" disabled>Select Query</option>
        {queries.map(q => (
          <option key={q.path} value={q.name} title={q.path}>{q.name}</option>
        ))}
        {!queryNames.includes(ticket.queryName) && ticket.queryName && (
           <option value={ticket.queryName}>{ticket.queryName}</option>
        )}
      </select>
    </div>
  );
};
