
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, Users, Clock } from "lucide-react";
import { useState } from "react";

export function CalendarDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const { data: pendingInvites } = useQuery({
    queryKey: ['pending-invites'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('calendar_invites')
        .select('*')
        .eq('status', 'pending');
      if (error) throw error;
      return data;
    }
  });

  const { data: upcomingEvents } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(5);
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Calendar Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Calendar Widget */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Calendar</h2>
          </div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </Card>

        {/* Pending Invites */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Pending Invites</h2>
          </div>
          <ScrollArea className="h-[300px]">
            {pendingInvites && pendingInvites.length > 0 ? (
              <div className="space-y-3">
                {pendingInvites.map((invite) => (
                  <Card key={invite.id} className="p-3">
                    <p className="font-medium">{invite.event_id}</p>
                    <p className="text-sm text-gray-500">Awaiting Response</p>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">No pending invites</p>
            )}
          </ScrollArea>
        </Card>

        {/* Upcoming Events */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Upcoming Events</h2>
          </div>
          <ScrollArea className="h-[300px]">
            {upcomingEvents && upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <Card key={event.id} className="p-3">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(event.start_time).toLocaleDateString()}
                    </p>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">No upcoming events</p>
            )}
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
