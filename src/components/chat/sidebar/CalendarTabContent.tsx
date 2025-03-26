
import { Button } from "@/components/ui/button";
import { CalendarDays, Inbox } from "lucide-react";

interface CalendarTabContentProps {
  onCalendarActionClick: (view: "calendar" | "inbox") => void;
}

export function CalendarTabContent({ onCalendarActionClick }: CalendarTabContentProps) {
  return (
    <div className="space-y-4 pt-2">
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onCalendarActionClick("calendar")}
        >
          <CalendarDays className="h-4 w-4 mr-2" />
          <span>Calendar</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onCalendarActionClick("inbox")}
        >
          <Inbox className="h-4 w-4 mr-2" />
          <span>Invites</span>
        </Button>
      </div>
    </div>
  );
}
