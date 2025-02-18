
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarDays } from "lucide-react";
import type { LeaveRequest } from "./types";

interface RecentRequestsProps {
  requests: LeaveRequest[] | undefined;
}

export function RecentRequests({ requests }: RecentRequestsProps) {
  const { t } = useTranslation();

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="h-5 w-5 text-primary" />
        <h2 className="font-semibold">{t('leave.recentRequests')}</h2>
      </div>
      <ScrollArea className="h-[200px]">
        {requests?.map((request) => (
          <div key={request.id} className="p-3 border-b last:border-0">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{t(`leave.types.${request.leave_type}`)}</p>
                <p className="text-sm text-gray-500">
                  {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                request.status === 'approved' ? 'bg-green-100 text-green-800' :
                request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {request.status}
              </span>
            </div>
          </div>
        ))}
      </ScrollArea>
    </Card>
  );
}
