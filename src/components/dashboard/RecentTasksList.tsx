
import React from "react";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Task {
  title: string;
  description: string;
  time: string;
  category: string;
  statusColor: string;
}

interface RecentTasksListProps {
  tasks: Task[];
}

export const RecentTasksList = ({ tasks }: RecentTasksListProps) => {
  return (
    <Card className="border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Tasks</CardTitle>
        <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="p-6">
        <ScrollArea className="h-[300px] pr-4">
          {tasks.map((task, index) => (
            <div 
              key={index}
              className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors mb-2 cursor-pointer"
            >
              <div className={`w-2 h-2 mt-2 rounded-full ${task.statusColor}`} />
              <div>
                <h4 className="font-medium">{task.title}</h4>
                <p className="text-sm text-muted-foreground">{task.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">{task.time}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {task.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
