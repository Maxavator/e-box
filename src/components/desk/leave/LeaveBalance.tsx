
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface LeaveBalanceProps {
  getLeaveBalance: (type: string) => number;
  isLoading: boolean;
}

export function LeaveBalance({ getLeaveBalance, isLoading }: LeaveBalanceProps) {
  return (
    <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold text-gray-900">Leave Balance</h2>
      </div>
      {!isLoading ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="font-medium text-gray-700">Annual Leave</span>
            <span className="font-semibold text-primary">{getLeaveBalance('annual')} days</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="font-medium text-gray-700">Sick Leave</span>
            <span className="font-semibold text-primary">{getLeaveBalance('sick')} days</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="font-medium text-gray-700">Maternity Leave</span>
            <span className="font-semibold text-primary">{getLeaveBalance('maternity')} days</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="font-medium text-gray-700">Paternity Leave</span>
            <span className="font-semibold text-primary">{getLeaveBalance('paternity')} days</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-48">
          <p className="text-gray-500">Loading leave balance...</p>
        </div>
      )}
    </Card>
  );
}
