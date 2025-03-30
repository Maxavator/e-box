
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "lucide-react";

export const ActivityOverview = () => {
  return (
    <Card className="border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Activity Overview</CardTitle>
        <LineChart className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[300px] flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-sm font-medium">Active Users</span>
            </div>
            <span className="text-2xl font-bold">1,245</span>
          </div>
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            Activity chart will be displayed here
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
