
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url?: string | null;
  organization_id: string | null;
  job_title?: string | null;
  sa_id?: string | null;
  province?: string | null;
  is_private?: boolean;
}

interface UserProfileData {
  organizationName: string | null;
  organizationId: string | null;
  loading: boolean;
  error: Error | null;
  userDisplayName: string | null;
  userJobTitle: string | null;
  refreshProfile: () => Promise<void>;
  profile: Profile | null; // This is the main profile data
}

export function useUserProfile(): UserProfileData {
  const [organizationName, setOrganizationName] = useState<string | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [userDisplayName, setUserDisplayName] = useState<string | null>(null);
  const [userJobTitle, setUserJobTitle] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
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
    retry: 1,
    staleTime: 30000, // Reduce stale time to refresh more often
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
        .select('organization_id, first_name, last_name, job_title, sa_id, province, is_private, avatar_url, id')
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
    retry: 2,
    staleTime: 60000,
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
      console.log("Setting profile data:", profileData.profileData);
      
      // Set the complete profile data
      setProfile(profileData.profileData);
      
      // Constructing display name with extra debugging to trace issues
      const firstName = profileData.profileData?.first_name || '';
      const lastName = profileData.profileData?.last_name || '';
      console.log(`DEBUG: firstName="${firstName}", lastName="${lastName}"`);
      
      // Create user display name, ensuring we handle all cases properly
      if (firstName && lastName) {
        const fullName = `${firstName} ${lastName}`;
        console.log(`DEBUG: Setting fullName="${fullName}"`);
        setUserDisplayName(fullName);
      } else if (firstName) {
        console.log(`DEBUG: Setting firstName only="${firstName}"`);
        setUserDisplayName(firstName);
      } else if (lastName) {
        console.log(`DEBUG: Setting lastName only="${lastName}"`);
        setUserDisplayName(lastName);
      } else {
        console.log(`DEBUG: No name found, using default="User"`);
        setUserDisplayName("User");
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
    refreshProfile,
    profile // Return the profile in the hook result
  };
}
