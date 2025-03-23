
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Contact } from "../types/contacts";
import { useUserProfile } from "@/hooks/useUserProfile";

export const useContacts = () => {
  const queryClient = useQueryClient();
  const { organizationName, loading: loadingOrg } = useUserProfile();

  const { data: contacts, isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      // Get user's organization ID
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', userData.user.id)
        .single();

      if (!userProfile?.organization_id) {
        return []; // Return empty array if user has no organization
      }

      // First, fetch ALL organization members including the current user
      const { data: allOrgMembers, error: orgMembersError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, organization_id')
        .eq('organization_id', userProfile.organization_id);

      if (orgMembersError) throw orgMembersError;
      
      // Filter out the current user
      const orgMembers = allOrgMembers.filter(member => member.id !== userData.user.id);

      // Then fetch user's explicit contacts
      const { data: userContacts, error: contactsError } = await supabase
        .from('contacts')
        .select(`
          id,
          user_id,
          contact_id,
          is_favorite,
          created_at,
          contact:profiles (
            id,
            first_name,
            last_name,
            organization_id
          )
        `)
        .eq('user_id', userData.user.id);

      if (contactsError) throw contactsError;
      
      // Convert to map for easy lookup
      const contactsMap = new Map();
      (userContacts as any[]).forEach(contact => {
        contactsMap.set(contact.contact_id, {
          ...contact,
          is_colleague: contact.contact?.organization_id === userProfile.organization_id,
          contact: contact.contact || {
            id: contact.contact_id,
            first_name: null,
            last_name: null,
            organization_id: null
          }
        });
      });
      
      // Add all organization members as colleagues if they're not already in contacts
      orgMembers.forEach(member => {
        if (!contactsMap.has(member.id)) {
          // Create virtual contact entry for organization member
          contactsMap.set(member.id, {
            id: `org-${member.id}`, // Use prefix to create unique id
            user_id: userData.user.id,
            contact_id: member.id,
            is_favorite: false,
            is_colleague: true,
            created_at: new Date().toISOString(),
            contact: {
              id: member.id,
              first_name: member.first_name,
              last_name: member.last_name,
              organization_id: member.organization_id
            }
          });
        }
      });
      
      return Array.from(contactsMap.values()) as Contact[];
    },
    enabled: !loadingOrg
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({ contactId, isFavorite }: { contactId: string, isFavorite: boolean }) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      // Check if contact exists
      const { data: existingContact } = await supabase
        .from('contacts')
        .select('id')
        .eq('user_id', userData.user.id)
        .eq('contact_id', contactId)
        .single();

      if (existingContact) {
        // Update existing contact
        const { error } = await supabase
          .from('contacts')
          .update({ is_favorite: isFavorite })
          .eq('user_id', userData.user.id)
          .eq('contact_id', contactId);

        if (error) throw error;
      } else {
        // Create new contact with favorite status
        const { error } = await supabase
          .from('contacts')
          .insert([
            { user_id: userData.user.id, contact_id: contactId, is_favorite: isFavorite }
          ]);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success("Contact updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update contact: " + error.message);
    }
  });

  return {
    contacts,
    isLoading: isLoading || loadingOrg,
    toggleFavoriteMutation
  };
};
