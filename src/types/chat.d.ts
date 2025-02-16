
import type { User } from "@supabase/auth-helpers-react";

export interface User {
  id: string;
  name: string;
  status: 'online' | 'offline';
  lastSeen?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: 'sending' | 'sent' | 'error';
  edited?: boolean;
  editedAt?: string;
  reactions?: Array<{
    emoji: string;
    users: string[];
  }>;
}

export interface Conversation {
  id: string;
  userId: string;
  unreadCount: number;
  messages: Message[];
}

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
