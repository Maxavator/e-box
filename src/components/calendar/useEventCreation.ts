
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useUser } from "@supabase/auth-helpers-react";
import { NewEventFormData } from "./types";

export function useEventCreation() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<NewEventFormData>({
    title: "",
    description: "",
    location: "",
    isOnline: false,
    meetingLink: "",
    date: new Date(),
    startTime: "09:00",
    endTime: "10:00",
    invitees: [],
  });
  const user = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error("You must be logged in to create events");
      return;
    }

    const startDateTime = new Date(formData.date);
    const [startHours, startMinutes] = formData.startTime.split(':');
    startDateTime.setHours(parseInt(startHours), parseInt(startMinutes));

    const endDateTime = new Date(formData.date);
    const [endHours, endMinutes] = formData.endTime.split(':');
    endDateTime.setHours(parseInt(endHours), parseInt(endMinutes));

    // Create the event
    const { data: eventData, error: eventError } = await supabase
      .from('calendar_events')
      .insert({
        title: formData.title,
        description: formData.description,
        location: formData.location || null,
        is_online: formData.isOnline,
        meeting_link: formData.meetingLink || null,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        created_by: user.id,
      })
      .select()
      .single();

    if (eventError) {
      toast.error("Failed to create event");
      console.error("Error creating event:", eventError);
      return;
    }

    // Create invites for selected users
    if (formData.invitees.length > 0) {
      const { error: inviteError } = await supabase
        .from('calendar_invites')
        .insert(
          formData.invitees.map(inviteeId => ({
            event_id: eventData.id,
            invitee_id: inviteeId,
            status: 'pending'
          }))
        );

      if (inviteError) {
        toast.error("Failed to send some invites");
        console.error("Error sending invites:", inviteError);
      }
    }

    toast.success("Event created successfully");
    setOpen(false);
    setFormData({
      title: "",
      description: "",
      location: "",
      isOnline: false,
      meetingLink: "",
      date: new Date(),
      startTime: "09:00",
      endTime: "10:00",
      invitees: [],
    });
  };

  const toggleInvitee = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      invitees: prev.invitees.includes(userId)
        ? prev.invitees.filter(id => id !== userId)
        : [...prev.invitees, userId]
    }));
  };

  return {
    open,
    setOpen,
    formData,
    setFormData,
    handleSubmit,
    toggleInvitee
  };
}
