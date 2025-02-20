
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, MessageSquare } from "lucide-react";

export const ActivitySection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">New payslip available</p>
              <p className="text-sm text-gray-500">March 2024 payslip has been uploaded</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-2 rounded-full">
              <Calendar className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium">Team meeting scheduled</p>
              <p className="text-sm text-gray-500">Tomorrow at 10:00 AM</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-2 rounded-full">
              <MessageSquare className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="font-medium">New message from HR</p>
              <p className="text-sm text-gray-500">Regarding your recent request</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
