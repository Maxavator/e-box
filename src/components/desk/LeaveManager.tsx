
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

interface LeaveBalance {
  annual_leave: number;
  sick_leave: number;
  family_responsibility: number;
  study_leave: number;
}

interface LeaveRequest {
  id: string;
  user_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  created_at: string;
}

export function LeaveManager() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [selectedDates, setSelectedDates] = useState<Date[] | undefined>([]);
  const [leaveType, setLeaveType] = useState<string>("");
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

  const { data: recentRequests } = useQuery({
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
    if (!selectedDates || selectedDates.length !== 2 || !leaveType || !reason) {
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
        user_id: user.id,
        leave_type: leaveType,
        start_date: selectedDates[0].toISOString(),
        end_date: selectedDates[1].toISOString(),
        reason,
        status: 'pending'
      });

    if (error) {
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

    // Reset form
    setSelectedDates([]);
    setLeaveType("");
    setReason("");
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
              <h2 className="font-semibold">{t('leave.title')}</h2>
            </div>
            {leaveBalance ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{t('leave.types.annual')}</span>
                  <span className="font-medium">{leaveBalance.annual_leave} days</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('leave.types.sick')}</span>
                  <span className="font-medium">{leaveBalance.sick_leave} days</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('leave.types.family')}</span>
                  <span className="font-medium">{leaveBalance.family_responsibility} days</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('leave.types.study')}</span>
                  <span className="font-medium">{leaveBalance.study_leave} days</span>
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
              <Select value={leaveType} onValueChange={setLeaveType}>
                <SelectTrigger>
                  <SelectValue placeholder={t('leave.form.selectType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annual">{t('leave.types.annual')}</SelectItem>
                  <SelectItem value="sick">{t('leave.types.sick')}</SelectItem>
                  <SelectItem value="family">{t('leave.types.family')}</SelectItem>
                  <SelectItem value="study">{t('leave.types.study')}</SelectItem>
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
                selected={selectedDates}
                onSelect={setSelectedDates as any}
                numberOfMonths={2}
                className="rounded-md border"
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
