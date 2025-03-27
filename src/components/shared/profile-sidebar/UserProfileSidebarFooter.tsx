
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/components/admin/hooks/useUserRole";
import { UserProfileHeader } from "./UserProfileHeader";
import { OrganizationInfo } from "./OrganizationInfo";
import { AdminButton } from "./AdminButton";
import { VersionInfo } from "./VersionInfo";
import { toast } from "sonner";

export function UserProfileSidebarFooter() {
  const { isAdmin } = useUserRole();

  // Get current user
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['sidebar-current-user'],
    queryFn: async () => {
      console.log('Fetching current user for sidebar footer');
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching current user for sidebar footer:', error);
        throw error;
      }
      console.log('Current user fetched:', user);
      return user;
    },
  });

  // Get user profile data
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['sidebar-profile', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      console.log('Fetching profile data for sidebar footer:', user?.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url, job_title, organization_id')
        .eq('id', user!.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile for sidebar footer:', error);
        toast.error("Failed to load profile information");
        throw error;
      }
      
      console.log('Profile data fetched:', data);
      return data;
    },
  });

  // Get organization details if organization_id exists
  const { data: organization, isLoading: isOrgLoading } = useQuery({
    queryKey: ['sidebar-organization', profile?.organization_id],
    enabled: !!profile?.organization_id,
    queryFn: async () => {
      console.log('Fetching organization for sidebar footer:', profile?.organization_id);
      const { data, error } = await supabase
        .from('organizations')
        .select('name, domain, logo_url')
        .eq('id', profile!.organization_id)
        .single();
      
      if (error) {
        console.error('Error fetching organization for sidebar footer:', error);
        return null;
      }
      
      console.log('Organization data fetched:', data);
      return data;
    },
  });

  const isLoading = isUserLoading || isProfileLoading;

  if (isLoading) {
    return (
      <div className="p-3 space-y-4">
        <div className="flex items-center gap-3 animate-pulse">
          <div className="h-10 w-10 rounded-full bg-muted"></div>
          <div className="flex flex-col gap-1">
            <div className="h-4 w-24 bg-muted rounded"></div>
            <div className="h-3 w-16 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-3 text-center text-sm text-muted-foreground">
        Not logged in
      </div>
    );
  }

  // Use the profile data (with fallbacks)
  const firstName = profile?.first_name || '';
  const lastName = profile?.last_name || '';
  const initials = (firstName?.[0] || '') + (lastName?.[0] || '');
  const jobTitle = profile?.job_title || '';
  const orgName = organization?.name || '';

  console.log('Rendering sidebar footer with:', {
    firstName,
    lastName,
    initials,
    jobTitle,
    organizationId: profile?.organization_id
  });

  return (
    <div className="flex flex-col p-3 w-full">
      <UserProfileHeader 
        firstName={firstName}
        lastName={lastName}
        initials={initials || '?'}
        avatarUrl={profile?.avatar_url} 
        jobTitle={jobTitle}
        hasOrganization={!!profile?.organization_id}
      />
      
      {profile?.organization_id && (
        <OrganizationInfo 
          organizationId={profile.organization_id}
          organizationName={orgName}
          logo={organization?.logo_url}
        />
      )}
      
      <div className="flex items-center gap-2 mt-1">
        <AdminButton />
      </div>
      
      <VersionInfo />
    </div>
  );
}
