
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Shield } from "lucide-react";

export const PerformanceCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-responsive">
          <BarChart className="h-5 w-5 text-primary" />
          <span>Performance</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">System Health</p>
              <p className="text-2xl font-bold">98%</p>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
              <BarChart className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            All systems operational
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const SecurityCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-responsive">
          <Shield className="h-5 w-5 text-primary" />
          <span>Security</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Security Score</p>
              <p className="text-2xl font-bold">A+</p>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Last scan: 24 hours ago
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
