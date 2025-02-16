
export type LeaveType = 'annual' | 'sick' | 'maternity' | 'paternity' | 'unpaid';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface LeaveRequest {
  id: string;
  user_id: string;
  leave_type: LeaveType;
  status: LeaveStatus;
  start_date: string;
  end_date: string;
  reason?: string;
  created_at: string;
  updated_at: string;
  approved_by?: string;
  approved_at?: string;
}
