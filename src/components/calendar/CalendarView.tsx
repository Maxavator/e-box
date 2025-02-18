
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { NewEventDialog } from "./NewEventDialog";
import { useUser } from "@supabase/auth-helpers-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

type CalendarEvent = Database['public']['Tables']['calendar_events']['Row'];

export function CalendarView() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const user = useUser();

  // Fetch all events
  const { data: events, isLoading, error, refetch } = useQuery({
    queryKey: ['calendar-events'],
    queryFn: async () => {
      if (!user) throw new Error("User must be authenticated");
      
      const { data, error } = await supabase
        .from('calendar_events')
        .select(`
          *,
          calendar_invites (
            id,
            status,
            invitee_id
          )
        `);
      
      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (error) {
      toast.error("Failed to load calendar events");
    }
  }, [error]);

  // Set up real-time subscription for events
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('calendar-events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'calendar_events'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch, user]);

  const selectedDayEvents = events?.filter(event => 
    date && 
    new Date(event.start_time).getDate() === date.getDate() &&
    new Date(event.start_time).getMonth() === date.getMonth() &&
    new Date(event.start_time).getFullYear() === date.getFullYear()
  );

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">Please sign in to view your calendar</p>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="w-96 border-r p-4 bg-white">
        <div className="mb-4">
          <NewEventDialog />
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
        <div className="mt-4">
          <h3 className="font-medium mb-2">Selected Date Events</h3>
          <ScrollArea className="h-[calc(100vh-26rem)]">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : selectedDayEvents && selectedDayEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDayEvents.map(event => (
                  <Card key={event.id} className="p-4">
                    <h4 className="font-medium">{event.title}</h4>
                    {event.description && (
                      <p className="text-sm text-gray-500">{event.description}</p>
                    )}
                    <div className="text-sm text-gray-500 mt-2">
                      {new Date(event.start_time).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                      {" - "}
                      {new Date(event.end_time).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                    {event.location && (
                      <div className="text-sm text-gray-500 mt-1">
                        📍 {event.location}
                      </div>
                    )}
                    {event.is_online && event.meeting_link && (
                      <div className="text-sm text-blue-500 mt-1">
                        <a href={event.meeting_link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          🔗 Join Meeting
                        </a>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">No events scheduled for this day</p>
            )}
          </ScrollArea>
        </div>
      </div>
      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Calendar Overview</h2>
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-medium mb-4">All Events</h3>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : events && events.length > 0 ? (
                <div className="space-y-4">
                  {events
                    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
                    .map(event => (
                      <Card key={event.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{event.title}</h4>
                            {event.description && (
                              <p className="text-sm text-gray-500">{event.description}</p>
                            )}
                            {event.location && (
                              <p className="text-sm text-gray-500 mt-1">
                                📍 {event.location}
                              </p>
                            )}
                            {event.is_online && event.meeting_link && (
                              <p className="text-sm text-blue-500 mt-1">
                                <a href={event.meeting_link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                  🔗 Join Meeting
                                </a>
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {new Date(event.start_time).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(event.start_time).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                              {" - "}
                              {new Date(event.end_time).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center">No events found</p>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
