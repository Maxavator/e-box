
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

export interface TicketComment {
  id: string;
  ticket_id: string;
  content: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_internal: boolean;
}

export interface TicketAttachment {
  id: string;
  ticket_id: string;
  file_name: string;
  file_path: string;
  content_type?: string;
  size?: string;
  uploaded_by: string;
  created_at: string;
}
