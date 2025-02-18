
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Ticket } from "../../types/helpdesk";

interface TicketListProps {
  tickets: Ticket[];
  isLoading: boolean;
}

const getStatusColor = (status: Ticket['status']) => {
  switch (status) {
    case 'open':
      return 'bg-blue-500';
    case 'in_progress':
      return 'bg-yellow-500';
    case 'resolved':
      return 'bg-green-500';
    case 'closed':
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
};

const getPriorityColor = (priority: Ticket['priority']) => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-500';
    case 'high':
      return 'bg-orange-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'low':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

export const TicketList = ({ tickets, isLoading }: TicketListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No tickets found</p>
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
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => (
          <TableRow key={ticket.id}>
            <TableCell>{ticket.title}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(ticket.status)}>
                {ticket.status.replace('_', ' ')}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge className={getPriorityColor(ticket.priority)}>
                {ticket.priority}
              </Badge>
            </TableCell>
            <TableCell>{ticket.department || '-'}</TableCell>
            <TableCell>{new Date(ticket.created_at).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
