
import { useState, useEffect } from 'react';
import { Profile } from '@/types/profile';
import { useProfileQueries } from './useProfileQueries';

export const useProfileState = () => {
  const [organizationName, setOrganizationName] = useState<string | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [userDisplayName, setUserDisplayName] = useState<string | null>(null);
  const [userJobTitle, setUserJobTitle] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const {
    session,
    isSessionLoading,
    sessionError,
    profileData,
    isProfileLoading,
    profileError,
  } = useProfileQueries();

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
    }
    
    if (profileData) {
      // Set the complete profile data
      setProfile(profileData.profileData);
      
      // Handle name construction for display
      const firstName = profileData.profileData?.first_name || '';
      const lastName = profileData.profileData?.last_name || '';
      
      // Log full details for debugging
      console.log('useProfileState: Name fields -', {
        firstName,
        lastName,
        profile: profileData.profileData
      });
      
      // Create user display name, ensuring we handle all cases properly
      if (firstName && lastName) {
        setUserDisplayName(`${firstName} ${lastName}`);
      } else if (firstName) {
        setUserDisplayName(firstName);
      } else if (lastName) {
        setUserDisplayName(lastName);
      } else {
        setUserDisplayName(null);
      }
      
      // Set job title and organization information
      setUserJobTitle(profileData.jobTitle);
      
      if (profileData.profileData?.organization_id) {
        setOrganizationId(profileData.profileData.organization_id);
        setOrganizationName(profileData.orgName);
      } else {
        // Reset organization data if user is not associated with an organization
        setOrganizationId(null);
        setOrganizationName(null);
      }
    } else if (!isProfileLoading && !profileError) {
      // Handle case where query completed but no data was returned
      console.log('useProfileState: No profile data found');
      setUserDisplayName(null);
      setUserJobTitle(null);
    }
  }, [isSessionLoading, isProfileLoading, session, profileData, profileError]);
  
  return {
    organizationName,
    organizationId,
    userDisplayName,
    userJobTitle,
    profile,
    loading,
    error,
    session
  };
};
