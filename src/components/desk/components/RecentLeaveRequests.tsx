
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { LeaveRequest } from "../types/leave";
import { useTranslation } from "react-i18next";

interface RecentLeaveRequestsProps {
  requests: LeaveRequest[];
  getStatusColor: (status: string) => string;
}

export const RecentLeaveRequests = ({ requests, getStatusColor }: RecentLeaveRequestsProps) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {t('leave.recentRequests')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.map((request) => (
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
  );
};
