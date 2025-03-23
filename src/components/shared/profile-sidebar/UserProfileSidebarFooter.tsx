
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/components/admin/hooks/useUserRole";
import { useState, useEffect } from "react";
import { UserProfileHeader } from "./UserProfileHeader";
import { ProfileControls } from "./ProfileControls";
import { OrganizationInfo } from "./OrganizationInfo";
import { AdminButton } from "./AdminButton";
import { VersionInfo } from "./VersionInfo";

export function UserProfileSidebarFooter() {
  const { isAdmin } = useUserRole();
  const [userName, setUserName] = useState<{ firstName: string; lastName: string } | null>(null);

  // Get current session
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    },
  });

  // Get user profile
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      console.log('Fetching profile for user ID:', session?.user?.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url, job_title, email, organization_id')
        .eq('id', session!.user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      console.log('Profile data retrieved:', data);
      return data;
    },
  });

  // Use the same approach as Dashboard to fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (session?.user) {
          const { data } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', session.user.id)
            .maybeSingle();

          if (data) {
            setUserName({
              firstName: data.first_name || '',
              lastName: data.last_name || ''
            });
            console.log('User name set from fetchUserData:', data.first_name, data.last_name);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (session?.user?.id && (!profile || !profile.first_name)) {
      console.log('Fetching user data in useEffect');
      fetchUserData();
    } else if (profile) {
      setUserName({
        firstName: profile.first_name || '',
        lastName: profile.last_name || ''
      });
      console.log('User name set from profile:', profile.first_name, profile.last_name);
    }
  }, [session, profile]);

  if (!session?.user) {
    return (
      <div className="p-3 text-center text-sm text-muted-foreground">
        Not logged in
      </div>
    );
  }

  if (isProfileLoading && !userName) {
    return (
      <div className="p-3 text-center text-sm text-muted-foreground">
        Loading profile...
      </div>
    );
  }

  // Use either the profile data or the fallback from useEffect
  const firstName = profile?.first_name || userName?.firstName || '';
  const lastName = profile?.last_name || userName?.lastName || '';
  const initials = `${firstName[0] || ''}${lastName[0] || ''}`;
  const jobTitle = profile?.job_title || '';
  const hasOrganization = !!profile?.organization_id;

  console.log('Rendering user profile:', { firstName, lastName, jobTitle, hasOrganization });

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
      
      <ProfileControls />
      
      <OrganizationInfo organizationId={profile?.organization_id} />
      
      <div className="flex items-center gap-2 mt-1">
        <AdminButton isAdmin={isAdmin} />
      </div>
      
      <VersionInfo />
    </div>
  );
}
