
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type UserRoleType = Database['public']['Enums']['user_role'];

export const useUserRole = () => {
  const { data: isAdmin, isLoading: isAdminLoading, error: adminError } = useQuery({
    queryKey: ['isGlobalAdmin'],
    queryFn: async () => {
      console.log('Checking admin status...');
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log('No authenticated user found');
          return false;
        }
        
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'global_admin')
          .maybeSingle();

        if (error) {
          console.error('Error checking admin role:', error);
          throw error;
        }
        
        return !!data;
      } catch (error) {
        console.error('Admin status check failed:', error);
        return false;
      }
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * (attemptIndex + 1), 3000),
  });

  const { data: userRole, isLoading: isRoleLoading, error: roleError } = useQuery({
    queryKey: ['userRole'],
    queryFn: async () => {
      console.log('Fetching user role...');
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          console.log('Authentication error or no user found:', authError);
          return null;
        }

        console.log('User authenticated, fetching role for user ID:', user.id);
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user role:', error);
          throw error;
        }
        
        // If no role is found, return 'user' as default role
        if (!data) {
          console.log('No specific role found, defaulting to user');
          return 'user' as UserRoleType;
        }
        
        console.log('User role found:', data.role);
        return data.role as UserRoleType;
      } catch (error) {
        console.error('Failed to fetch user role:', error);
        return null;
      }
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * (attemptIndex + 1), 3000),
  });

  const isLoading = isAdminLoading || isRoleLoading;
  const error = adminError || roleError;

  if (error && !isLoading) {
    console.error('Role checking error:', error);
  }

  return { 
    isAdmin, 
    userRole, 
    isLoading, 
    error 
  };
};
