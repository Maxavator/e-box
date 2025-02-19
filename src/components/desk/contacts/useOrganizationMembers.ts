
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type OrganizationMember = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  organization_id: string | null;
};

export const useOrganizationMembers = () => {
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

  return {
    organizationMembers,
    isLoadingMembers
  };
};
