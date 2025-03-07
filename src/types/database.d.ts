
import type { UserRoleType, LeaveType, LeaveStatus } from "./supabase-types";

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

export interface UserRole {
  id: string;
  user_id: string;
  role: UserRoleType;
  created_at: string;
  updated_at: string;
}

export type { UserRoleType, LeaveType, LeaveStatus };

export interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  updated_at: string;
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

export interface Document {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  size: string | null;
  version: string | null;
  content_type: string | null;
  file_path: string | null;
  isVerified: boolean;
  requires_otp: boolean;
  lastModifiedBy: string | null;
  created_at: string;
  updated_at: string;
}
