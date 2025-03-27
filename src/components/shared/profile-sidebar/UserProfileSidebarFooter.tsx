
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/components/admin/hooks/useUserRole";
import { UserProfileHeader } from "./UserProfileHeader";
import { OrganizationInfo } from "./OrganizationInfo";
import { AdminButton } from "./AdminButton";
import { VersionInfo } from "./VersionInfo";

export function UserProfileSidebarFooter() {
  const { isAdmin } = useUserRole();

  // Get current session
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
        throw error;
      }
      return session;
    },
  });

  // Get user profile
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['sidebarProfile', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      console.log('Fetching profile data for user ID:', session?.user?.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url, job_title, organization_id')
        .eq('id', session!.user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      console.log('Profile data fetched successfully:', data);
      return data;
    },
  });

  if (!session?.user) {
    console.log('No session user found');
    return (
      <div className="p-3 text-center text-sm text-muted-foreground">
        Not logged in
      </div>
    );
  }

  if (isProfileLoading && !profile) {
    console.log('Profile is loading...');
    return (
      <div className="p-3 text-center text-sm text-muted-foreground">
        Loading profile...
      </div>
    );
  }

  // Use the profile data
  const firstName = profile?.first_name || '';
  const lastName = profile?.last_name || '';
  const initials = `${firstName[0] || ''}${lastName[0] || ''}`;
  const jobTitle = profile?.job_title || '';
  const hasOrganization = !!profile?.organization_id;

  // Debug information
  console.log('UserProfileSidebarFooter - Profile data:', {
    firstName,
    lastName,
    jobTitle,
    hasOrganization,
    organizationId: profile?.organization_id,
    sessionUser: session?.user?.id,
    rawProfile: profile
  });

  return (
    <div className="flex flex-col p-3 w-full">
      <UserProfileHeader 
        firstName={firstName}
        lastName={lastName}
        initials={initials}
        avatarUrl={profile?.avatar_url} 
        jobTitle={jobTitle}
        hasOrganization={hasOrganization}
      />
      
      {profile?.organization_id && (
        <OrganizationInfo organizationId={profile?.organization_id} />
      )}
      
      <div className="flex items-center gap-2 mt-1">
        <AdminButton />
      </div>
      
      <VersionInfo />
    </div>
  );
}
