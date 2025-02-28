
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type UserRoleType = Database['public']['Enums']['user_role'];

export const useUserRole = () => {
  const { data: isAdmin, isLoading: isAdminLoading, error: adminError } = useQuery({
    queryKey: ['isGlobalAdmin'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'global_admin')
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    meta: {
      onError: (error: Error) => {
        console.error('Error checking admin status:', error);
        toast.error("Failed to verify admin status");
      }
    }
  });

  const { data: userRole, isLoading: isRoleLoading, error: roleError } = useQuery({
    queryKey: ['userRole'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      
      // If no role is found, return 'user' as default role
      if (!data) return 'user' as UserRoleType;
      
      return data.role as UserRoleType;
    },
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching user role:', error);
        toast.error("Failed to fetch user role");
      }
    }
  });

  const isLoading = isAdminLoading || isRoleLoading;
  const error = adminError || roleError;

  return { isAdmin, userRole, isLoading, error };
};
