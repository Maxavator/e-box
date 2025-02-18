
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarDays } from "lucide-react";
import type { LeaveRequest } from "./types";

interface RecentRequestsProps {
  requests: LeaveRequest[] | undefined;
}

export function RecentRequests({ requests }: RecentRequestsProps) {
  const getLeaveTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1) + ' Leave';
  };

  return (
    <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
      <div className="flex items-center gap-3 mb-6">
        <CalendarDays className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold text-gray-900">Recent Requests</h2>
      </div>
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-4">
          {requests?.map((request) => (
            <div key={request.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="font-semibold text-gray-900">{getLeaveTypeLabel(request.leave_type)}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(request.start_date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })} - {new Date(request.end_date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                  {request.reason && (
                    <p className="text-sm text-gray-500 mt-2">{request.reason}</p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  request.status === 'approved' ? 'bg-green-100 text-green-800' :
                  request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
          {(!requests || requests.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              No recent leave requests
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
