
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Download, Filter } from "lucide-react";
import { UserRoleType } from "@/types/supabase-types";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

interface ModerationHistoryProps {
  userRole: string | undefined;
}

export function ModerationHistory({ userRole }: ModerationHistoryProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [actionType, setActionType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Filter based on user role and filters
  const getFilteredHistory = () => {
    let filtered = moderationHistory;
    
    // Filter by role
    if (userRole === 'hr_moderator') {
      filtered = filtered.filter(item => item.category === 'HR');
    } else if (userRole === 'comm_moderator') {
      filtered = filtered.filter(item => item.category === 'Communication');
    } else if (userRole === 'stakeholder_moderator') {
      filtered = filtered.filter(item => item.category === 'Stakeholder');
    }
    
    // Filter by date
    if (date) {
      const dateStr = format(date, 'MMM d, yyyy');
      filtered = filtered.filter(item => {
        // Simple string matching - in a real app, parse dates properly
        return item.date.includes(dateStr);
      });
    }
    
    // Filter by action type
    if (actionType !== 'all') {
      filtered = filtered.filter(item => item.action === actionType);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.moderator.toLowerCase().includes(term) ||
        item.item.toLowerCase().includes(term) ||
        item.details.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  };
  
  const filteredHistory = getFilteredHistory();
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Moderation History</CardTitle>
          <CardDescription>View past moderation actions and decisions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search history..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[180px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Select value={actionType} onValueChange={setActionType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Flagged">Flagged</SelectItem>
                  <SelectItem value="Warning">Warning</SelectItem>
                  <SelectItem value="Suspension">Suspension</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Moderator</TableHead>
                <TableHead>Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No moderation history found for the selected filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredHistory.map((historyItem) => (
                  <TableRow key={historyItem.id}>
                    <TableCell>{historyItem.date}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        historyItem.action === 'Approved' ? 'bg-green-100 text-green-800' :
                        historyItem.action === 'Rejected' ? 'bg-red-100 text-red-800' :
                        historyItem.action === 'Flagged' ? 'bg-amber-100 text-amber-800' :
                        historyItem.action === 'Warning' ? 'bg-blue-100 text-blue-800' :
                        historyItem.action === 'Suspension' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {historyItem.action}
                      </span>
                    </TableCell>
                    <TableCell>{historyItem.item}</TableCell>
                    <TableCell>{historyItem.details}</TableCell>
                    <TableCell>{historyItem.moderator}</TableCell>
                    <TableCell>{historyItem.category}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// Sample data
const moderationHistory = [
  {
    id: "1",
    date: "Apr 15, 2025",
    action: "Approved",
    item: "Document",
    details: "Company handbook approved for publication",
    moderator: "Thabo Nkosi",
    category: "HR"
  },
  {
    id: "2",
    date: "Apr 14, 2025",
    action: "Rejected",
    item: "Message",
    details: "Chat message rejected for inappropriate content",
    moderator: "Sarah Johnson",
    category: "Communication"
  },
  {
    id: "3",
    date: "Apr 13, 2025",
    action: "Warning",
    item: "User",
    details: "User warned for repeated policy violations",
    moderator: "David Chen",
    category: "HR"
  },
  {
    id: "4",
    date: "Apr 12, 2025",
    action: "Flagged",
    item: "Document",
    details: "Press release flagged for review",
    moderator: "Lisa Wong",
    category: "Stakeholder"
  },
  {
    id: "5",
    date: "Apr 11, 2025",
    action: "Approved",
    item: "Broadcast",
    details: "Company-wide announcement approved",
    moderator: "James Peterson",
    category: "Communication"
  },
  {
    id: "6",
    date: "Apr 10, 2025",
    action: "Suspension",
    item: "User",
    details: "User account suspended for 7 days",
    moderator: "Robert Johnson",
    category: "HR"
  },
  {
    id: "7",
    date: "Apr 9, 2025",
    action: "Approved",
    item: "Document",
    details: "Financial report approved for stakeholders",
    moderator: "Emily Davis",
    category: "Stakeholder"
  },
  {
    id: "8",
    date: "Apr 8, 2025",
    action: "Rejected",
    item: "Message",
    details: "Message rejected in public channel",
    moderator: "Thomas Wilson",
    category: "Communication"
  }
];
