
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import type { Ticket } from "../../types/helpdesk";

interface TicketListProps {
  tickets: Ticket[];
  isStaff: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open':
      return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
    case 'in_progress':
      return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
    case 'resolved':
      return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
    case 'closed':
      return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    default:
      return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'low':
      return 'bg-gray-500/10 text-gray-500';
    case 'medium':
      return 'bg-blue-500/10 text-blue-500';
    case 'high':
      return 'bg-orange-500/10 text-orange-500';
    case 'urgent':
      return 'bg-red-500/10 text-red-500';
    default:
      return 'bg-gray-500/10 text-gray-500';
  }
};

export const TicketList = ({ tickets, isStaff }: TicketListProps) => {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No tickets found</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => (
          <TableRow key={ticket.id}>
            <TableCell className="font-medium">{ticket.title}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(ticket.status)} variant="secondary">
                {ticket.status.replace('_', ' ')}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge className={getPriorityColor(ticket.priority)} variant="secondary">
                {ticket.priority}
              </Badge>
            </TableCell>
            <TableCell>{ticket.department || 'N/A'}</TableCell>
            <TableCell>
              {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm">
                View Details
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
