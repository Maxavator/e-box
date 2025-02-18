
import { LeaveBalance } from "./leave/LeaveBalance";
import { RecentRequests } from "./leave/RecentRequests";
import { LeaveRequestForm } from "./leave/LeaveRequestForm";
import { LeaveInformation } from "./leave/LeaveInformation";
import { useLeaveData } from "./leave/useLeaveData";

export function LeaveManager() {
  const { leaveBalance, recentRequests, refetchRequests, getLeaveBalance } = useLeaveData();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Leave Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <LeaveBalance 
              getLeaveBalance={getLeaveBalance}
              isLoading={!leaveBalance}
            />
            <LeaveInformation />
          </div>
          <RecentRequests requests={recentRequests} />
        </div>
        <div className="lg:col-span-1">
          <LeaveRequestForm onSubmitSuccess={refetchRequests} />
        </div>
      </div>
    </div>
  );
}
