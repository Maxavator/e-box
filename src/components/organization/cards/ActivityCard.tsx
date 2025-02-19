
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users } from "lucide-react";

export const ActivityCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-responsive">
          <Clock className="h-5 w-5 text-primary" />
          <span>Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Active Users</p>
              <p className="text-2xl font-bold">18</p>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Peak hours: 10 AM - 2 PM
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
