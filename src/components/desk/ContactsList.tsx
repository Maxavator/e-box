
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { ContactsTable } from "./contacts/ContactsTable";
import { AddContactDialog } from "./contacts/AddContactDialog";
import { useContacts } from "./contacts/useContacts";

export const ContactsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const { contacts, isLoading, toggleFavoriteMutation } = useContacts();

  useEffect(() => {
    const channel = supabase
      .channel('contacts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contacts'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['contacts'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-2xl font-bold">Organization Contacts</CardTitle>
          <AddContactDialog />
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="rounded-md border">
            <ContactsTable
              contacts={contacts || []}
              isLoading={isLoading}
              searchQuery={searchQuery}
              onToggleFavorite={(contactId, isFavorite) => 
                toggleFavoriteMutation.mutate({ contactId, isFavorite })
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
