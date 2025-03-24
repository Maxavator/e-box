
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/components/admin/hooks/useUserRole';

export interface OrganizationMember {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  role: UserRole;
  created_at: string;
  last_activity: string | null;
}

export function useOrganizationMembers() {
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    async function fetchOrganizationMembers() {
      try {
        setLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error('Not authenticated');
        }
        
        // Get user's organization ID
        const { data: userProfile, error: profileError } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('id', user.id)
          .single();
          
        if (profileError) {
          throw profileError;
        }
        
        if (!userProfile?.organization_id) {
          setMembers([]);
          return;
        }
        
        // Get all users in the organization
        const { data: profilesData, error: membersError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, created_at, last_activity')
          .eq('organization_id', userProfile.organization_id);
          
        if (membersError) {
          throw membersError;
        }
        
        // Get roles for all users
        const userIds = profilesData?.map(profile => profile.id) || [];
        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role')
          .in('user_id', userIds);
          
        if (rolesError) {
          throw rolesError;
        }
        
        // Get email addresses
        const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
        
        if (usersError) {
          // This might fail if the user doesn't have admin access
          console.warn('Could not fetch email addresses:', usersError);
        }
        
        // Create a map of user IDs to roles
        const rolesMap: Record<string, UserRole> = {};
        rolesData?.forEach(roleData => {
          rolesMap[roleData.user_id] = roleData.role as UserRole;
        });
        
        // Create a map of user IDs to emails
        const emailsMap: Record<string, string> = {};
        if (usersData?.users) {
          usersData.users.forEach(userData => {
            emailsMap[userData.id] = userData.email;
          });
        }
        
        // Combine the data
        const organizationMembers: OrganizationMember[] = profilesData?.map(profile => ({
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: emailsMap[profile.id] || `user-${profile.id.substring(0, 8)}@example.com`,
          role: (rolesMap[profile.id] as UserRole) || 'user',
          created_at: profile.created_at,
          last_activity: profile.last_activity
        })) || [];
        
        setMembers(organizationMembers);
      } catch (err) {
        console.error('Error fetching organization members:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    }
    
    fetchOrganizationMembers();
  }, [refreshTrigger]);

  const refreshMembers = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return { members, loading, error, refreshMembers };
}
