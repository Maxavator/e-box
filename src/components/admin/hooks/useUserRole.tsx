
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserRoleType } from "@/types/supabase-types";

export const useUserRole = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user-role'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { userRole: null };

        const { data: roleData, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        return { userRole: roleData?.role || 'user' as UserRoleType };
      } catch (err) {
        console.error('Error fetching user role:', err);
        return { userRole: 'user' as UserRoleType };
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  return {
    userRole: data?.userRole || null,
    isLoading,
    error,
  };
};
