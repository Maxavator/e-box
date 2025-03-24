
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/useUserProfile";

export type UserRole = 'global_admin' | 'org_admin' | 'staff' | 'user' | 'hr_moderator' | 'comm_moderator' | 'stakeholder_moderator';

export const useUserRole = () => {
  const [userRole, setUserRole] = useState<UserRole>();
  const [isAdmin, setIsAdmin] = useState<boolean>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        setIsLoading(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Get user roles from the database
          const { data: userRoles, error: rolesError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id);
            
          if (rolesError) {
            throw rolesError;
          }
          
          // Use the first role found, or default to 'user'
          const role = userRoles && userRoles.length > 0 
            ? userRoles[0].role as UserRole
            : 'user';
            
          setUserRole(role);
          
          // Determine if user is an admin
          setIsAdmin(role === 'global_admin');
        } else {
          setUserRole('user');
          setIsAdmin(false);
        }
      } catch (err) {
        console.error('Error fetching user role:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setUserRole('user');
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  return { isAdmin, userRole, isLoading, error };
};
