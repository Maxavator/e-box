
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface UserProfileData {
  organizationName: string | null;
  organizationId: string | null;
  loading: boolean;
  error: Error | null;
  userDisplayName: string | null;
  userJobTitle: string | null;
  refreshProfile: () => Promise<void>;
}

export function useUserProfile(): UserProfileData {
  const [organizationName, setOrganizationName] = useState<string | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [userDisplayName, setUserDisplayName] = useState<string | null>(null);
  const [userJobTitle, setUserJobTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const queryClient = useQueryClient();

  // First check if user is authenticated using a query
  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ['profile-auth-session'],
    queryFn: async () => {
      console.log('useUserProfile: Fetching auth session');
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('useUserProfile: Session error:', error);
        throw error;
      }
      console.log('useUserProfile: Session data:', session);
      return session;
    },
  });

  // Fetch user profile data only when session is available
  const { data: profileData, isLoading: isProfileLoading, error: profileError } = useQuery({
    queryKey: ['profile-user-profile-data', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      console.log('useUserProfile: Fetching profile data for user:', session?.user?.id);
      
      // Get user profile data including organization_id and name
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id, first_name, last_name, job_title')
        .eq('id', session!.user.id)
        .maybeSingle();
        
      if (profileError) {
        console.error('useUserProfile: Profile error:', profileError);
        throw profileError;
      }
      
      console.log('useUserProfile: Profile data:', profileData);
      
      let orgName = null;
      // Get organization name if user has an organization
      if (profileData?.organization_id) {
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .select('name')
          .eq('id', profileData.organization_id)
          .maybeSingle();
          
        if (orgError) {
          console.error('useUserProfile: Organization error:', orgError);
        } else {
          console.log('useUserProfile: Organization data:', orgData);
          orgName = orgData?.name || null;
        }
      }
      
      return {
        profileData,
        orgName,
        jobTitle: profileData?.job_title || null
      };
    },
  });

  // Update state based on query results
  useEffect(() => {
    setLoading(isSessionLoading || isProfileLoading);
    
    if (!isSessionLoading && !session) {
      setError(new Error("Not authenticated"));
      setLoading(false);
      return;
    }
    
    if (profileError) {
      setError(profileError instanceof Error ? profileError : new Error(String(profileError)));
      // Show toast notification for error
      toast.error("Failed to load profile information", {
        description: "Please try refreshing the page or contact support."
      });
    }
    
    if (profileData) {
      if (profileData.profileData?.first_name && profileData.profileData?.last_name) {
        setUserDisplayName(`${profileData.profileData.first_name} ${profileData.profileData.last_name}`);
      } else if (profileData.profileData?.first_name) {
        setUserDisplayName(profileData.profileData.first_name);
      } else if (profileData.profileData?.last_name) {
        setUserDisplayName(profileData.profileData.last_name);
      }
      
      setUserJobTitle(profileData.jobTitle);
      
      if (profileData.profileData?.organization_id) {
        setOrganizationId(profileData.profileData.organization_id);
        setOrganizationName(profileData.orgName);
      } else {
        // Reset organization data if user is not associated with an organization
        setOrganizationId(null);
        setOrganizationName(null);
      }
    }
  }, [isSessionLoading, isProfileLoading, session, profileData, profileError]);

  const refreshProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Invalidate all profile-related queries to force refetch
      queryClient.invalidateQueries({ queryKey: ['profile-auth-session'] });
      
      if (session?.user?.id) {
        queryClient.invalidateQueries({ queryKey: ['profile-user-profile-data', session.user.id] });
      }
      
      toast.success("Profile information refreshed successfully");
    } catch (err) {
      console.error('Error refreshing user profile:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      
      // Show toast notification for error
      toast.error("Failed to refresh profile information", {
        description: "Please try again or contact support."
      });
    } finally {
      setLoading(false);
    }
  };

  return { 
    organizationName, 
    organizationId,
    userDisplayName,
    userJobTitle,
    loading, 
    error,
    refreshProfile
  };
}
