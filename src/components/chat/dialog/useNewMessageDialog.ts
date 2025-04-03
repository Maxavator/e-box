import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url?: string;
  organization_id: string | null;
  job_title?: string;
  sa_id?: string;
  province?: string;
}

interface Group {
  id: string;
  name: string;
  is_public: boolean;
  avatar_url?: string;
}

interface RecentContact extends Profile {
  last_contact: string;
}

export function useNewMessageDialog(onSelectConversation?: (conversationId: string) => void) {
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all-users");
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
        .select('id, first_name, last_name, avatar_url, organization_id, job_title, sa_id, province')
        .eq('organization_id', profile.organization_id)
        .eq('is_private', false)
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
        .select('id, first_name, last_name, avatar_url, organization_id, job_title, sa_id, province')
        .eq('organization_id', profile.organization_id)
        .eq('is_private', false)
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

  const { data: recentContacts = [], isLoading: isLoadingRecents } = useQuery({
    queryKey: ['recent-contacts'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) throw new Error('Not authenticated');
      
      const userId = session.session.user.id;
      
      const { data: recentConversations, error: convError } = await supabase
        .from('conversations')
        .select('id, user1_id, user2_id, updated_at')
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .order('updated_at', { ascending: false })
        .limit(10);
      
      if (convError) throw convError;
      if (!recentConversations || recentConversations.length === 0) return [];
      
      const otherUserIds = recentConversations.map(conv => 
        conv.user1_id === userId ? conv.user2_id : conv.user1_id
      );
      
      const { data: recentProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, job_title')
        .in('id', otherUserIds);
      
      if (profilesError) throw profilesError;
      if (!recentProfiles) return [];
      
      return recentProfiles.map(profile => {
        const conversation = recentConversations.find(conv => 
          conv.user1_id === profile.id || conv.user2_id === profile.id
        );
        
        return {
          ...profile,
          last_contact: conversation?.updated_at || new Date().toISOString()
        };
      });
    },
    enabled: activeTab === "recent" || dialogOpen
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
        
        setDialogOpen(false);
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
      setDialogOpen(false);
    }
  };

  const handleSelectUser = async (user: any) => {
    handleSelectContact(user);
  };

  const handleSelectColleague = async (colleague: Profile) => {
    handleSelectContact(colleague);
  };

  const handleSelectRecent = async (contact: RecentContact) => {
    handleSelectContact(contact);
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
      
      setDialogOpen(false);
    } catch (error) {
      console.error('Error joining group:', error);
      toast({
        title: "Error",
        description: "Failed to join group conversation",
        variant: "destructive"
      });
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    dialogOpen,
    setDialogOpen,
    activeTab,
    setActiveTab,
    contacts,
    colleagues,
    groups,
    recentContacts,
    isLoadingContacts,
    isLoadingColleagues,
    isLoadingGroups,
    isLoadingRecents,
    handleSelectUser,
    handleSelectColleague,
    handleSelectGroup,
    handleSelectRecent
  };
}
