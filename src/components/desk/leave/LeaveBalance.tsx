
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface LeaveBalanceProps {
  getLeaveBalance: (type: string) => number;
  isLoading: boolean;
}

export function LeaveBalance({ getLeaveBalance, isLoading }: LeaveBalanceProps) {
  const { t } = useTranslation();

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-primary" />
        <h2 className="font-semibold">{t('leave.balance')}</h2>
      </div>
      {!isLoading ? (
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>{t('leave.types.annual')}</span>
            <span className="font-medium">{getLeaveBalance('annual')} days</span>
          </div>
          <div className="flex justify-between">
            <span>{t('leave.types.sick')}</span>
            <span className="font-medium">{getLeaveBalance('sick')} days</span>
          </div>
          <div className="flex justify-between">
            <span>{t('leave.types.maternity')}</span>
            <span className="font-medium">{getLeaveBalance('maternity')} days</span>
          </div>
          <div className="flex justify-between">
            <span>{t('leave.types.paternity')}</span>
            <span className="font-medium">{getLeaveBalance('paternity')} days</span>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center">Loading leave balance...</p>
      )}
    </Card>
  );
}
