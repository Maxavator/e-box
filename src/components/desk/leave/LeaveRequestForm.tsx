
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
import { addDays } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import type { LeaveType } from "./types";

interface LeaveRequestFormProps {
  onSubmitSuccess: () => void;
}

export function LeaveRequestForm({ onSubmitSuccess }: LeaveRequestFormProps) {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<LeaveType | ''>('');
  const [dateRange, setDateRange] = useState<{ from: Date; to?: Date }>({ from: new Date() });
  const [reason, setReason] = useState("");

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

    toast({
      title: "Request Submitted",
      description: "Your leave request has been submitted successfully"
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
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
            className="rounded-lg border shadow-sm"
            disabled={(date) => date < addDays(new Date(), -1)}
          />
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
          Submit Request
        </Button>
      </div>
    </Card>
  );
}
