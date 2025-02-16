
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@supabase/auth-helpers-react";

export function LeaveBalances() {
  const user = useAuth();

  const { data: leaveBalances, isLoading } = useQuery({
    queryKey: ['leaveBalances', user?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leave_balances')
        .select('*')
        .eq('user_id', user?.user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.user?.id,
  });

  if (isLoading) {
    return <div className="p-4">Loading leave balances...</div>;
  }

  const leaveTypes = [
    {
      name: 'Annual Leave',
      total: leaveBalances?.annual_days_total || 0,
      used: leaveBalances?.annual_days_used || 0,
      color: 'bg-blue-500',
    },
    {
      name: 'Sick Leave',
      total: leaveBalances?.sick_days_total || 0,
      used: leaveBalances?.sick_days_used || 0,
      color: 'bg-orange-500',
    },
    {
      name: 'Maternity Leave',
      total: leaveBalances?.maternity_days_total || 0,
      used: leaveBalances?.maternity_days_used || 0,
      color: 'bg-purple-500',
    },
    {
      name: 'Paternity Leave',
      total: leaveBalances?.paternity_days_total || 0,
      used: leaveBalances?.paternity_days_used || 0,
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {leaveTypes.map((leave) => (
        <Card key={leave.name}>
          <CardHeader>
            <CardTitle className="text-lg">{leave.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Progress 
                value={(leave.used / leave.total) * 100} 
                className={`h-2 ${leave.color}`}
              />
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Used: {leave.used} days
                </span>
                <span className="text-gray-500">
                  Remaining: {leave.total - leave.used} days
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
