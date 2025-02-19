
import { Database } from './types';

export type Tables = Database['public']['Tables'];
export type Enums = Database['public']['Enums'];

export type ConversationRow = Tables['conversations']['Row'];
export type CalendarTaskRow = Tables['calendar_tasks']['Row'];
export type DocumentRow = Tables['documents']['Row'];
export type ProfileRow = Tables['profiles']['Row'];
export type UserRoleRow = Tables['user_roles']['Row'];
export type LeaveType = Enums['leave_type'];
export type LeaveStatus = Enums['leave_status'];
