export type TicketStatus = 'in-progress' | 'completed' | 'error';

export interface Ticket {
  id: string;              // F3-XXXX
  status: TicketStatus;
  queryName: string;
  queryText?: string;
  environment: string;
  createdAt: number;
  updatedAt: number;
  originalResponse: any | null;
  latestResponse: any | null;
  variables: Record<string, any>;
}
