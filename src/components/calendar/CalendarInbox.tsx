
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, X, Clock, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
  const [proposeTimeOpen, setProposeTimeOpen] = useState(false);
  const [currentInvite, setCurrentInvite] = useState<CalendarInvite | null>(null);
  const [proposedStartTime, setProposedStartTime] = useState('');
  const [proposedEndTime, setProposedEndTime] = useState('');
  const [proposalMessage, setProposalMessage] = useState('');

  const { data: invites, isLoading, refetch } = useQuery({
    queryKey: ['calendar-invites'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('calendar_event_invites')
        .select(`
          id,
          status,
          event:event_id (
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
        event: item.event
      }));
      
      return transformedData as CalendarInvite[];
    },
  });

  const updateInviteStatus = async (inviteId: string, newStatus: string) => {
    const { error } = await supabase
      .from('calendar_event_invites')
      .update({ status: newStatus })
      .eq('id', inviteId);

    if (error) {
      toast.error("Failed to update invite status");
      return;
    }

    toast.success(`Invitation ${newStatus}`);
    refetch();
  };

  const openProposeTimeDialog = (invite: CalendarInvite) => {
    setCurrentInvite(invite);
    
    // Set default values from the original event
    const eventStart = new Date(invite.event.start_time);
    const eventEnd = new Date(invite.event.end_time);
    
    // Format the dates for the input fields (YYYY-MM-DDThh:mm)
    setProposedStartTime(formatDateTimeLocal(eventStart));
    setProposedEndTime(formatDateTimeLocal(eventEnd));
    
    setProposeTimeOpen(true);
  };

  const formatDateTimeLocal = (date: Date) => {
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const handleProposeTime = async () => {
    if (!currentInvite) return;
    
    const startTime = new Date(proposedStartTime);
    const endTime = new Date(proposedEndTime);
    
    const { error } = await supabase
      .from('calendar_event_invites')
      .update({
        status: 'proposed',
        proposed_start_time: startTime.toISOString(),
        proposed_end_time: endTime.toISOString(),
        proposal_message: proposalMessage
      })
      .eq('id', currentInvite.id);

    if (error) {
      toast.error("Failed to propose new time");
      console.error("Error proposing time:", error);
      return;
    }

    toast.success("Alternative time proposed");
    setProposeTimeOpen(false);
    refetch();
    
    // Send notification
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', userData.user.id)
        .single();
      
      const userName = profile ? `${profile.first_name} ${profile.last_name}` : "A user";
      
      await supabase.from('notifications').insert({
        subject: "Calendar Invitation Response",
        message: `${userName} proposed a different time for "${currentInvite.event.title}"`,
        receiver_id: currentInvite.event.id, // This should be the event creator
        sender_id: userData.user.id
      });
    }
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
                          <span className="font-medium">Start:</span> {new Date(invite.event.start_time).toLocaleString()}
                        </p>
                        <p>
                          <span className="font-medium">End:</span> {new Date(invite.event.end_time).toLocaleString()}
                        </p>
                        {invite.event.location && (
                          <p className="mt-1"><span className="font-medium">Location:</span> {invite.event.location}</p>
                        )}
                        {invite.event.is_online && invite.event.meeting_link && (
                          <p className="mt-1">
                            <span className="font-medium">Meeting link:</span> <a href={invite.event.meeting_link} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{invite.event.meeting_link}</a>
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
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-blue-600"
                        onClick={() => openProposeTimeDialog(invite)}
                      >
                        <CalendarIcon className="h-4 w-4" />
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

      <Dialog open={proposeTimeOpen} onOpenChange={setProposeTimeOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Propose Alternative Time</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="proposed-start">Proposed Start Time</Label>
              <Input
                id="proposed-start"
                type="datetime-local"
                value={proposedStartTime}
                onChange={(e) => setProposedStartTime(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="proposed-end">Proposed End Time</Label>
              <Input
                id="proposed-end"
                type="datetime-local"
                value={proposedEndTime}
                onChange={(e) => setProposedEndTime(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="proposal-message">Message (Optional)</Label>
              <Textarea
                id="proposal-message"
                placeholder="Explain why you're proposing a different time..."
                value={proposalMessage}
                onChange={(e) => setProposalMessage(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setProposeTimeOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleProposeTime}>
              Propose New Time
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
