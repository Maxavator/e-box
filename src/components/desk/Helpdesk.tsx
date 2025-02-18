import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, TicketIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { NewTicketDialog } from "./components/helpdesk/NewTicketDialog";
import { TicketList } from "./components/helpdesk/TicketList";
import type { Ticket } from "./types/helpdesk";

export const Helpdesk = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    checkUserRole();
    fetchTickets();
    subscribeToTickets();
  }, []);

  const checkUserRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    setIsStaff(userRoles?.role === 'staff' || userRoles?.role === 'global_admin');
  };

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('helpdesk_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const subscribeToTickets = () => {
    const channel = supabase
      .channel('helpdesk_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'helpdesk_tickets' },
        (payload) => {
          console.log('Received realtime update:', payload);
          fetchTickets();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const filterTickets = (status: string) => {
    return tickets.filter(ticket => {
      if (status === 'active') {
        return ['open', 'in_progress'].includes(ticket.status);
      }
      if (status === 'resolved') {
        return ['resolved', 'closed'].includes(ticket.status);
      }
      return true;
    });
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TicketIcon className="h-5 w-5" />
            Helpdesk
          </CardTitle>
          <Button onClick={() => setIsNewTicketOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Ticket
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="active">Active Tickets</TabsTrigger>
              <TabsTrigger value="resolved">Resolved Tickets</TabsTrigger>
              {isStaff && <TabsTrigger value="all">All Tickets</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="active">
              {loading ? (
                <div>Loading...</div>
              ) : (
                <TicketList 
                  tickets={filterTickets('active')}
                  isStaff={isStaff}
                />
              )}
            </TabsContent>
            
            <TabsContent value="resolved">
              {loading ? (
                <div>Loading...</div>
              ) : (
                <TicketList 
                  tickets={filterTickets('resolved')}
                  isStaff={isStaff}
                />
              )}
            </TabsContent>

            {isStaff && (
              <TabsContent value="all">
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  <TicketList 
                    tickets={filterTickets('all')}
                    isStaff={isStaff}
                  />
                )}
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>

      <NewTicketDialog 
        isOpen={isNewTicketOpen}
        onClose={() => setIsNewTicketOpen(false)}
        onTicketCreated={fetchTickets}
      />
    </div>
  );
};
