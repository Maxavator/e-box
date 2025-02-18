
export interface LeaveBalance {
  total: number;
  used: number;
  pending: number;
}

export interface LeaveBalances {
  annual: LeaveBalance;
  sick: LeaveBalance;
  family: LeaveBalance;
  maternity: LeaveBalance;
  unpaid: LeaveBalance;
  study: LeaveBalance;
}

export interface LeaveRequest {
  id: number;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
  days: number;
}
