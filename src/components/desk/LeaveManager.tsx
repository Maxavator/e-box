
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

export const LeaveManager = () => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [leaveType, setLeaveType] = useState<string>("");

  const leaveBalance = {
    annual: { total: 15, used: 5 },
    sick: { total: 30, used: 2 },
    maternity: { total: 120, used: 0 },
    paternity: { total: 10, used: 0 }
  };

  const handleSubmit = () => {
    if (!leaveType || selectedDates.length === 0) {
      toast.error("Please select leave type and dates");
      return;
    }
    
    toast.success("Leave request submitted successfully");
    setSelectedDates([]);
    setLeaveType("");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Leave Balance Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Leave Balance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Annual Leave</p>
                <p className="text-2xl font-bold">
                  {leaveBalance.annual.total - leaveBalance.annual.used} days
                </p>
                <p className="text-sm text-muted-foreground">
                  of {leaveBalance.annual.total} days
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Sick Leave</p>
                <p className="text-2xl font-bold">
                  {leaveBalance.sick.total - leaveBalance.sick.used} days
                </p>
                <p className="text-sm text-muted-foreground">
                  of {leaveBalance.sick.total} days
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Maternity Leave</p>
                <p className="text-2xl font-bold">
                  {leaveBalance.maternity.total - leaveBalance.maternity.used} days
                </p>
                <p className="text-sm text-muted-foreground">
                  of {leaveBalance.maternity.total} days
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Paternity Leave</p>
                <p className="text-2xl font-bold">
                  {leaveBalance.paternity.total - leaveBalance.paternity.used} days
                </p>
                <p className="text-sm text-muted-foreground">
                  of {leaveBalance.paternity.total} days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Request Leave Card */}
        <Card>
          <CardHeader>
            <CardTitle>Request Leave</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Leave Type</Label>
              <Select value={leaveType} onValueChange={setLeaveType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annual">Annual Leave</SelectItem>
                  <SelectItem value="sick">Sick Leave</SelectItem>
                  <SelectItem value="maternity">Maternity Leave</SelectItem>
                  <SelectItem value="paternity">Paternity Leave</SelectItem>
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
              />
            </div>

            <Button className="w-full" onClick={handleSubmit}>
              Submit Leave Request
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
