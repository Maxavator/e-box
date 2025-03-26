
import React from "react";
import { CalendarView } from "@/components/calendar/CalendarView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function MyCalendar() {
  const navigate = useNavigate();
  const { organizationName } = useUserProfile();
  
  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            My Calendar
            {organizationName && (
              <Badge variant="outline" className="ml-2">
                {organizationName}
              </Badge>
            )}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your schedule and appointments
          </p>
        </div>
      </div>
      
      <CalendarView />
    </div>
  );
}
