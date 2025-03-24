
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type OrganizationMember = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  organization_id: string | null;
};

export const useOrganizationMembers = () => {
  const { data: organizationMembers = [], isLoading: isLoadingMembers } = useQuery({
    queryKey: ['organization-members'],
    queryFn: async () => {
      console.log("Fetching organization members...");
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        console.error("Not authenticated");
        throw new Error("Not authenticated");
      }

      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', userData.user.id)
        .maybeSingle();
      
      if (profileError) {
        console.error("Error fetching user profile:", profileError);
      }

      if (!userProfile?.organization_id) {
        console.log("No organization found for user");
        return [];
      }

      console.log("Fetching members for organization:", userProfile.organization_id);
      
      // Fetch all members in the organization
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, organization_id')
        .eq('organization_id', userProfile.organization_id);

      if (error) {
        console.error("Error fetching organization members:", error);
        throw error;
      }
      
      console.log("Found organization members:", data?.length);
      console.log("Organization members:", data);
      
      return data as OrganizationMember[];
    }
  });

  return {
    organizationMembers: organizationMembers || [],
    isLoadingMembers
  };
};
