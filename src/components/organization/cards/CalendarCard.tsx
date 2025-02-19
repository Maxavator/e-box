
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export const CalendarCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-responsive">
          <Calendar className="h-5 w-5 text-primary" />
          <span>Calendar Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Upcoming Events</p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Next event: Team Meeting (Tomorrow, 10:00 AM)
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
