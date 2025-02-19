
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useOrganizations = (isAdmin: boolean | undefined, userRole: string | undefined) => {
  const { data: userProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: userRole === 'org_admin',
  });

  const { data: organizations } = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      if (!isAdmin && userRole !== 'org_admin') {
        throw new Error("Not authorized to view organizations");
      }

      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    },
    enabled: isAdmin || userRole === 'org_admin',
  });

  return { organizations, userProfile };
};
