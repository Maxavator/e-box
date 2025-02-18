
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { LeaveBalance, LeaveRequest } from "./types";

export function useLeaveData() {
  const { data: leaveBalance } = useQuery({
    queryKey: ['leave-balance'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('leave_balances')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      return data as LeaveBalance;
    }
  });

  const { data: recentRequests, refetch: refetchRequests } = useQuery({
    queryKey: ['leave-requests'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('leave_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data as LeaveRequest[];
    }
  });

  const getLeaveBalance = (type: string) => {
    if (!leaveBalance) return 0;
    switch (type) {
      case 'annual':
        return leaveBalance.annual_days_total - leaveBalance.annual_days_used;
      case 'sick':
        return leaveBalance.sick_days_total - leaveBalance.sick_days_used;
      case 'maternity':
        return leaveBalance.maternity_days_total - leaveBalance.maternity_days_used;
      case 'paternity':
        return leaveBalance.paternity_days_total - leaveBalance.paternity_days_used;
      default:
        return 0;
    }
  };

  return {
    leaveBalance,
    recentRequests,
    refetchRequests,
    getLeaveBalance
  };
}
