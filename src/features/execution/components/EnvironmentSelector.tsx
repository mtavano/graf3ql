import React from 'react';
import { useTicketsStore } from '../../tickets/store';
import { useEnvironmentsStore } from '../../environments/store';

export const EnvironmentSelector: React.FC = () => {
  const { activeTicketId, getTicketById, updateTicket } = useTicketsStore();
  const { environments } = useEnvironmentsStore();
  const ticket = activeTicketId ? getTicketById(activeTicketId) : undefined;

  if (!ticket) return null;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateTicket(ticket.id, { environment: e.target.value });
  };

  // Si el ambiente actual del ticket no está en la lista, agregar opción
  const currentEnvExists = environments.some((e) => e.name === ticket.environment);

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-text-secondary">ENV:</span>
      <select
        value={ticket.environment}
        onChange={handleChange}
        className="bg-bg-tertiary border border-border-default rounded px-2 py-1 text-xs focus:outline-none focus:border-neon-purple capitalize"
      >
        {!currentEnvExists && ticket.environment && (
          <option value={ticket.environment} disabled>
            {ticket.environment} (no configurado)
          </option>
        )}
        {environments.map((env) => (
          <option key={env.name} value={env.name}>
            {env.name}
          </option>
        ))}
        {environments.length === 0 && (
          <option value="" disabled>
            No hay ambientes configurados
          </option>
        )}
      </select>
    </div>
  );
};
