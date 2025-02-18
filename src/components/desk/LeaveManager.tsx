
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { CalendarDays, Clock } from "lucide-react";
import { addDays } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type LeaveType = Database["public"]["Enums"]["leave_type"];
type LeaveStatus = Database["public"]["Enums"]["leave_status"];

interface LeaveBalance {
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

interface LeaveRequest {
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

export function LeaveManager() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<LeaveType | ''>('');
  const [dateRange, setDateRange] = useState<{ from: Date; to?: Date }>({ from: new Date() });
  const [reason, setReason] = useState("");

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

  const handleSubmit = async () => {
    if (!selectedType || !dateRange.from || !dateRange.to || !reason) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please login to submit leave requests",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('leave_requests')
      .insert({
        leave_type: selectedType,
        start_date: dateRange.from.toISOString(),
        end_date: dateRange.to.toISOString(),
        reason,
        user_id: user.id,
        status: 'pending'
      });

    if (error) {
      console.error('Error submitting leave request:', error);
      toast({
        title: "Error",
        description: "Failed to submit leave request",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Leave request submitted successfully"
    });

    // Reset form and refresh data
    setSelectedType('');
    setDateRange({ from: new Date() });
    setReason("");
    refetchRequests();
  };

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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{t('leave.title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Leave Balance */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">{t('leave.balance')}</h2>
            </div>
            {leaveBalance ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{t('leave.types.annual')}</span>
                  <span className="font-medium">{getLeaveBalance('annual')} days</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('leave.types.sick')}</span>
                  <span className="font-medium">{getLeaveBalance('sick')} days</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('leave.types.maternity')}</span>
                  <span className="font-medium">{getLeaveBalance('maternity')} days</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('leave.types.paternity')}</span>
                  <span className="font-medium">{getLeaveBalance('paternity')} days</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center">Loading leave balance...</p>
            )}
          </Card>

          {/* Recent Requests */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">{t('leave.recentRequests')}</h2>
            </div>
            <ScrollArea className="h-[200px]">
              {recentRequests?.map((request) => (
                <div key={request.id} className="p-3 border-b last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{t(`leave.types.${request.leave_type}`)}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      request.status === 'approved' ? 'bg-green-100 text-green-800' :
                      request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </Card>
        </div>

        {/* Leave Request Form */}
        <Card className="p-4">
          <h2 className="font-semibold mb-4">{t('leave.request')}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('leave.form.typeLabel')}
              </label>
              <Select value={selectedType} onValueChange={(value) => setSelectedType(value as LeaveType)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('leave.form.selectType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annual">{t('leave.types.annual')}</SelectItem>
                  <SelectItem value="sick">{t('leave.types.sick')}</SelectItem>
                  <SelectItem value="maternity">{t('leave.types.maternity')}</SelectItem>
                  <SelectItem value="paternity">{t('leave.types.paternity')}</SelectItem>
                  <SelectItem value="unpaid">{t('leave.types.unpaid')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('leave.form.datesLabel')}
              </label>
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                className="rounded-md border"
                disabled={(date) => date < addDays(new Date(), -1)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('leave.form.reasonLabel')}
              </label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={t('leave.form.reasonPlaceholder')}
              />
            </div>

            <Button onClick={handleSubmit} className="w-full">
              {t('leave.form.submit')}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
