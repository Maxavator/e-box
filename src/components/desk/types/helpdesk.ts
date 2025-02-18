
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_by: string;
  assigned_to?: string;
  department?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}
