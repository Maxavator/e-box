
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Bell } from "lucide-react";

export const AlertsCard = () => {
  return (
    <Card className="bg-white hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">Recent Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-700">Failed Login Attempts</h4>
              <p className="text-sm text-red-600">Multiple failed login attempts detected from IP 192.168.1.1</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
            <Bell className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-700">System Update Required</h4>
              <p className="text-sm text-yellow-600">New security patches available for installation</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
