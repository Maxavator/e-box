
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type UserRoleType = Database['public']['Enums']['user_role'];

export const useUserRole = () => {
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    },
  });

  const { data: isAdmin, isLoading: isAdminLoading, error: adminError } = useQuery({
    queryKey: ['isGlobalAdmin', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      console.log('Checking admin status for user ID:', session?.user?.id);
      try {
        // First check for global_admin role
        const { data: globalAdminData, error: globalAdminError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session!.user.id)
          .eq('role', 'global_admin')
          .maybeSingle();

        if (globalAdminError) {
          console.error('Error checking global_admin role:', globalAdminError);
          return false;
        }
        
        const isGlobalAdmin = !!globalAdminData;
        console.log('Is global admin:', isGlobalAdmin);
        
        // If not a global admin, check for org_admin role
        if (!isGlobalAdmin) {
          const { data: orgAdminData, error: orgAdminError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session!.user.id)
            .eq('role', 'org_admin')
            .maybeSingle();
            
          if (orgAdminError) {
            console.error('Error checking org_admin role:', orgAdminError);
            return false;
          }
          
          const isOrgAdmin = !!orgAdminData;
          console.log('Is org admin:', isOrgAdmin);
          return isGlobalAdmin || isOrgAdmin;
        }
        
        return isGlobalAdmin;
      } catch (error) {
        console.error('Admin status check failed:', error);
        return false;
      }
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * (attemptIndex + 1), 3000),
  });

  const { data: userRole, isLoading: isRoleLoading, error: roleError } = useQuery({
    queryKey: ['userRole', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      console.log('Fetching user role for user ID:', session?.user?.id);
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session!.user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user role:', error);
          return 'user' as UserRoleType;
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
        return 'user' as UserRoleType;
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
    isAdmin: isAdmin || false, 
    userRole: userRole || 'user', 
    isLoading, 
    error 
  };
};
