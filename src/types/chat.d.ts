import type { User } from "@supabase/auth-helpers-react";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  is_online: boolean;
  meeting_link?: string;
  creator_id: string;
}

export interface CalendarInvite {
  id: string;
  event_id: string;
  invitee_id: string;
  status: 'pending' | 'accepted' | 'declined' | 'tentative';
  created_at: string;
  updated_at: string;
}
