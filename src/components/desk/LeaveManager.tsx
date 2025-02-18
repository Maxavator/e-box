
import { useTranslation } from "react-i18next";
import { LeaveBalance } from "./leave/LeaveBalance";
import { RecentRequests } from "./leave/RecentRequests";
import { LeaveRequestForm } from "./leave/LeaveRequestForm";
import { useLeaveData } from "./leave/useLeaveData";

export function LeaveManager() {
  const { t } = useTranslation();
  const { leaveBalance, recentRequests, refetchRequests, getLeaveBalance } = useLeaveData();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{t('leave.title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <LeaveBalance 
            getLeaveBalance={getLeaveBalance}
            isLoading={!leaveBalance}
          />
          <RecentRequests requests={recentRequests} />
        </div>
        <LeaveRequestForm onSubmitSuccess={refetchRequests} />
      </div>
    </div>
  );
}
