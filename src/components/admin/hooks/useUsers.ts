
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Profile } from "@/types/database";
import type { UserWithRole } from "../types";

export const useUsers = (
  isAdmin: boolean | undefined, 
  userRole: string | undefined, 
  userProfile: Profile | undefined,
  refreshTrigger: number = 0,
  organizationFilter?: string | null
) => {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users', refreshTrigger, organizationFilter],
    queryFn: async () => {
      if (!isAdmin && userRole !== 'org_admin') {
        throw new Error("Not authorized to view users");
      }

      try {
        let profilesQuery = supabase
          .from('profiles')
          .select('*');

        // If filtering by organization_id is specified, use that
        if (organizationFilter) {
          profilesQuery = profilesQuery.eq('organization_id', organizationFilter);
          console.log(`Filtering by organization: ${organizationFilter}`);
        } 
        // If user is org_admin, always filter by their organization
        else if (userRole === 'org_admin' && userProfile?.organization_id) {
          profilesQuery = profilesQuery.eq('organization_id', userProfile.organization_id);
          console.log(`Org admin filtering by their organization: ${userProfile.organization_id}`);
        }
        // For global admins with no filter, return all profiles

        const { data: profiles, error: profilesError } = await profilesQuery;
        if (profilesError) throw profilesError;

        console.log(`Found ${profiles?.length || 0} profiles`);

        // Get organization details for all profiles in a single query to improve performance
        const organizationIds = profiles
          ?.filter(profile => profile.organization_id)
          .map(profile => profile.organization_id) || [];
        
        const uniqueOrgIds = [...new Set(organizationIds)];
        
        let organizationsMap: Record<string, string> = {};
        if (uniqueOrgIds.length > 0) {
          const { data: organizations, error: orgsError } = await supabase
            .from('organizations')
            .select('id, name')
            .in('id', uniqueOrgIds);
          
          if (!orgsError && organizations) {
            organizationsMap = organizations.reduce((acc, org) => {
              acc[org.id] = org.name;
              return acc;
            }, {} as Record<string, string>);
          }
        }

        // Fetch all user roles in a single query
        const { data: allUserRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('*')
          .in('user_id', profiles?.map(profile => profile.id) || []);
        
        if (rolesError) throw rolesError;

        // Create a map of user_id to roles for quick lookup
        const userRolesMap = (allUserRoles || []).reduce((acc, role) => {
          if (!acc[role.user_id]) {
            acc[role.user_id] = [];
          }
          acc[role.user_id].push(role);
          return acc;
        }, {} as Record<string, any[]>);

        // Skip auth status check since the table doesn't exist
        const authStatusMap: Record<string, boolean> = {};

        const usersWithDetails = (profiles || []).map(profile => {
          const orgName = profile.organization_id && organizationsMap[profile.organization_id];
          
          return {
            ...profile,
            user_roles: userRolesMap[profile.id] || [],
            organizations: orgName ? [{ name: orgName }] : [],
            is_active: authStatusMap[profile.id] || false
          } as UserWithRole;
        });

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
