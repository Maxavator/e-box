
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
  const { data: session, isLoading: isSessionLoading, error: sessionError } = useQuery({
    queryKey: ['sidebar-session'],
    queryFn: async () => {
      console.log('Fetching sidebar session');
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session for sidebar:', error);
        throw error;
      }
      console.log('Sidebar session data:', session);
      return session;
    },
  });

  // Get user profile
  const { data: profile, isLoading: isProfileLoading, error: profileError } = useQuery({
    queryKey: ['sidebar-profile', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      console.log('Fetching sidebar profile for user:', session?.user?.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url, job_title, organization_id')
        .eq('id', session!.user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile for sidebar:', error);
        toast.error("Failed to load user profile in sidebar");
        return null;
      }
      
      console.log('Sidebar profile data:', data);
      return data;
    },
  });

  // Get organization details if organization_id exists
  const { data: organization, isLoading: isOrgLoading, error: orgError } = useQuery({
    queryKey: ['sidebar-organization', profile?.organization_id],
    enabled: !!profile?.organization_id,
    queryFn: async () => {
      console.log('Fetching sidebar organization for ID:', profile?.organization_id);
      const { data, error } = await supabase
        .from('organizations')
        .select('name, domain, logo_url')
        .eq('id', profile!.organization_id)
        .single();
      
      if (error) {
        console.error('Error fetching organization for sidebar:', error);
        return null;
      }
      
      console.log('Sidebar organization data:', data);
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

  if (sessionError || !session?.user) {
    return (
      <div className="p-3 text-center text-sm text-muted-foreground">
        Not logged in
      </div>
    );
  }

  if (profileError && !profile) {
    return (
      <div className="p-3 text-center text-sm text-muted-foreground">
        Error loading profile
      </div>
    );
  }

  // Use the profile data
  const firstName = profile?.first_name || '';
  const lastName = profile?.last_name || '';
  const initials = `${firstName[0] || ''}${lastName[0] || ''}`;
  const jobTitle = profile?.job_title || '';
  const hasOrganization = !!profile?.organization_id;
  const orgName = organization?.name || '';

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
        <OrganizationInfo 
          organizationId={profile?.organization_id}
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
