
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building, Pen, UserPlus, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Define a Profile type for this component since we need it here
interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url?: string;
  organization_id: string | null;
}

interface Group {
  id: string;
  name: string;
  is_public: boolean;
  avatar_url?: string;
}

export function NewMessageDialog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("contacts");
  const { toast } = useToast();

  const { data: contacts = [], isLoading: isLoadingContacts } = useQuery({
    queryKey: ['organization-contacts'],
    queryFn: async () => {
      const currentUser = (await supabase.auth.getUser()).data.user;
      if (!currentUser) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', currentUser.id)
        .single();

      if (!profile?.organization_id) {
        throw new Error('User not in organization');
      }

      const { data: orgContacts, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, organization_id')
        .eq('organization_id', profile.organization_id)
        .neq('id', currentUser.id);

      if (error) throw error;
      return orgContacts || [];
    }
  });

  const { data: colleagues = [], isLoading: isLoadingColleagues } = useQuery({
    queryKey: ['colleagues'],
    queryFn: async () => {
      const currentUser = (await supabase.auth.getUser()).data.user;
      if (!currentUser) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', currentUser.id)
        .single();

      if (!profile?.organization_id) {
        throw new Error('User not in organization');
      }

      // Fetch all colleagues in the same organization
      const { data: orgColleagues, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, organization_id, job_title')
        .eq('organization_id', profile.organization_id)
        .neq('id', currentUser.id);

      if (error) throw error;
      return orgColleagues || [];
    }
  });

  const { data: groups = [], isLoading: isLoadingGroups } = useQuery({
    queryKey: ['organization-groups'],
    queryFn: async () => {
      const currentUser = (await supabase.auth.getUser()).data.user;
      if (!currentUser) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', currentUser.id)
        .single();

      if (!profile?.organization_id) {
        throw new Error('User not in organization');
      }

      // Fetch all public groups and groups where the user is a member
      const { data: publicGroups, error } = await supabase
        .from('conversations')
        .select('id, name, is_public, avatar_url')
        .eq('is_public', true)
        .eq('organization_id', profile.organization_id);

      if (error) throw error;
      return publicGroups || [];
    }
  });

  const filteredContacts = contacts.filter(contact => {
    const searchLower = searchQuery.toLowerCase();
    const fullName = `${contact.first_name} ${contact.last_name}`.toLowerCase();
    return fullName.includes(searchLower);
  });

  const filteredColleagues = colleagues.filter(colleague => {
    const searchLower = searchQuery.toLowerCase();
    const fullName = `${colleague.first_name} ${colleague.last_name}`.toLowerCase();
    const jobTitle = colleague.job_title?.toLowerCase() || '';
    return fullName.includes(searchLower) || jobTitle.includes(searchLower);
  });

  const filteredGroups = groups.filter(group => {
    return group.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSelectContact = async (contact: Profile) => {
    try {
      const currentUser = (await supabase.auth.getUser()).data.user;
      if (!currentUser) throw new Error('Not authenticated');

      // Check if conversation already exists 
      const { data: existingConvs, error: searchError } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(user1_id.eq.${currentUser.id},user2_id.eq.${contact.id}),and(user1_id.eq.${contact.id},user2_id.eq.${currentUser.id})`)
        .maybeSingle();

      if (searchError) throw searchError;

      if (existingConvs) {
        toast({
          title: "Conversation exists",
          description: "You already have a conversation with this contact"
        });
        return;
      }

      // Create new conversation
      const { error: insertError } = await supabase
        .from('conversations')
        .insert({
          user1_id: currentUser.id,
          user2_id: contact.id
        });

      if (insertError) throw insertError;

      toast({
        title: "Conversation started",
        description: `Started a new conversation with ${contact.first_name} ${contact.last_name}`
      });
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Error",
        description: "Failed to start conversation",
        variant: "destructive"
      });
    } finally {
      setOpen(false);
    }
  };

  const handleSelectColleague = async (colleague: Profile) => {
    // For colleagues, we use the same handler as contacts
    handleSelectContact(colleague);
  };

  const handleSelectGroup = async (group: Group) => {
    try {
      // For groups, we can directly navigate to the group conversation
      toast({
        title: "Group selected",
        description: `Joined the group conversation: ${group.name}`
      });
      
      // In a complete implementation, we would add the user to the group if not already a member
      // and then redirect to the group conversation
      
      setOpen(false);
    } catch (error) {
      console.error('Error joining group:', error);
      toast({
        title: "Error",
        description: "Failed to join group conversation",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Pen className="mr-2 h-4 w-4" />
          New Message
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            placeholder="Search contacts or groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          
          <Tabs defaultValue="contacts" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="contacts" className="flex-1">Contacts</TabsTrigger>
              <TabsTrigger value="colleagues" className="flex-1">
                <Building className="h-4 w-4 mr-2" />
                Colleagues
              </TabsTrigger>
              <TabsTrigger value="groups" className="flex-1">Groups</TabsTrigger>
            </TabsList>
            
            <TabsContent value="contacts">
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-2">
                  {isLoadingContacts ? (
                    <div className="text-center text-muted-foreground py-4">
                      Loading contacts...
                    </div>
                  ) : filteredContacts.length === 0 ? (
                    <div className="text-center text-muted-foreground py-4">
                      No contacts found
                    </div>
                  ) : (
                    filteredContacts.map((contact) => (
                      <Button
                        key={contact.id}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => handleSelectContact(contact)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            {contact.avatar_url ? (
                              <AvatarImage src={contact.avatar_url} alt={`${contact.first_name} ${contact.last_name}`} />
                            ) : (
                              <AvatarFallback>
                                {`${contact.first_name?.[0] || ''}${contact.last_name?.[0] || ''}`}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">
                              {`${contact.first_name} ${contact.last_name}`}
                            </span>
                          </div>
                        </div>
                      </Button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="colleagues">
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-2">
                  {isLoadingColleagues ? (
                    <div className="text-center text-muted-foreground py-4">
                      Loading colleagues...
                    </div>
                  ) : filteredColleagues.length === 0 ? (
                    <div className="text-center text-muted-foreground py-4">
                      No colleagues found
                    </div>
                  ) : (
                    filteredColleagues.map((colleague) => (
                      <Button
                        key={colleague.id}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => handleSelectColleague(colleague)}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <Avatar>
                            {colleague.avatar_url ? (
                              <AvatarImage src={colleague.avatar_url} alt={`${colleague.first_name} ${colleague.last_name}`} />
                            ) : (
                              <AvatarFallback>
                                {`${colleague.first_name?.[0] || ''}${colleague.last_name?.[0] || ''}`}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">
                              {`${colleague.first_name} ${colleague.last_name}`}
                            </span>
                            {colleague.job_title && (
                              <span className="text-xs text-muted-foreground">
                                {colleague.job_title}
                              </span>
                            )}
                          </div>
                          <Badge variant="outline" className="ml-auto bg-blue-50 text-blue-600">
                            <Building className="h-3 w-3 mr-1" />
                            Colleague
                          </Badge>
                        </div>
                      </Button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="groups">
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-2">
                  {isLoadingGroups ? (
                    <div className="text-center text-muted-foreground py-4">
                      Loading groups...
                    </div>
                  ) : filteredGroups.length === 0 ? (
                    <div className="text-center text-muted-foreground py-4">
                      No groups found
                    </div>
                  ) : (
                    filteredGroups.map((group) => (
                      <Button
                        key={group.id}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => handleSelectGroup(group)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            {group.avatar_url ? (
                              <AvatarImage src={group.avatar_url} alt={group.name} />
                            ) : (
                              <AvatarFallback>
                                <Users className="h-4 w-4" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">
                              {group.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {group.is_public ? 'Public Group' : 'Private Group'}
                            </span>
                          </div>
                        </div>
                      </Button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
