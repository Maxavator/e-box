
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
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'my-tickets'>('all');
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);

  const fetchTickets = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const query = supabase
        .from('helpdesk_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (activeTab === 'my-tickets') {
        query.eq('created_by', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error("Failed to load tickets");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [activeTab]);

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
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | 'my-tickets')} className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Tickets</TabsTrigger>
              <TabsTrigger value="my-tickets">My Tickets</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <TicketList tickets={tickets} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="my-tickets">
              <TicketList tickets={tickets} isLoading={isLoading} />
            </TabsContent>
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
