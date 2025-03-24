
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Clock } from 'lucide-react';

interface JournalReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (enabled: boolean, dayOfWeek: number, time: string) => void;
}

export function JournalReminderDialog({
  open,
  onOpenChange,
  onSave
}: JournalReminderDialogProps) {
  const [enabled, setEnabled] = useState(true);
  const [dayOfWeek, setDayOfWeek] = useState("1"); // Monday
  const [time, setTime] = useState("09:00");
  
  const weekdays = [
    { value: "1", label: "Monday" },
    { value: "2", label: "Tuesday" },
    { value: "3", label: "Wednesday" },
    { value: "4", label: "Thursday" },
    { value: "5", label: "Friday" },
    { value: "6", label: "Saturday" },
    { value: "0", label: "Sunday" },
  ];
  
  const times = [
    { value: "09:00", label: "9:00 AM" },
    { value: "12:00", label: "12:00 PM" },
    { value: "15:00", label: "3:00 PM" },
    { value: "18:00", label: "6:00 PM" },
    { value: "21:00", label: "9:00 PM" },
  ];
  
  const handleSubmit = () => {
    onSave(enabled, parseInt(dayOfWeek), time);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Journal Reminder</DialogTitle>
          <DialogDescription>
            Set up a weekly reminder to write in your journal
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="enable-reminder" 
              checked={enabled}
              onCheckedChange={(checked) => setEnabled(checked as boolean)}
            />
            <label
              htmlFor="enable-reminder"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Enable weekly journal reminders
            </label>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <label className="text-sm font-medium">Day of the week</label>
              </div>
              <Select
                disabled={!enabled}
                value={dayOfWeek}
                onValueChange={setDayOfWeek}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {weekdays.map((day) => (
                    <SelectItem key={day.value} value={day.value}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <label className="text-sm font-medium">Time</label>
              </div>
              <Select
                disabled={!enabled}
                value={time}
                onValueChange={setTime}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {times.map((timeOption) => (
                    <SelectItem key={timeOption.value} value={timeOption.value}>
                      {timeOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
