
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, Users, Clock, MapPin } from "lucide-react";
import { TaskManager } from "@/components/calendar/TaskManager";
import { useToast } from "@/components/ui/use-toast";

export function Calendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const { data: events, isError } = useQuery({
    queryKey: ['calendar-events'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to view your calendar events",
          variant: "destructive",
        });
        return [];
      }

      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(5);

      if (error) {
        console.error('Error fetching events:', error);
        toast({
          title: "Error",
          description: "Failed to load calendar events",
          variant: "destructive",
        });
        return [];
      }

      return data || [];
    },
    retry: false
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Calendar</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Calendar Widget */}
        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center gap-2 mb-6">
            <CalendarDays className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-gray-900">Calendar</h2>
          </div>
          <div className="border rounded-lg p-4 bg-white">
            <CalendarUI
              mode="single"
              selected={date}
              onSelect={setDate}
              className="mx-auto"
            />
          </div>
        </Card>

        {/* Today's Schedule */}
        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-gray-900">Today's Schedule</h2>
          </div>
          <ScrollArea className="h-[400px] pr-4">
            {events && events.length > 0 ? (
              <div className="space-y-4">
                {events.map((event) => (
                  <Card key={event.id} className="p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-gray-900">{event.title}</h3>
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm">
                          {new Date(event.start_time).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Clock className="h-12 w-12 mb-2 text-gray-400" />
                <p>{isError ? "Failed to load events" : "No events scheduled for today"}</p>
              </div>
            )}
          </ScrollArea>
        </Card>

        {/* Task Manager */}
        <TaskManager />
      </div>
    </div>
  );
}
