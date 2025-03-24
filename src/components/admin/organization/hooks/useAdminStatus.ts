
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { useAuthSession } from "./useAuthSession";

export const useAdminStatus = () => {
  const { session } = useAuthSession();
  
  const { data: isAdmin = false, isLoading, error } = useQuery({
    queryKey: ['isGlobalAdmin', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return false;

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'global_admin')
        .maybeSingle();

      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }

      return !!data;
    },
    enabled: !!session?.user?.id,
  });

  const { data: userRole = 'user' } = useQuery({
    queryKey: ['userRole', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return 'user';

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking user role:', error);
        return 'user';
      }

      return data?.role || 'user';
    },
    enabled: !!session?.user?.id,
  });

  return { 
    isAdmin, 
    userRole, 
    isLoading, 
    error, 
    session 
  };
};
