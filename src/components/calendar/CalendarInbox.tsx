
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, X, Clock } from "lucide-react";
import { toast } from "sonner";

interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  location: string | null;
  is_online: boolean;
  meeting_link: string | null;
}

interface CalendarInvite {
  id: string;
  status: string;
  event: CalendarEvent;
}

export function CalendarInbox() {
  const { data: invites, isLoading, refetch } = useQuery({
    queryKey: ['calendar-invites'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('calendar_invites')
        .select(`
          id,
          status,
          event:calendar_events (
            id,
            title,
            description,
            start_time,
            end_time,
            location,
            is_online,
            meeting_link
          )
        `)
        .eq('status', 'pending');

      if (error) throw error;
      
      // Transform the data to match the CalendarInvite interface
      const transformedData = data.map((item: any) => ({
        id: item.id,
        status: item.status,
        event: Array.isArray(item.event) && item.event.length > 0 
          ? item.event[0] 
          : {
              id: '',
              title: '',
              description: null,
              start_time: '',
              end_time: '',
              location: null,
              is_online: false,
              meeting_link: null
            }
      }));
      
      return transformedData as CalendarInvite[];
    },
  });

  const updateInviteStatus = async (inviteId: string, newStatus: string) => {
    const { error } = await supabase
      .from('calendar_invites')
      .update({ status: newStatus })
      .eq('id', inviteId);

    if (error) {
      toast.error("Failed to update invite status");
      return;
    }

    toast.success(`Invitation ${newStatus}`);
    refetch();
  };

  if (isLoading) {
    return <div className="p-4">Loading calendar invites...</div>;
  }

  return (
    <div className="h-full">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Calendar Inbox</h2>
        
        <ScrollArea className="h-[calc(100vh-10rem)]">
          <div className="space-y-4">
            {invites && invites.length > 0 ? (
              invites.map((invite) => (
                <Card key={invite.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{invite.event.title}</h3>
                      {invite.event.description && (
                        <p className="text-sm text-gray-500 mt-1">
                          {invite.event.description}
                        </p>
                      )}
                      <div className="mt-2 text-sm">
                        <p>
                          Start: {new Date(invite.event.start_time).toLocaleString()}
                        </p>
                        <p>
                          End: {new Date(invite.event.end_time).toLocaleString()}
                        </p>
                        {invite.event.location && (
                          <p className="mt-1">Location: {invite.event.location}</p>
                        )}
                        {invite.event.is_online && invite.event.meeting_link && (
                          <p className="mt-1">
                            Meeting link: <a href={invite.event.meeting_link} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{invite.event.meeting_link}</a>
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600"
                        onClick={() => updateInviteStatus(invite.id, 'accepted')}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-yellow-600"
                        onClick={() => updateInviteStatus(invite.id, 'tentative')}
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600"
                        onClick={() => updateInviteStatus(invite.id, 'declined')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-gray-500 text-center">No pending calendar invites</p>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
