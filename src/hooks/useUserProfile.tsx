
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useProfileState } from './profile/useProfileState';
import { useProfileQueries } from './profile/useProfileQueries';
import { UserProfileData } from '@/types/profile';

export function useUserProfile(): UserProfileData {
  const {
    organizationName,
    organizationId,
    userDisplayName,
    userJobTitle,
    profile,
    loading,
    error
  } = useProfileState();
  
  const { invalidateQueries } = useProfileQueries();
  const queryClient = useQueryClient();

  // Function to manually refresh profile data
  const refreshProfile = async () => {
    try {
      // Invalidate all profile-related queries to force refetch
      invalidateQueries();
      toast.success("Profile information refreshed successfully");
    } catch (err) {
      console.error('Error refreshing user profile:', err);
      toast.error("Failed to refresh profile information", {
        description: "Please try again or contact support."
      });
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
    profile
  };
}
