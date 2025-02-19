
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Organization } from "../../types";
import type { Session } from "@supabase/supabase-js";

export const useOrganizationData = (session: Session | null, isAdmin: boolean | undefined) => {
  const { data: organizations, isLoading } = useQuery({
    queryKey: ['organizations', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) {
        throw new Error("Not authenticated");
      }

      if (!isAdmin) {
        throw new Error("Not authorized to view organizations");
      }

      const { data, error } = await supabase
        .from('organizations')
        .select(`
          *,
          profiles (
            id
          )
        `)
        .order('name');

      if (error) throw error;

      return data.map(org => ({
        ...org,
        profiles: {
          count: org.profiles?.length || 0
        }
      })) as Organization[];
    },
    enabled: !!session?.user?.id && isAdmin === true,
  });

  return { organizations, isLoading };
};
