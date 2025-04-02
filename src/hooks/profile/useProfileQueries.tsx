
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Profile, ProfileQueryResult } from '@/types/profile';

export const useProfileQueries = () => {
  const queryClient = useQueryClient();

  // Fetch user session
  const { 
    data: session, 
    isLoading: isSessionLoading,
    error: sessionError 
  } = useQuery({
    queryKey: ['profile-auth-session'],
    queryFn: async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('useProfileQueries: Session error:', error);
          throw error;
        }
        console.log('useProfileQueries: Session found:', session ? 'yes' : 'no');
        return session;
      } catch (err) {
        console.error('useProfileQueries: Failed to get session:', err);
        return null;
      }
    },
    retry: 1,
    staleTime: 30000,
  });

  // Fetch profile data when session is available
  const { 
    data: profileData, 
    isLoading: isProfileLoading,
    error: profileError
  } = useQuery({
    queryKey: ['profile-user-profile-data', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      try {
        console.log('useProfileQueries: Fetching profile for user:', session!.user.id);
        
        // Get user profile data - ensure we select all needed fields
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('organization_id, first_name, last_name, job_title, sa_id, province, is_private, avatar_url, id')
          .eq('id', session!.user.id)
          .maybeSingle();
          
        if (profileError) {
          console.error('useProfileQueries: Profile error:', profileError);
          throw profileError;
        }
        
        console.log('useProfileQueries: Raw profile data:', profileData);
        
        let orgName = null;
        let jobTitle = null;
        
        // Get organization name if user has an organization
        if (profileData?.organization_id) {
          const { data: orgData, error: orgError } = await supabase
            .from('organizations')
            .select('name')
            .eq('id', profileData.organization_id)
            .maybeSingle();
            
          if (orgError) {
            console.error('useProfileQueries: Organization error:', orgError);
          } else {
            orgName = orgData?.name || null;
          }
        }
        
        // Set job title
        jobTitle = profileData?.job_title || null;
        
        console.log('useProfileQueries: Processed data:', {
          profileData, 
          orgName,
          jobTitle
        });
        
        return {
          profileData,
          orgName,
          jobTitle
        } as ProfileQueryResult;
      } catch (err) {
        console.error('useProfileQueries: Failed to fetch profile data:', err);
        throw err;
      }
    },
    retry: 2,
    staleTime: 60000,
  });

  // Invalidate queries to refresh data
  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['profile-auth-session'] });
    
    if (session?.user?.id) {
      queryClient.invalidateQueries({ queryKey: ['profile-user-profile-data', session.user.id] });
    }
  };

  return {
    session,
    isSessionLoading,
    sessionError,
    profileData,
    isProfileLoading,
    profileError,
    invalidateQueries
  };
};
