
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Clock, User } from "lucide-react";

export const LeaveManager = () => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [leaveType, setLeaveType] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  // Updated leave balances according to South African labor law
  const leaveBalance = {
    annual: { total: 21, used: 5, pending: 2 }, // 21 consecutive days annual leave
    sick: { total: 30, used: 2, pending: 0 }, // 30 days in a 36-month cycle
    family: { total: 3, used: 0, pending: 0 }, // 3 days family responsibility leave
    maternity: { total: 120, used: 0, pending: 0 }, // 4 months maternity leave
    unpaid: { total: 0, used: 0, pending: 0 }, // Unpaid leave - no limit
    study: { total: 10, used: 0, pending: 0 } // Study leave - company specific
  };

  const recentLeaveRequests = [
    { 
      id: 1, 
      type: 'Annual Leave', 
      startDate: '2024-04-15', 
      endDate: '2024-04-18',
      status: 'Approved',
      days: 4
    },
    { 
      id: 2, 
      type: 'Sick Leave', 
      startDate: '2024-03-25', 
      endDate: '2024-03-25',
      status: 'Completed',
      days: 1
    },
    { 
      id: 3, 
      type: 'Annual Leave', 
      startDate: '2024-05-01', 
      endDate: '2024-05-03',
      status: 'Pending',
      days: 3
    }
  ];

  const handleSubmit = () => {
    if (!leaveType || selectedDates.length === 0) {
      toast.error("Please select leave type and dates");
      return;
    }

    if (!reason.trim()) {
      toast.error("Please provide a reason for your leave");
      return;
    }
    
    toast.success("Leave request submitted successfully");
    setSelectedDates([]);
    setLeaveType("");
    setReason("");
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'completed':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Leave Balance Cards */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Leave Balance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Annual Leave</p>
                  <p className="text-2xl font-bold">
                    {leaveBalance.annual.total - leaveBalance.annual.used} days
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {leaveBalance.annual.pending} pending requests
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Sick Leave</p>
                  <p className="text-2xl font-bold">
                    {leaveBalance.sick.total - leaveBalance.sick.used} days
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {leaveBalance.sick.pending} pending requests
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Family Responsibility</p>
                  <p className="text-2xl font-bold">
                    {leaveBalance.family.total - leaveBalance.family.used} days
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {leaveBalance.family.pending} pending requests
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Maternity Leave</p>
                  <p className="text-2xl font-bold">
                    {leaveBalance.maternity.total - leaveBalance.maternity.used} days
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {leaveBalance.maternity.pending} pending requests
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Study Leave</p>
                  <p className="text-2xl font-bold">
                    {leaveBalance.study.total - leaveBalance.study.used} days
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {leaveBalance.study.pending} pending requests
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Unpaid Leave</p>
                  <p className="text-2xl font-bold">Available</p>
                  <p className="text-sm text-muted-foreground">
                    Subject to approval
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Leave Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentLeaveRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{request.type}</p>
                      <p className="text-sm text-gray-600">
                        {request.startDate} - {request.endDate} ({request.days} days)
                      </p>
                    </div>
                    <span className={`font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Request Leave Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Request Leave
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Leave Type</Label>
              <Select value={leaveType} onValueChange={setLeaveType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annual">Annual Leave (21 days per year)</SelectItem>
                  <SelectItem value="sick">Sick Leave (30 days per 36 months)</SelectItem>
                  <SelectItem value="family">Family Responsibility (3 days per year)</SelectItem>
                  <SelectItem value="maternity">Maternity Leave (4 months)</SelectItem>
                  <SelectItem value="study">Study Leave (10 days per year)</SelectItem>
                  <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Select Dates</Label>
              <Calendar
                mode="multiple"
                selected={selectedDates}
                onSelect={setSelectedDates as any}
                className="rounded-md border"
                numberOfMonths={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Reason for Leave</Label>
              <Textarea
                placeholder="Please provide a reason for your leave request..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Selected: {selectedDates.length} days
              </p>
              <Button className="w-full" onClick={handleSubmit}>
                Submit Leave Request
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
