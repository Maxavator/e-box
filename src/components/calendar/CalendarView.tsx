
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const demoEvents = [
  {
    id: 1,
    title: "Team Meeting",
    description: "Weekly sync with the development team",
    date: new Date(2024, 3, 15, 10, 0),
    duration: "1 hour"
  },
  {
    id: 2,
    title: "Project Review",
    description: "Review Q1 project milestones",
    date: new Date(2024, 3, 17, 14, 30),
    duration: "2 hours"
  },
  {
    id: 3,
    title: "Client Call",
    description: "Discussion about new requirements",
    date: new Date(2024, 3, 20, 11, 0),
    duration: "45 minutes"
  }
];

export function CalendarView() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const selectedDayEvents = demoEvents.filter(event => 
    date && 
    event.date.getDate() === date.getDate() &&
    event.date.getMonth() === date.getMonth() &&
    event.date.getFullYear() === date.getFullYear()
  );

  return (
    <div className="flex h-full">
      <div className="w-96 border-r p-4 bg-white">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
        <div className="mt-4">
          <h3 className="font-medium mb-2">Selected Date Events</h3>
          <ScrollArea className="h-[calc(100vh-26rem)]">
            {selectedDayEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDayEvents.map(event => (
                  <Card key={event.id} className="p-4">
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-gray-500">{event.description}</p>
                    <div className="text-sm text-gray-500 mt-2">
                      {event.date.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                      {" • "}
                      {event.duration}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">No events scheduled for this day</p>
            )}
          </ScrollArea>
        </div>
      </div>
      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Calendar Overview</h2>
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-medium mb-4">Upcoming Events</h3>
              <div className="space-y-4">
                {demoEvents
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map(event => (
                    <Card key={event.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-gray-500">{event.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {event.date.toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {event.date.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
