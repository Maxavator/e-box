
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useAuth } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface NewEventFormData {
  title: string;
  description: string;
  location: string;
  isOnline: boolean;
  meetingLink: string;
  date: Date;
  startTime: string;
  endTime: string;
}

export function NewEventDialog() {
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
  });
  const user = useAuth();

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

    const { error } = await supabase
      .from('calendar_events')
      .insert({
        title: formData.title,
        description: formData.description,
        location: formData.location || null,
        is_online: formData.isOnline,
        meeting_link: formData.meetingLink || null,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        creator_id: user.id,
      });

    if (error) {
      toast.error("Failed to create event");
      console.error("Error creating event:", error);
      return;
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
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Create New Event</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Calendar
              mode="single"
              selected={formData.date}
              onSelect={(date) => date && setFormData({ ...formData, date })}
              className="rounded-md border"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.isOnline}
              onCheckedChange={(checked) => setFormData({ ...formData, isOnline: checked })}
            />
            <Label>Online Meeting</Label>
          </div>

          {formData.isOnline && (
            <div className="space-y-2">
              <Label htmlFor="meetingLink">Meeting Link</Label>
              <Input
                id="meetingLink"
                value={formData.meetingLink}
                onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                placeholder="https://..."
              />
            </div>
          )}

          <Button type="submit" className="w-full">Create Event</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
