
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface UserProfileData {
  userId: string | null;
  userDisplayName: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  avatarUrl: string | null;
  jobTitle: string | null;
  organizationId: string | null;
  organizationName: string | null;
  isAdmin: boolean;
  loading: boolean;
  error: Error | null;
}

export const useUserProfile = (): UserProfileData => {
  const { data: session, isLoading: isSessionLoading, error: sessionError } = useQuery({
    queryKey: ['user-session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    },
  });

  const { data: profile, isLoading: isProfileLoading, error: profileError } = useQuery({
    queryKey: ['user-profile', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      if (!session?.user?.id) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url, job_title, organization_id')
        .eq('id', session.user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data;
    },
  });

  const { data: organizationName, isLoading: isOrgLoading, error: orgError } = useQuery({
    queryKey: ['organization-name', profile?.organization_id],
    enabled: !!profile?.organization_id,
    queryFn: async () => {
      if (!profile?.organization_id) return null;

      const { data, error } = await supabase
        .from('organizations')
        .select('name')
        .eq('id', profile.organization_id)
        .single();
      
      if (error) {
        console.error('Error fetching organization:', error);
        return null;
      }
      
      return data?.name || null;
    },
  });

  const { data: userRole, isLoading: isRoleLoading, error: roleError } = useQuery({
    queryKey: ['user-role', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      if (!session?.user?.id) return null;

      // Special case for Thabo Nkosi - always admin
      if (profile?.first_name === 'Thabo' && profile?.last_name === 'Nkosi') {
        return 'org_admin';
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }
      
      return data?.role || null;
    },
  });

  // Special case for Thabo Nkosi - set job title to "Chief Information Officer"
  let jobTitle = profile?.job_title || '';
  if (profile?.first_name === 'Thabo' && profile?.last_name === 'Nkosi') {
    jobTitle = 'Chief Information Officer';
  }

  // Format display name
  const firstName = profile?.first_name || '';
  const lastName = profile?.last_name || '';
  const displayName = firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || null;

  // Combine loading states
  const loading = isSessionLoading || isProfileLoading || isOrgLoading || isRoleLoading;
  
  // Combine errors (prioritize session errors)
  const error = sessionError || profileError || orgError || roleError;

  return {
    userId: session?.user?.id || null,
    userDisplayName: displayName,
    firstName: profile?.first_name || null,
    lastName: profile?.last_name || null,
    email: session?.user?.email || null,
    avatarUrl: profile?.avatar_url || null,
    jobTitle,
    organizationId: profile?.organization_id || null,
    organizationName,
    isAdmin: userRole === 'org_admin' || userRole === 'global_admin',
    loading,
    error,
  };
};
