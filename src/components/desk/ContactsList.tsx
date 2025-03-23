
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Building, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { ContactsTable } from "./contacts/ContactsTable";
import { AddContactDialog } from "./contacts/AddContactDialog";
import { useContacts } from "./contacts/useContacts";
import { MainLayout } from "@/components/shared/MainLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const ContactsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const { contacts, isLoading, toggleFavoriteMutation } = useContacts();

  // Split contacts into colleague and external groups
  const colleagueContacts = contacts?.filter(contact => contact.is_colleague) || [];
  const externalContacts = contacts?.filter(contact => !contact.is_colleague) || [];
  const favoriteContacts = contacts?.filter(contact => contact.is_favorite) || [];

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
    <MainLayout>
      <div className="p-4 md:p-6">
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
            
            <Tabs defaultValue="all" className="mb-4">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Contacts</TabsTrigger>
                <TabsTrigger value="colleagues">
                  <Building className="h-4 w-4 mr-2" />
                  Colleagues ({colleagueContacts.length})
                </TabsTrigger>
                <TabsTrigger value="external">
                  <UserPlus className="h-4 w-4 mr-2" />
                  External ({externalContacts.length})
                </TabsTrigger>
                <TabsTrigger value="favorites">Favorites ({favoriteContacts.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
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
              </TabsContent>
              
              <TabsContent value="colleagues">
                <div className="rounded-md border">
                  <ContactsTable
                    contacts={colleagueContacts}
                    isLoading={isLoading}
                    searchQuery={searchQuery}
                    onToggleFavorite={(contactId, isFavorite) => 
                      toggleFavoriteMutation.mutate({ contactId, isFavorite })
                    }
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="external">
                <div className="rounded-md border">
                  <ContactsTable
                    contacts={externalContacts}
                    isLoading={isLoading}
                    searchQuery={searchQuery}
                    onToggleFavorite={(contactId, isFavorite) => 
                      toggleFavoriteMutation.mutate({ contactId, isFavorite })
                    }
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="favorites">
                <div className="rounded-md border">
                  <ContactsTable
                    contacts={favoriteContacts}
                    isLoading={isLoading}
                    searchQuery={searchQuery}
                    onToggleFavorite={(contactId, isFavorite) => 
                      toggleFavoriteMutation.mutate({ contactId, isFavorite })
                    }
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};
