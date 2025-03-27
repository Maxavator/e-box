
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

  // Get current session
  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ['user-sidebar-session'],
    queryFn: async () => {
      console.log('Fetching session for sidebar footer');
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session for sidebar footer:', error);
        throw error;
      }
      console.log('Sidebar footer session fetched:', session);
      return session;
    },
  });

  // Get user profile
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['user-sidebar-profile', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      console.log('Fetching profile for sidebar footer:', session?.user?.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url, job_title, organization_id')
        .eq('id', session!.user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile for sidebar footer:', error);
        toast.error("Failed to load user profile");
        throw error;
      }
      
      console.log('Sidebar footer profile data fetched:', data);
      return data;
    },
  });

  // Get organization details if organization_id exists
  const { data: organization } = useQuery({
    queryKey: ['user-sidebar-organization', profile?.organization_id],
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
      
      console.log('Sidebar footer organization data fetched:', data);
      return data;
    },
  });

  const isLoading = isSessionLoading || isProfileLoading;

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

  if (!session?.user) {
    return (
      <div className="p-3 text-center text-sm text-muted-foreground">
        Not logged in
      </div>
    );
  }

  // Use the profile data
  const firstName = profile?.first_name || '';
  const lastName = profile?.last_name || '';
  const initials = `${firstName[0] || ''}${lastName[0] || ''}`;
  const jobTitle = profile?.job_title || '';
  const orgName = organization?.name || '';

  console.log('Sidebar footer rendering with name:', firstName, lastName);

  return (
    <div className="flex flex-col p-3 w-full">
      <UserProfileHeader 
        firstName={firstName}
        lastName={lastName}
        initials={initials}
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
