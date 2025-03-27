
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
    isLoadingContacts,
    isLoadingColleagues,
    isLoadingGroups,
    handleSelectUser,
    handleSelectColleague,
    handleSelectGroup
  };
}
