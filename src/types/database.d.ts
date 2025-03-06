
import type { Database } from "@/integrations/supabase/types";

type DBTables = Database['public']['Tables']

export interface Organization extends DBTables['organizations']['Row'] {}

export interface Profile extends DBTables['profiles']['Row'] {
  organization_id?: string;
  calendar_notification_time?: number;
}

export interface UserRole extends DBTables['user_roles']['Row'] {
  role: UserRoleType;
}

export type LeaveType = Database['public']['Enums']['leave_type'];
export type LeaveStatus = Database['public']['Enums']['leave_status'];
export type UserRoleType = 'global_admin' | 'org_admin' | 'staff' | 'user';

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
  description?: string;
  category?: string;
  size?: string;
  version?: string;
  content_type?: string;
  file_path?: string;
  is_verified: boolean;
  requires_otp: boolean;
  last_modified_by?: string;
  created_at: string;
  updated_at: string;
}
