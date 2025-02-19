
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Bell, BarChart } from "lucide-react";

export const QuickActionsCard = () => {
  return (
    <Card className="bg-white hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Button className="w-full justify-start" variant="outline">
            <Shield className="w-4 h-4 mr-2" />
            Security Audit
          </Button>
          <Button className="w-full justify-start" variant="outline">
            <Bell className="w-4 h-4 mr-2" />
            View System Alerts
          </Button>
          <Button className="w-full justify-start" variant="outline">
            <BarChart className="w-4 h-4 mr-2" />
            Generate Reports
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
