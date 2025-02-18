
import { useState } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { addDays, differenceInBusinessDays } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays } from "lucide-react";
import type { LeaveType } from "./types";

interface LeaveRequestFormProps {
  onSubmitSuccess: () => void;
}

export function LeaveRequestForm({ onSubmitSuccess }: LeaveRequestFormProps) {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<LeaveType | ''>('');
  const [dateRange, setDateRange] = useState<{ from: Date; to?: Date }>({ from: new Date() });
  const [reason, setReason] = useState("");

  const calculateBusinessDays = () => {
    if (!dateRange.from || !dateRange.to) return null;
    const days = differenceInBusinessDays(dateRange.to, dateRange.from) + 1;
    return days > 0 ? days : 0;
  };

  const handleSubmit = async () => {
    if (!selectedType || !dateRange.from || !dateRange.to || !reason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit leave requests",
        variant: "destructive"
      });
      return;
    }

    // Get admin users for notifications
    const { data: admins } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'org_admin');

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
        title: "Submission Failed",
        description: "Unable to submit your leave request. Please try again.",
        variant: "destructive"
      });
      return;
    }

    // Notify admins (this would typically be handled by a server-side function)
    if (admins) {
      for (const admin of admins) {
        await supabase
          .from('partner_messages')
          .insert({
            sender_id: user.id,
            receiver_id: admin.user_id,
            subject: 'New Leave Request Pending Approval',
            message: `A new ${selectedType} leave request has been submitted for approval.`,
            is_read: false
          });
      }
    }

    toast({
      title: "Request Submitted",
      description: "Your leave request has been submitted for approval"
    });

    setSelectedType('');
    setDateRange({ from: new Date() });
    setReason("");
    onSubmitSuccess();
  };

  return (
    <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">New Leave Request</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Leave Type
          </label>
          <Select value={selectedType} onValueChange={(value) => setSelectedType(value as LeaveType)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select leave type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="annual">Annual Leave</SelectItem>
              <SelectItem value="sick">Sick Leave</SelectItem>
              <SelectItem value="maternity">Maternity Leave</SelectItem>
              <SelectItem value="paternity">Paternity Leave</SelectItem>
              <SelectItem value="unpaid">Unpaid Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <div className="border rounded-lg p-4 bg-white">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={1}
              className="rounded-lg"
              disabled={(date) => date < addDays(new Date(), -1)}
            />
          </div>
          {dateRange.from && dateRange.to && (
            <div className="mt-2 p-3 bg-primary/5 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CalendarDays className="h-4 w-4" />
                <span>
                  {calculateBusinessDays()} business days selected
                </span>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                From: {dateRange.from.toLocaleDateString()}
                <br />
                To: {dateRange.to.toLocaleDateString()}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason for Leave
          </label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please provide details about your leave request"
            className="h-32"
          />
        </div>

        <Button onClick={handleSubmit} className="w-full">
          Submit Request for Approval
        </Button>

        <div className="text-sm text-gray-500 text-center">
          Your request will be sent to an administrator for approval
        </div>
      </div>
    </Card>
  );
}
