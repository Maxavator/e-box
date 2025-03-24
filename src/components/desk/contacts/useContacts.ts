
import { useQueryClient } from "@tanstack/react-query";
import type { Contact } from "../types/contacts";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useOrganizationMembers } from "./useOrganizationMembers";
import { useContactsData } from "./useContactsData";
import { useContactFavorites } from "./useContactFavorites";

export const useContacts = () => {
  const queryClient = useQueryClient();
  const { organizationName, loading: loadingOrg } = useUserProfile();
  const { isLoadingMembers, error: membersError } = useOrganizationMembers();
  
  const { data: contacts, isLoading: isLoadingContacts, error: contactsError } = useContactsData(
    !loadingOrg && !isLoadingMembers
  );
  
  const { toggleFavoriteMutation } = useContactFavorites();

  return {
    contacts: contacts || [],
    isLoading: isLoadingContacts || loadingOrg || isLoadingMembers,
    error: contactsError || membersError,
    toggleFavoriteMutation
  };
};
