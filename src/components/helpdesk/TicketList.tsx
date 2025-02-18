
import { useState, useEffect } from "react";
import { MessageSquare, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Ticket = {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
};

export const TicketList = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [newTicket, setNewTicket] = useState({ title: '', description: '' });
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      toast({
        title: "Error",
        description: "Failed to get user information",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase
      .from('helpdesk_tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch tickets",
        variant: "destructive",
      });
      return;
    }

    setTickets(data);
  };

  const handleCreateTicket = async () => {
    if (!newTicket.title.trim() || !newTicket.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      toast({
        title: "Error",
        description: "Failed to get user information",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase
      .from('helpdesk_tickets')
      .insert({
        title: newTicket.title,
        description: newTicket.description,
        status: 'open',
        priority: 'medium',
        created_by: userData.user.id,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create ticket",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Ticket created successfully",
    });

    setNewTicket({ title: '', description: '' });
    setShowNewTicketForm(false);
    fetchTickets();
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Helpdesk Tickets</h2>
        <Button
          onClick={() => setShowNewTicketForm(!showNewTicketForm)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Ticket
        </Button>
      </div>

      {showNewTicketForm && (
        <div className="space-y-4 p-4 border rounded-lg">
          <Input
            placeholder="Ticket Title"
            value={newTicket.title}
            onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
          />
          <Textarea
            placeholder="Ticket Description"
            value={newTicket.description}
            onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
            className="min-h-[100px]"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowNewTicketForm(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateTicket}>Create Ticket</Button>
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell className="font-medium">{ticket.title}</TableCell>
              <TableCell className="capitalize">{ticket.status.replace('_', ' ')}</TableCell>
              <TableCell className="capitalize">{ticket.priority}</TableCell>
              <TableCell>{new Date(ticket.created_at).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
