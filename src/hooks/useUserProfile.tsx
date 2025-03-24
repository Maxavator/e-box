
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserProfileData {
  organizationName: string | null;
  organizationId: string | null;
  loading: boolean;
  error: Error | null;
  userDisplayName: string | null;
  refreshProfile: () => Promise<void>;
}

export function useUserProfile(): UserProfileData {
  const [organizationName, setOrganizationName] = useState<string | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [userDisplayName, setUserDisplayName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // Get user profile data including organization_id and name
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id, first_name, last_name')
        .eq('id', user.id)
        .single();
        
      if (profileError) {
        throw profileError;
      }
      
      if (profileData?.first_name && profileData?.last_name) {
        setUserDisplayName(`${profileData.first_name} ${profileData.last_name}`);
      }
      
      if (profileData?.organization_id) {
        setOrganizationId(profileData.organization_id);
        
        // Get organization name
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .select('name')
          .eq('id', profileData.organization_id)
          .single();
          
        if (orgError) {
          throw orgError;
        }
        
        // Use the full organization name
        setOrganizationName(orgData?.name || null);
      } else {
        // Reset organization data if user is not associated with an organization
        setOrganizationId(null);
        setOrganizationName(null);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      
      // Show toast notification for error
      toast.error("Failed to load profile information", {
        description: "Please try refreshing the page or contact support."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const refreshProfile = async () => {
    await fetchUserProfile();
  };

  return { 
    organizationName, 
    organizationId,
    userDisplayName,
    loading, 
    error,
    refreshProfile
  };
}
