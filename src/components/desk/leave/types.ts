
import type { Database } from "@/integrations/supabase/types";

export type LeaveType = Database["public"]["Enums"]["leave_type"];
export type LeaveStatus = Database["public"]["Enums"]["leave_status"];

export interface LeaveBalance {
  id: string;
  user_id: string;
  annual_days_total: number;
  annual_days_used: number;
  sick_days_total: number;
  sick_days_used: number;
  maternity_days_total: number;
  maternity_days_used: number;
  paternity_days_total: number;
  paternity_days_used: number;
  created_at: string;
  updated_at: string;
}

export interface LeaveRequest {
  id: string;
  user_id: string;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  status: LeaveStatus;
  reason: string | null;
  created_at: string;
  approved_at: string | null;
  approved_by: string | null;
  updated_at: string;
}
