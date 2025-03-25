
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, Users, Clock, MapPin, Calendar as CalendarIcon, Inbox, PlusCircle } from "lucide-react";
import { TaskManager } from "@/components/calendar/TaskManager";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SouthAfricanHolidays } from "@/components/calendar/SouthAfricanHolidays";
import { Button } from "@/components/ui/button";
import { CalendarView } from "@/components/calendar/CalendarView";
import { CalendarInbox } from "@/components/calendar/CalendarInbox";
import { ProposedTimesList } from "@/components/calendar/ProposedTimesList";
import { useChat } from "@/hooks/use-chat";
import { Badge } from "@/components/ui/badge";
import { NewEventDialog } from "@/components/calendar/NewEventDialog";

export function Calendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState("calendar");
  const { calendarView, setCalendarView } = useChat();
  const { toast } = useToast();

  // Fetch pending invites count for badge
  const { data: pendingInvitesCount } = useQuery({
    queryKey: ['pending-invites-count'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) return 0;
      
      const { count, error } = await supabase
        .from('calendar_event_invites')
        .select('*', { count: 'exact', head: true })
        .eq('invitee_id', user.user.id)
        .eq('status', 'pending');
      
      if (error) {
        console.error('Error fetching pending invites count:', error);
        return 0;
      }
      
      return count || 0;
    },
    refetchInterval: 60000 // Refetch every minute
  });

  // Fetch proposed times count for badge
  const { data: proposedTimesCount } = useQuery({
    queryKey: ['proposed-times-count'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) return 0;
      
      const { count, error } = await supabase
        .from('calendar_event_invites')
        .select('*, event:event_id!inner(created_by)', { count: 'exact', head: true })
        .eq('status', 'proposed')
        .eq('event.created_by', user.user.id);
      
      if (error) {
        console.error('Error fetching proposed times count:', error);
        return 0;
      }
      
      return count || 0;
    },
    refetchInterval: 60000 // Refetch every minute
  });

  // Fetch upcoming events (next 5 days) for calendar overview
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

  // Get upcoming holidays (next 3)
  const upcomingHolidays = getUpcomingHolidays(3);

  // Conditional rendering based on view
  if (activeTab === "manage") {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Calendar Management</h1>
          <div className="flex gap-2">
            <Button 
              variant={calendarView === "calendar" ? "default" : "outline"} 
              onClick={() => setCalendarView("calendar")}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Calendar View
            </Button>
            <Button 
              variant={calendarView === "inbox" ? "default" : "outline"} 
              onClick={() => setCalendarView("inbox")}
              className="relative"
            >
              <Inbox className="h-4 w-4 mr-2" />
              Inbox
              {pendingInvitesCount && pendingInvitesCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                  {pendingInvitesCount}
                </Badge>
              )}
            </Button>
            <Button 
              variant={calendarView === "proposed" ? "default" : "outline"} 
              onClick={() => setCalendarView("proposed")}
              className="relative"
            >
              <Clock className="h-4 w-4 mr-2" />
              Proposed Times
              {proposedTimesCount && proposedTimesCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                  {proposedTimesCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
        
        {calendarView === "calendar" && <CalendarView />}
        {calendarView === "inbox" && <CalendarInbox />}
        {calendarView === "proposed" && <ProposedTimesList />}
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">My Calendar</h1>
          <Button onClick={() => setActiveTab("manage")}>Manage Calendar</Button>
        </div>
        <div className="mt-4">
          <NewEventDialog />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="calendar">My Calendar</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="holidays">SA Public Holidays</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar">
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
              <div className="mt-4">
                <Button variant="outline" className="w-full gap-2" onClick={() => document.querySelector<HTMLButtonElement>('.new-meeting-dialog-trigger')?.click()}>
                  <PlusCircle className="h-4 w-4" />
                  New Meeting
                </Button>
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
            <div className="grid grid-cols-1 gap-8">
              <TaskManager />
              
              {/* Notifications Section */}
              <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Inbox className="h-6 w-6 text-primary" />
                    <h2 className="text-xl font-semibold text-gray-900">Calendar Notifications</h2>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-md border bg-blue-50 border-blue-200">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Inbox className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-blue-800">
                          {pendingInvitesCount || 0} pending invitation{pendingInvitesCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                      onClick={() => {
                        setActiveTab("manage");
                        setCalendarView("inbox");
                      }}
                      disabled={!pendingInvitesCount}
                    >
                      View
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-md border bg-amber-50 border-amber-200">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center">
                        <Clock className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium text-amber-800">
                          {proposedTimesCount || 0} proposed time change{proposedTimesCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-amber-600 hover:text-amber-800 hover:bg-amber-100"
                      onClick={() => {
                        setActiveTab("manage");
                        setCalendarView("proposed");
                      }}
                      disabled={!proposedTimesCount}
                    >
                      Review
                    </Button>
                  </div>
                </div>
              </Card>
              
              {/* Upcoming Holidays Preview Card */}
              <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-6 w-6 text-primary" />
                    <h2 className="text-xl font-semibold text-gray-900">Upcoming Holidays</h2>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setActiveTab("holidays")}
                  >
                    View All
                  </Button>
                </div>
                <div className="space-y-3">
                  {upcomingHolidays.map((holiday) => (
                    <div 
                      key={holiday.id} 
                      className="p-3 rounded-md border bg-green-50 border-green-200"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-green-800">{holiday.name}</h3>
                          <p className="text-sm text-green-700 mt-1">
                            {new Date(holiday.date).toLocaleDateString('en-ZA', {
                              day: 'numeric',
                              month: 'long'
                            })}
                          </p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                          {getDaysUntil(holiday.date)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="tasks">
          <div className="grid grid-cols-1">
            <TaskManager fullWidth />
          </div>
        </TabsContent>
        
        <TabsContent value="holidays">
          <SouthAfricanHolidays />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper function to get upcoming holidays
function getUpcomingHolidays(count: number) {
  const currentDate = new Date();
  
  // Import holidays from SouthAfricanHolidays component
  const allHolidays = [
    {
      id: 1,
      name: "New Year's Day",
      date: "2024-01-01",
      description: "The first day of the calendar year celebrated across South Africa.",
      type: "public"
    },
    {
      id: 2,
      name: "Human Rights Day",
      date: "2024-03-21",
      description: "Commemorates the Sharpeville massacre of 1960, when police opened fire on a peaceful protest against pass laws.",
      type: "public"
    },
    {
      id: 3,
      name: "Good Friday",
      date: "2024-03-29",
      description: "Christian holiday commemorating the crucifixion of Jesus Christ.",
      type: "public"
    },
    {
      id: 4,
      name: "Family Day",
      date: "2024-04-01",
      description: "The day after Easter Sunday, also known as Easter Monday in South Africa.",
      type: "public"
    },
    {
      id: 5,
      name: "Freedom Day",
      date: "2024-04-27",
      description: "Celebrates South Africa's first democratic elections held in 1994.",
      type: "public"
    },
    {
      id: 6,
      name: "Workers' Day",
      date: "2024-05-01",
      description: "International Workers' Day celebrating the achievements of workers worldwide.",
      type: "public"
    },
    {
      id: 7,
      name: "Youth Day",
      date: "2024-06-16",
      description: "Commemorates the Soweto uprising of 1976, when students protested against Afrikaans as a medium of instruction.",
      type: "public"
    },
    {
      id: 8,
      name: "National Women's Day",
      date: "2024-08-09",
      description: "Commemorates the 1956 march of women to the Union Buildings against pass laws.",
      type: "public"
    },
    {
      id: 9,
      name: "Heritage Day",
      date: "2024-09-24",
      description: "Celebrates South Africa's diverse cultural heritage, often celebrated as 'Braai Day'.",
      type: "public"
    },
    {
      id: 10,
      name: "Day of Reconciliation",
      date: "2024-12-16",
      description: "Promotes reconciliation and national unity, formerly known as the Day of the Vow or Dingane's Day.",
      type: "public"
    },
    {
      id: 11,
      name: "Christmas Day",
      date: "2024-12-25",
      description: "Christian holiday celebrating the birth of Jesus Christ, widely observed as a cultural holiday.",
      type: "public"
    },
    {
      id: 12,
      name: "Day of Goodwill",
      date: "2024-12-26",
      description: "Also known as Boxing Day, traditionally a day for giving gifts to those less fortunate.",
      type: "public"
    },
    {
      id: 13,
      name: "Election Day",
      date: "2024-05-29",
      description: "2024 South African General Election Day, declared a public holiday.",
      type: "public"
    }
  ];
  
  // Filter to get only upcoming holidays
  return allHolidays
    .filter(holiday => new Date(holiday.date) >= currentDate)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, count);
}

// Helper function to display days until holiday
function getDaysUntil(dateString: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const holidayDate = new Date(dateString);
  holidayDate.setHours(0, 0, 0, 0);
  
  const diffTime = holidayDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  return `In ${diffDays} days`;
}
