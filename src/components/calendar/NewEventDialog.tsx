
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";
import { EventFormFields } from "./EventFormFields";
import { InviteesList } from "./InviteesList";
import { useEventCreation } from "./useEventCreation";
import { toast } from "sonner";

export function NewEventDialog() {
  const { open, setOpen, formData, setFormData, handleSubmit, toggleInvitee } = useEventCreation();
  const user = useUser();

  const { data: organizationMembers } = useQuery({
    queryKey: ['organization-members'],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (!userProfile?.organization_id) return [];

      const { data: members } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, job_title')
        .eq('organization_id', userProfile.organization_id)
        .neq('id', user.id);

      return members || [];
    },
    enabled: !!user?.id,
  });

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error("You must be logged in to create events");
      return;
    }

    // Validate form
    if (!formData.title.trim()) {
      toast.error("Event title is required");
      return;
    }

    try {
      const result = await handleSubmit();
      if (result.success) {
        toast.success("Event created successfully");
        setOpen(false);
      } else {
        toast.error(result.error || "Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Create New Event</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <EventFormFields formData={formData} setFormData={setFormData} />
          <InviteesList 
            organizationMembers={organizationMembers || []}
            selectedInvitees={formData.invitees}
            onToggleInvitee={toggleInvitee}
          />
          <Button type="submit" className="w-full">Create Event</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
