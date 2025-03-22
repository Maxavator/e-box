
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Profile } from "@/types/database";
import type { UserWithRole } from "../types";

export const useUsers = (
  isAdmin: boolean | undefined, 
  userRole: string | undefined, 
  userProfile: Profile | undefined
) => {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      if (!isAdmin && userRole !== 'org_admin') {
        throw new Error("Not authorized to view users");
      }

      try {
        let profilesQuery = supabase
          .from('profiles')
          .select('*, last_activity');

        if (userRole === 'org_admin' && userProfile?.organization_id) {
          profilesQuery = profilesQuery.eq('organization_id', userProfile.organization_id);
        }

        const { data: profiles, error: profilesError } = await profilesQuery;
        if (profilesError) throw profilesError;

        const usersWithDetails = await Promise.all(
          profiles.map(async (profile) => {
            try {
              const { data: userRoles, error: rolesError } = await supabase
                .from('user_roles')
                .select('*')
                .eq('user_id', profile.id);
              
              if (rolesError) throw rolesError;

              let organizationData = [];
              if (profile.organization_id) {
                const { data: org, error: orgError } = await supabase
                  .from('organizations')
                  .select('name')
                  .eq('id', profile.organization_id)
                  .single();
                
                if (!orgError && org) {
                  organizationData = [{ name: org.name }];
                }
              }
              
              // Fetch user statistics
              const { data: userStats, error: statsError } = await supabase
                .from('user_statistics')
                .select('*')
                .eq('user_id', profile.id)
                .maybeSingle();
                
              if (statsError) console.error("Error fetching user statistics:", statsError);

              return {
                ...profile,
                user_roles: userRoles || [],
                organizations: organizationData,
                user_statistics: userStats || null
              } as UserWithRole;
            } catch (error) {
              console.error('Error fetching user details:', error);
              return {
                ...profile,
                user_roles: [],
                organizations: []
              } as UserWithRole;
            }
          })
        );

        return usersWithDetails;
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    },
    enabled: (isAdmin || userRole === 'org_admin') && (!userRole || userRole === 'org_admin' ? !!userProfile?.organization_id : true),
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching users:', error);
        toast.error("Failed to fetch users");
      }
    }
  });

  return { users, isLoading, error };
};
