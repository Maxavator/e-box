
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserProfileData {
  organizationName: string | null;
  firstName: string | null;
  lastName: string | null;
  loading: boolean;
  error: Error | null;
}

export function useUserProfile(): UserProfileData {
  const [organizationName, setOrganizationName] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        setLoading(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Get user's profile data
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('organization_id, first_name, last_name')
            .eq('id', user.id)
            .single();
            
          if (profileError) {
            throw profileError;
          }
          
          setFirstName(profileData?.first_name);
          setLastName(profileData?.last_name);
          
          if (profileData?.organization_id) {
            // Get organization name
            const { data: orgData, error: orgError } = await supabase
              .from('organizations')
              .select('name')
              .eq('id', profileData.organization_id)
              .single();
              
            if (orgError) {
              throw orgError;
            }
            
            // Remove the "(Pty) Ltd." suffix if present
            let orgName = orgData?.name || null;
            if (orgName) {
              orgName = orgName.replace(/\s*\(Pty\)\s*Ltd\.\s*$/i, '').trim();
            }
            
            setOrganizationName(orgName);
          }
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, []);

  return { organizationName, firstName, lastName, loading, error };
}
