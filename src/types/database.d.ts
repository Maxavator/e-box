
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

export type LeaveType = 'annual' | 'sick' | 'maternity' | 'paternity';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  organization_id: string | null;
  role: string;
  calendar_notification_time?: number;
  default_notification_time?: number;
  created_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'global_admin' | 'org_admin' | 'staff';
  leave_type?: LeaveType[];
  leave_status?: LeaveStatus[];
  created_at: string;
}
