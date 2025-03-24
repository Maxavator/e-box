
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Contact } from "../types/contacts";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useOrganizationMembers } from "./useOrganizationMembers";

export const useContacts = () => {
  const queryClient = useQueryClient();
  const { organizationName, loading: loadingOrg } = useUserProfile();
  const { organizationMembers, isLoadingMembers, error: membersError } = useOrganizationMembers();

  const { data: contacts, isLoading: isLoadingContacts, error: contactsError } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      console.log("Fetching contacts...");
      
      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error("Error fetching user data:", userError);
        throw userError;
      }
      
      if (!userData.user) {
        console.error("Not authenticated");
        throw new Error("Not authenticated");
      }
      
      console.log("Current user ID:", userData.user.id);

      // Get user's organization ID for colleague check
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', userData.user.id)
        .maybeSingle();
      
      if (profileError) {
        console.error("Error fetching user profile:", profileError);
        throw profileError;
      }

      // Fetch user's explicit contacts
      const { data: userContacts, error: contactsError } = await supabase
        .from('contacts')
        .select('id, user_id, contact_id, is_favorite, created_at')
        .eq('user_id', userData.user.id);

      if (contactsError) {
        console.error("Error fetching user contacts:", contactsError);
        throw contactsError;
      }

      console.log("User explicit contacts:", userContacts?.length || 0);

      // For each contact, fetch the profile details
      const contactsWithProfiles = await Promise.all((userContacts || []).map(async (contact) => {
        const { data: contactProfile, error: profileError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, organization_id')
          .eq('id', contact.contact_id)
          .maybeSingle();
          
        if (profileError) {
          console.error(`Error fetching profile for contact ID ${contact.contact_id}:`, profileError);
          return null;
        }
          
        return {
          ...contact,
          is_colleague: contactProfile?.organization_id === userProfile?.organization_id,
          contact: contactProfile || {
            id: contact.contact_id,
            first_name: null,
            last_name: null,
            organization_id: null
          }
        };
      })).then(results => results.filter(Boolean));
      
      // Convert to map for easy lookup
      const contactsMap = new Map();
      contactsWithProfiles.forEach(contact => {
        if (contact) {
          contactsMap.set(contact.contact_id, contact);
        }
      });
      
      // Add all organization members as contacts if they're not already contacts
      if (organizationMembers && organizationMembers.length > 0) {
        console.log("Adding organization members to contacts...");
        
        for (const member of organizationMembers) {
          // Skip if already in contacts
          if (contactsMap.has(member.id)) {
            const existingContact = contactsMap.get(member.id);
            existingContact.is_colleague = true;
            contactsMap.set(member.id, existingContact);
            continue;
          }
          
          console.log("Adding organization member to contacts:", member.first_name, member.last_name);
          
          // Add as a virtual contact
          contactsMap.set(member.id, {
            id: `org-${member.id}`,
            user_id: userData.user.id,
            contact_id: member.id,
            is_favorite: false,
            is_colleague: true,
            created_at: new Date().toISOString(),
            contact: member
          });
          
          // Try to add the member as a contact in the database
          try {
            const { error: insertError } = await supabase
              .from('contacts')
              .insert({
                user_id: userData.user.id,
                contact_id: member.id,
                is_favorite: false
              });
            
            if (insertError) {
              console.error("Error adding colleague to contacts:", insertError);
            }
          } catch (error) {
            console.error("Error during contact insertion:", error);
          }
        }
      } else {
        console.log("No organization members to add to contacts or error fetching members:", membersError);
      }
      
      const result = Array.from(contactsMap.values()) as Contact[];
      console.log("Final contacts list count:", result.length);
      console.log("Final contacts:", result);
      return result;
    },
    enabled: !loadingOrg && !isLoadingMembers
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
        .maybeSingle();

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
    contacts: contacts || [],
    isLoading: isLoadingContacts || loadingOrg || isLoadingMembers,
    error: contactsError || membersError,
    toggleFavoriteMutation
  };
};
