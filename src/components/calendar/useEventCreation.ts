
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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

  const handleSubmit = async () => {
    if (!user?.id) {
      return { success: false, error: "You must be logged in to create events" };
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
      console.error("Error creating event:", eventError);
      return { success: false, error: "Failed to create event" };
    }

    // Create invites for selected users
    if (formData.invitees.length > 0) {
      try {
        const { error: inviteError } = await supabase
          .from('calendar_event_invites')
          .insert(
            formData.invitees.map(inviteeId => ({
              event_id: eventData.id,
              invitee_id: inviteeId,
              status: 'pending'
            }))
          );

        if (inviteError) {
          console.error("Error sending invites:", inviteError);
          return { success: true, warning: "Event created but some invites failed to send" };
        }

        // Send notifications to invitees
        const { data: creatorProfile } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single();

        const creatorName = creatorProfile 
          ? `${creatorProfile.first_name || ''} ${creatorProfile.last_name || ''}`.trim() 
          : "Someone";

        const notifications = formData.invitees.map(inviteeId => ({
          subject: "New Calendar Invitation",
          message: `${creatorName} has invited you to "${formData.title}"`,
          receiver_id: inviteeId,
          sender_id: user.id
        }));

        await supabase.from('notifications').insert(notifications);
      } catch (error) {
        console.error("Error processing invites:", error);
        return { success: true, warning: "Event created but notifications may not have been sent" };
      }
    }

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

    return { success: true };
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
