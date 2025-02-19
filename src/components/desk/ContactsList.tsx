import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, UserPlus, Mail, Phone, Search, Star, MoreVertical, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type Contact = {
  contact: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    organization_id: string | null;
  };
  is_favorite: boolean;
};

type OrganizationMember = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  organization_id: string | null;
};

export const ContactsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: contacts, isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('contacts')
        .select(`
          is_favorite,
          contact:profiles!contacts_contact_id_fkey (
            id,
            first_name,
            last_name,
            organization_id
          )
        `)
        .eq('user_id', userData.user.id);

      if (error) throw error;
      return data as Contact[];
    }
  });

  const { data: organizationMembers = [], isLoading: isLoadingMembers } = useQuery({
    queryKey: ['organization-members'],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const { data: userProfile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', userData.user.id)
        .single();

      if (!userProfile?.organization_id) throw new Error("No organization found");

      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, organization_id')
        .eq('organization_id', userProfile.organization_id)
        .neq('id', userData.user.id);

      if (error) throw error;
      return data as OrganizationMember[];
    }
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({ contactId, isFavorite }: { contactId: string, isFavorite: boolean }) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('contacts')
        .update({ is_favorite: isFavorite })
        .eq('user_id', userData.user.id)
        .eq('contact_id', contactId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success("Contact updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update contact: " + error.message);
    }
  });

  const addContactMutation = useMutation({
    mutationFn: async (contactId: string) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('contacts')
        .insert([
          { user_id: userData.user.id, contact_id: contactId }
        ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success("Contact added successfully");
      setIsAddContactOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to add contact: " + error.message);
    }
  });

  const handleStartChat = async (contactId: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const { data: existingConversation } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(user1_id.eq.${userData.user.id},user2_id.eq.${contactId}),and(user1_id.eq.${contactId},user2_id.eq.${userData.user.id})`)
        .maybeSingle();

      if (existingConversation) {
        navigate(`/chat?conversation=${existingConversation.id}`);
        return;
      }

      const { data: newConversation, error } = await supabase
        .from('conversations')
        .insert({
          user1_id: userData.user.id,
          user2_id: contactId
        })
        .select('id')
        .single();

      if (error) throw error;
      
      navigate(`/chat?conversation=${newConversation.id}`);
    } catch (error) {
      toast.error("Failed to start conversation");
    }
  };

  const filteredContacts = contacts?.filter(contact => {
    const fullName = `${contact.contact.first_name} ${contact.contact.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

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
          <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Contact</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Input
                  placeholder="Search organization members..."
                  className="mb-4"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <ScrollArea className="h-[300px]">
                  {isLoadingMembers ? (
                    <div className="text-center py-4">Loading members...</div>
                  ) : (
                    organizationMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer"
                        onClick={() => addContactMutation.mutate(member.id)}
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <span>{member.first_name} {member.last_name}</span>
                        </div>
                        <UserPlus className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))
                  )}
                </ScrollArea>
              </div>
            </DialogContent>
          </Dialog>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">Loading contacts...</TableCell>
                  </TableRow>
                ) : filteredContacts?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      No contacts found. Try adding some from your organization!
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredContacts?.map((contact) => (
                    <TableRow key={contact.contact.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          {contact.contact.first_name} {contact.contact.last_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          Available
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => 
                              toggleFavoriteMutation.mutate({
                                contactId: contact.contact.id,
                                isFavorite: !contact.is_favorite
                              })
                            }>
                              <Star className={`mr-2 h-4 w-4 ${contact.is_favorite ? 'fill-yellow-400' : ''}`} />
                              {contact.is_favorite ? 'Remove from Favorites' : 'Add to Favorites'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStartChat(contact.contact.id)}>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Start Chat
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
