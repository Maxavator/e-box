
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUserRole = () => {
  const { data: isAdmin } = useQuery({
    queryKey: ['isGlobalAdmin'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('is_global_admin');
      if (error) throw error;
      return data;
    },
  });

  const { data: userRole } = useQuery({
    queryKey: ['userRole'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data?.role;
    },
  });

  return { isAdmin, userRole };
};
