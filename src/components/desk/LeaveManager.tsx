
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { LeaveRequest, LeaveType } from "@/types/leave";
import { useUser } from "@supabase/auth-helpers-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Clock } from "lucide-react";
import type { DateRange } from "react-day-picker";

export function LeaveManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [leaveType, setLeaveType] = useState<LeaveType>("annual");
  const [reason, setReason] = useState("");
  const user = useUser();

  const { data: leaveRequests, refetch } = useQuery({
    queryKey: ['leave-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leave_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as LeaveRequest[];
    },
    enabled: !!user,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateRange?.from || !dateRange?.to || !user) {
      toast.error("Please select start and end dates");
      return;
    }

    try {
      const { error } = await supabase
        .from('leave_requests')
        .insert({
          leave_type: leaveType,
          start_date: dateRange.from.toISOString(),
          end_date: dateRange.to.toISOString(),
          reason,
          user_id: user.id,
        });

      if (error) throw error;

      toast.success("Leave request submitted successfully");
      setIsOpen(false);
      setDateRange(undefined);
      setReason("");
      refetch();
    } catch (error) {
      toast.error("Failed to submit leave request");
      console.error("Error submitting leave request:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-50';
      case 'rejected':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Leave Management</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Request Leave</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>New Leave Request</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Leave Type</label>
                <Select
                  value={leaveType}
                  onValueChange={(value) => setLeaveType(value as LeaveType)}
                >
                  <SelectTrigger>
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

              <div className="space-y-2">
                <label className="text-sm font-medium">Select Dates</label>
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  className="rounded-md border"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Reason</label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please provide a reason for your leave request"
                />
              </div>

              <Button type="submit" className="w-full">
                Submit Request
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">My Requests</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          {leaveRequests?.map((request) => (
            <Card key={request.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {request.leave_type.charAt(0).toUpperCase() + request.leave_type.slice(1)} Leave
                </CardTitle>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(new Date(request.start_date), 'PP')} - {format(new Date(request.end_date), 'PP')}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="mr-2 h-4 w-4" />
                    Requested on {format(new Date(request.created_at), 'PP')}
                  </div>
                  {request.reason && (
                    <p className="text-sm text-gray-500 mt-2">{request.reason}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {(!leaveRequests || leaveRequests.length === 0) && (
            <div className="text-center text-gray-500 py-8">
              No leave requests found
            </div>
          )}
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <Calendar
                mode="single"
                selected={new Date()}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
