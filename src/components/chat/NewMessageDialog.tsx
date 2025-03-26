
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
import { UserSearch } from "./UserSearch";

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

interface NewMessageDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelectConversation?: (conversationId: string) => void;
}

export function NewMessageDialog({ 
  open, 
  onOpenChange,
  onSelectConversation
}: NewMessageDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all-users");
  const { toast } = useToast();

  const isOpen = open !== undefined ? open : dialogOpen;
  const setIsOpen = onOpenChange || setDialogOpen;

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

      const { data: existingConvs, error: searchError } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(user1_id.eq.${currentUser.id},user2_id.eq.${contact.id}),and(user1_id.eq.${contact.id},user2_id.eq.${currentUser.id})`)
        .maybeSingle();

      if (searchError) throw searchError;

      if (existingConvs) {
        if (onSelectConversation) {
          onSelectConversation(existingConvs.id);
        }
        
        toast({
          title: "Conversation exists",
          description: "Opening existing conversation with this contact"
        });
        
        setIsOpen(false);
        return;
      }

      const { data: newConv, error: insertError } = await supabase
        .from('conversations')
        .insert({
          user1_id: currentUser.id,
          user2_id: contact.id
        })
        .select('id')
        .single();

      if (insertError) throw insertError;

      if (onSelectConversation && newConv) {
        onSelectConversation(newConv.id);
      }

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
      setIsOpen(false);
    }
  };

  const handleSelectUser = async (user: any) => {
    // Reuse the same logic as handleSelectContact
    handleSelectContact(user);
  };

  const handleSelectColleague = async (colleague: Profile) => {
    handleSelectContact(colleague);
  };

  const handleSelectGroup = async (group: Group) => {
    try {
      toast({
        title: "Group selected",
        description: `Joined the group conversation: ${group.name}`
      });
      
      if (onSelectConversation) {
        onSelectConversation(group.id);
      }
      
      setIsOpen(false);
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
          <Tabs defaultValue="all-users" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="all-users" className="flex-1">
                <UserPlus className="h-4 w-4 mr-2" />
                All Users
              </TabsTrigger>
              <TabsTrigger value="colleagues" className="flex-1">
                <Building className="h-4 w-4 mr-2" />
                Colleagues
              </TabsTrigger>
              <TabsTrigger value="groups" className="flex-1">
                <Users className="h-4 w-4 mr-2" />
                Groups
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all-users">
              <UserSearch onSelectUser={handleSelectUser} />
            </TabsContent>

            <TabsContent value="colleagues">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search colleagues..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
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
              </div>
            </TabsContent>
            
            <TabsContent value="groups">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search groups..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
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
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
