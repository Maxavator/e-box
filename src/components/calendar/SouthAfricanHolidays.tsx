
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Info } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Holiday {
  id: number;
  name: string;
  date: string; // ISO format date string
  description: string;
  type: "public" | "religious" | "cultural" | "commemorative";
}

const southAfricanHolidays2024: Holiday[] = [
  {
    id: 1,
    name: "New Year's Day",
    date: "2024-01-01",
    description: "The first day of the calendar year celebrated across South Africa.",
    type: "public"
  },
  {
    id: 2,
    name: "Human Rights Day",
    date: "2024-03-21",
    description: "Commemorates the Sharpeville massacre of 1960, when police opened fire on a peaceful protest against pass laws.",
    type: "public"
  },
  {
    id: 3,
    name: "Good Friday",
    date: "2024-03-29",
    description: "Christian holiday commemorating the crucifixion of Jesus Christ.",
    type: "public"
  },
  {
    id: 4,
    name: "Family Day",
    date: "2024-04-01",
    description: "The day after Easter Sunday, also known as Easter Monday in South Africa.",
    type: "public"
  },
  {
    id: 5,
    name: "Freedom Day",
    date: "2024-04-27",
    description: "Celebrates South Africa's first democratic elections held in 1994.",
    type: "public"
  },
  {
    id: 6,
    name: "Workers' Day",
    date: "2024-05-01",
    description: "International Workers' Day celebrating the achievements of workers worldwide.",
    type: "public"
  },
  {
    id: 7,
    name: "Youth Day",
    date: "2024-06-16",
    description: "Commemorates the Soweto uprising of 1976, when students protested against Afrikaans as a medium of instruction.",
    type: "public"
  },
  {
    id: 8,
    name: "National Women's Day",
    date: "2024-08-09",
    description: "Commemorates the 1956 march of women to the Union Buildings against pass laws.",
    type: "public"
  },
  {
    id: 9,
    name: "Heritage Day",
    date: "2024-09-24",
    description: "Celebrates South Africa's diverse cultural heritage, often celebrated as 'Braai Day'.",
    type: "public"
  },
  {
    id: 10,
    name: "Day of Reconciliation",
    date: "2024-12-16",
    description: "Promotes reconciliation and national unity, formerly known as the Day of the Vow or Dingane's Day.",
    type: "public"
  },
  {
    id: 11,
    name: "Christmas Day",
    date: "2024-12-25",
    description: "Christian holiday celebrating the birth of Jesus Christ, widely observed as a cultural holiday.",
    type: "public"
  },
  {
    id: 12,
    name: "Day of Goodwill",
    date: "2024-12-26",
    description: "Also known as Boxing Day, traditionally a day for giving gifts to those less fortunate.",
    type: "public"
  },
  {
    id: 13,
    name: "Election Day",
    date: "2024-05-29",
    description: "2024 South African General Election Day, declared a public holiday.",
    type: "public"
  }
];

const getHolidayTypeColor = (type: Holiday["type"]) => {
  switch (type) {
    case "public":
      return "bg-green-100 text-green-800 border-green-300";
    case "religious":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "cultural":
      return "bg-purple-100 text-purple-800 border-purple-300";
    case "commemorative":
      return "bg-amber-100 text-amber-800 border-amber-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export function SouthAfricanHolidays() {
  const [selectedYear, setSelectedYear] = useState("2024");
  
  // Group holidays by month
  const holidaysByMonth = southAfricanHolidays2024.reduce((acc, holiday) => {
    const month = new Date(holiday.date).getMonth();
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(holiday);
    return acc;
  }, {} as Record<number, Holiday[]>);

  const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-primary" />
          South African Public Holidays {selectedYear}
        </h2>
        <div className="flex gap-2">
          <Button 
            variant={selectedYear === "2023" ? "default" : "outline"}
            onClick={() => setSelectedYear("2023")}
            disabled={true} // Disabled for now as we only have 2024 data
          >
            2023
          </Button>
          <Button 
            variant={selectedYear === "2024" ? "default" : "outline"}
            onClick={() => setSelectedYear("2024")}
          >
            2024
          </Button>
          <Button 
            variant={selectedYear === "2025" ? "default" : "outline"}
            onClick={() => setSelectedYear("2025")}
            disabled={true} // Disabled for now as we only have 2024 data
          >
            2025
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {months.map((monthName, monthIndex) => (
          <Card key={monthIndex} className="shadow-sm">
            <CardHeader className="py-3 px-4 bg-muted/50">
              <CardTitle className="text-lg">{monthName}</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {holidaysByMonth[monthIndex] && holidaysByMonth[monthIndex].length > 0 ? (
                <ScrollArea className="h-[220px] pr-4">
                  <div className="space-y-3">
                    {holidaysByMonth[monthIndex].map((holiday) => (
                      <div 
                        key={holiday.id} 
                        className={`rounded-md border p-3 ${getHolidayTypeColor(holiday.type)}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{holiday.name}</h3>
                            <p className="text-sm mt-1">
                              {new Date(holiday.date).getDate()} {monthName}
                            </p>
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Info className="h-4 w-4" />
                                  <span className="sr-only">Info</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>{holiday.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-muted-foreground">
                  No holidays in {monthName}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
