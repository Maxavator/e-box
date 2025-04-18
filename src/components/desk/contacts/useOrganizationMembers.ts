
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type OrganizationMember = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  organization_id: string | null;
};

export const useOrganizationMembers = () => {
  const { data: organizationMembers = [], isLoading: isLoadingMembers, error } = useQuery({
    queryKey: ['organization-members'],
    queryFn: async () => {
      console.log("Fetching organization members...");
      
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

      // Get user's organization ID
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', userData.user.id)
        .maybeSingle();
      
      if (profileError) {
        console.error("Error fetching user profile:", profileError);
        throw profileError;
      }

      if (!userProfile?.organization_id) {
        console.log("No organization found for user");
        return [];
      }

      console.log("User's organization ID:", userProfile.organization_id);
      
      // Fetch all members in the organization
      const { data: members, error: membersError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, organization_id')
        .eq('organization_id', userProfile.organization_id);

      if (membersError) {
        console.error("Error fetching organization members:", membersError);
        throw membersError;
      }
      
      // Filter out the current user from the list
      const filteredMembers = members?.filter(member => member.id !== userData.user.id) || [];
      
      console.log("Found organization members:", filteredMembers.length);
      console.log("Organization members:", filteredMembers);
      
      return filteredMembers as OrganizationMember[];
    }
  });

  return {
    organizationMembers: organizationMembers || [],
    isLoadingMembers,
    error
  };
};
