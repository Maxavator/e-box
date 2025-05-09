
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type UserRoleType = Database['public']['Enums']['user_role'];

// Global admin SA IDs - users with these IDs will automatically have global admin access
const GLOBAL_ADMIN_SA_IDS = ['4010203040512', '7810205441087', '8905115811087'];

export const useUserRole = () => {
  const { data: session, isLoading: isSessionLoading, error: sessionError } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Session error:', error);
        return null;
      }
      return session;
    },
  });

  const userId = session?.user?.id;
  const userSaId = session?.user?.user_metadata?.sa_id;

  const { data: isAdmin, isLoading: isAdminLoading, error: adminError } = useQuery({
    queryKey: ['isAdmin', userId],
    enabled: !!userId,
    queryFn: async () => {
      console.log('Checking admin status for user ID:', userId);
      
      // First check if the user has one of the hardcoded global admin SA IDs
      if (userSaId && GLOBAL_ADMIN_SA_IDS.includes(userSaId)) {
        console.log('User has global admin SA ID:', userSaId);
        return true;
      }
      
      // Special case for Thabo Nkosi - always admin
      if (userId) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', userId)
          .maybeSingle();
          
        if (profileData?.first_name === 'Thabo' && profileData?.last_name === 'Nkosi') {
          console.log('User is Thabo Nkosi - granting admin access');
          return true;
        }
      }
      
      // First check for global_admin role
      const { data: globalAdminData, error: globalAdminError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'global_admin')
        .maybeSingle();

      if (globalAdminError) {
        console.error('Error checking global_admin role:', globalAdminError);
        return false;
      }
      
      const isGlobalAdmin = !!globalAdminData;
      console.log('Is global admin:', isGlobalAdmin);
      
      if (isGlobalAdmin) return true;
      
      // If not a global admin, check for org_admin role
      const { data: orgAdminData, error: orgAdminError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'org_admin')
        .maybeSingle();
        
      if (orgAdminError) {
        console.error('Error checking org_admin role:', orgAdminError);
        return false;
      }
      
      const isOrgAdmin = !!orgAdminData;
      console.log('Is org admin:', isOrgAdmin);
      
      return isGlobalAdmin || isOrgAdmin;
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * (attemptIndex + 1), 3000),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const { data: userRole, isLoading: isRoleLoading, error: roleError } = useQuery({
    queryKey: ['userRole', userId],
    enabled: !!userId,
    queryFn: async () => {
      console.log('Fetching user role for user ID:', userId);
      
      // Special case for predefined global admin SA IDs
      if (userSaId && GLOBAL_ADMIN_SA_IDS.includes(userSaId)) {
        console.log('User has global admin SA ID - setting role to global_admin');
        return 'global_admin' as UserRoleType;
      }
      
      // Special case for Thabo Nkosi - always org_admin
      if (userId) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', userId)
          .maybeSingle();
          
        if (profileData?.first_name === 'Thabo' && profileData?.last_name === 'Nkosi') {
          console.log('User is Thabo Nkosi - setting role to org_admin');
          return 'org_admin' as UserRoleType;
        }
      }
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
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
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * (attemptIndex + 1), 3000),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const isLoading = isSessionLoading || isAdminLoading || isRoleLoading;
  const error = sessionError || adminError || roleError;

  return {
    // If specifically checking for admin status, we should return the definitive isAdmin value
    isAdmin: isAdmin === true,
    // For the user role, we provide a default 'user' if not loaded yet
    userRole: userRole || 'user',
    isLoading,
    error,
    // Include session for components that need it
    session
  };
};
