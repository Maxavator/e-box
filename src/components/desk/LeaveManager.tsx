
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "./components/LanguageSelector";
import { LeaveBalanceCard } from "./components/LeaveBalanceCard";
import { RecentLeaveRequests } from "./components/RecentLeaveRequests";
import { LeaveRequestForm } from "./components/LeaveRequestForm";
import { LegalReference } from "./components/LegalReference";
import { LeaveRequest } from "./types/leave";
import "../i18n/config";

export const LeaveManager = () => {
  const { t } = useTranslation();
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [leaveType, setLeaveType] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  const leaveBalance = {
    annual: { total: 21, used: 5, pending: 2 },
    sick: { total: 30, used: 2, pending: 0 },
    family: { total: 3, used: 0, pending: 0 },
    maternity: { total: 120, used: 0, pending: 0 },
    unpaid: { total: 0, used: 0, pending: 0 },
    study: { total: 10, used: 0, pending: 0 }
  };

  const recentLeaveRequests: LeaveRequest[] = [
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
      <div className="flex justify-end mb-4">
        <LanguageSelector />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <LeaveBalanceCard leaveBalance={leaveBalance} />
          <RecentLeaveRequests 
            requests={recentLeaveRequests}
            getStatusColor={getStatusColor}
          />
        </div>

        <LeaveRequestForm
          selectedDates={selectedDates}
          leaveType={leaveType}
          reason={reason}
          onDatesChange={setSelectedDates}
          onLeaveTypeChange={setLeaveType}
          onReasonChange={setReason}
          onSubmit={handleSubmit}
        />
      </div>

      <LegalReference />
    </div>
  );
};
