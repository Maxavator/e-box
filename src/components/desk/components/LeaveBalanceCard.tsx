
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { LeaveBalances } from "../types/leave";
import { useTranslation } from "react-i18next";

interface LeaveBalanceCardProps {
  leaveBalance: LeaveBalances;
}

export const LeaveBalanceCard = ({ leaveBalance }: LeaveBalanceCardProps) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          {t('leave.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">{t('leave.types.annual')}</p>
            <p className="text-2xl font-bold">
              {leaveBalance.annual.total - leaveBalance.annual.used} days
            </p>
            <p className="text-sm text-muted-foreground">
              {leaveBalance.annual.pending} pending requests
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">{t('leave.types.sick')}</p>
            <p className="text-2xl font-bold">
              {leaveBalance.sick.total - leaveBalance.sick.used} days
            </p>
            <p className="text-sm text-muted-foreground">
              {leaveBalance.sick.pending} pending requests
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">{t('leave.types.family')}</p>
            <p className="text-2xl font-bold">
              {leaveBalance.family.total - leaveBalance.family.used} days
            </p>
            <p className="text-sm text-muted-foreground">
              {leaveBalance.family.pending} pending requests
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">{t('leave.types.maternity')}</p>
            <p className="text-2xl font-bold">
              {leaveBalance.maternity.total - leaveBalance.maternity.used} days
            </p>
            <p className="text-sm text-muted-foreground">
              {leaveBalance.maternity.pending} pending requests
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">{t('leave.types.study')}</p>
            <p className="text-2xl font-bold">
              {leaveBalance.study.total - leaveBalance.study.used} days
            </p>
            <p className="text-sm text-muted-foreground">
              {leaveBalance.study.pending} pending requests
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">{t('leave.types.unpaid')}</p>
            <p className="text-2xl font-bold">Available</p>
            <p className="text-sm text-muted-foreground">
              Subject to approval
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
