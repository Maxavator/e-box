// Define types for all the tables in our Supabase database

export interface Organization {
  id: string;
  name: string;
  domain: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  organization_id: string | null;
  avatar_url: string | null;
  calendar_notification_time: number | null;
  created_at: string;
  updated_at: string;
}

export type UserRoleType = 'global_admin' | 'org_admin' | 'staff' | 'user' | 
  'hr_moderator' | 'comm_moderator' | 'stakeholder_moderator';

export interface UserRole {
  id: string;
  user_id: string;
  role: UserRoleType;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  user_id: string;
  contact_id: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
  contact?: Profile; // For joined queries
}

export interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export interface CalendarTask {
  id: string;
  user_id: string;
  title: string;
  completed: boolean;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  is_online: boolean;
  meeting_link: string | null;
  start_time: string;
  end_time: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CalendarEventInvite {
  id: string;
  event_id: string;
  invitee_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  size: string | null;
  version: string | null;
  content_type: string | null;
  file_path: string | null;
  is_verified: boolean;
  requires_otp: boolean;
  last_modified_by: string | null;
  created_at: string;
  updated_at: string;
}

export type LeaveType = 'annual' | 'sick' | 'family' | 'study' | 'other';
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface LeaveRequest {
  id: string;
  user_id: string;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  reason: string | null;
  status: LeaveStatus;
  approved_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  sender_id: string | null;
  receiver_id: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
