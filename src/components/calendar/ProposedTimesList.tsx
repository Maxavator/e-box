
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProposedTime {
  id: string;
  event_id: string;
  invitee_id: string;
  proposed_start_time: string;
  proposed_end_time: string;
  proposal_message: string | null;
  invitee: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
  event: {
    id: string;
    title: string;
  };
}

export function ProposedTimesList() {
  const { data: proposedTimes, isLoading, refetch } = useQuery({
    queryKey: ['proposed-times'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];
      
      const { data, error } = await supabase
        .from('calendar_event_invites')
        .select(`
          id,
          event_id,
          invitee_id,
          proposed_start_time,
          proposed_end_time,
          proposal_message,
          invitee:invitee_id (
            id,
            first_name,
            last_name,
            avatar_url
          ),
          event:event_id (
            id,
            title
          )
        `)
        .eq('status', 'proposed')
        .eq('event:created_by', user.user.id);

      if (error) {
        console.error("Error fetching proposed times:", error);
        throw error;
      }
      
      return data as unknown as ProposedTime[];
    },
  });

  const handleAcceptProposal = async (inviteId: string, proposedStartTime: string, proposedEndTime: string) => {
    try {
      // Get the invite to find the event_id
      const { data: invite } = await supabase
        .from('calendar_event_invites')
        .select('event_id')
        .eq('id', inviteId)
        .single();
      
      if (!invite) {
        toast.error("Could not find the invitation");
        return;
      }
      
      // Update the event with the new proposed times
      const { error: eventError } = await supabase
        .from('calendar_events')
        .update({
          start_time: proposedStartTime,
          end_time: proposedEndTime
        })
        .eq('id', invite.event_id);
      
      if (eventError) {
        toast.error("Failed to update event times");
        console.error("Error updating event:", eventError);
        return;
      }
      
      // Update the invite status to accepted
      const { error: inviteError } = await supabase
        .from('calendar_event_invites')
        .update({ status: 'accepted' })
        .eq('id', inviteId);
      
      if (inviteError) {
        toast.error("Failed to update invitation status");
        console.error("Error updating invite:", inviteError);
        return;
      }
      
      toast.success("Proposed time accepted and event updated");
      refetch();
    } catch (error) {
      console.error("Error accepting proposal:", error);
      toast.error("An error occurred while processing your request");
    }
  };

  const handleDeclineProposal = async (inviteId: string) => {
    const { error } = await supabase
      .from('calendar_event_invites')
      .update({
        status: 'pending',
        proposed_start_time: null,
        proposed_end_time: null,
        proposal_message: null
      })
      .eq('id', inviteId);
    
    if (error) {
      toast.error("Failed to decline proposal");
      console.error("Error declining proposal:", error);
      return;
    }
    
    toast.success("Proposal declined");
    refetch();
  };

  if (isLoading) {
    return <div className="p-4">Loading proposed times...</div>;
  }

  return (
    <div className="h-full">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Proposed Time Changes</h2>
        
        <ScrollArea className="h-[calc(100vh-10rem)]">
          <div className="space-y-4">
            {proposedTimes && proposedTimes.length > 0 ? (
              proposedTimes.map((proposal) => {
                const inviteeName = `${proposal.invitee.first_name || ''} ${proposal.invitee.last_name || ''}`.trim() || 'Unknown User';
                const initials = inviteeName.split(' ').map(n => n[0]).join('').toUpperCase();
                
                return (
                  <Card key={proposal.id} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={proposal.invitee.avatar_url || undefined} alt={inviteeName} />
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{inviteeName}</h3>
                          <p className="text-sm text-gray-500">
                            proposed a different time for "{proposal.event.title}"
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Proposed Time</h4>
                          <p className="font-medium">
                            {new Date(proposal.proposed_start_time).toLocaleString()} - {new Date(proposal.proposed_end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      
                      {proposal.proposal_message && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <h4 className="text-sm font-medium text-blue-700">Message</h4>
                          <p className="text-blue-800">{proposal.proposal_message}</p>
                        </div>
                      )}
                      
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600"
                          onClick={() => handleDeclineProposal(proposal.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Decline
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleAcceptProposal(proposal.id, proposal.proposed_start_time, proposal.proposed_end_time)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })
            ) : (
              <p className="text-gray-500 text-center">No proposed time changes to review</p>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
