
import { useUserProfile } from "@/hooks/useUserProfile";
import { UserInfo } from "@/components/user/UserInfo";
import { AdminButton } from "./AdminButton";
import { VersionInfo } from "./VersionInfo";
import { OrganizationInfo } from "./OrganizationInfo";
import { UserProfileHeader } from "./UserProfileHeader";

export function UserProfileSidebarFooter() {
  const { loading, organizationName, organizationId, userDisplayName, profile } = useUserProfile();
  
  // Show simple loading state
  if (loading) {
    return (
      <div className="flex flex-col p-3 w-full">
        <div className="flex items-center gap-3 mb-3 animate-pulse">
          <div className="h-10 w-10 rounded-full bg-muted"></div>
          <div className="flex flex-col gap-1.5">
            <div className="h-4 w-20 bg-muted rounded"></div>
            <div className="h-3 w-16 bg-muted rounded"></div>
          </div>
        </div>
        <div className="h-4 w-28 bg-muted rounded mt-2 opacity-50"></div>
      </div>
    );
  }
  
  // Calculate initials from the first and last name for the avatar
  const firstName = profile?.first_name || '';
  const lastName = profile?.last_name || '';
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  
  return (
    <div className="flex flex-col p-3 w-full border-t border-border/30">
      {/* Organization info at the top of the footer */}
      {organizationName && (
        <div className="mb-2 pb-2 border-b border-border/20">
          <OrganizationInfo 
            organizationName={organizationName} 
            organizationId={organizationId}
          />
        </div>
      )}
      
      {/* User Profile Header - Shows full name */}
      <UserProfileHeader
        firstName={firstName}
        lastName={lastName}
        initials={initials}
        avatarUrl={profile?.avatar_url}
        jobTitle={profile?.job_title}
        hasOrganization={!!organizationId}
        province={profile?.province}
      />
      
      <div className="flex items-center gap-2 mt-1">
        <AdminButton />
      </div>
      
      <VersionInfo />
    </div>
  );
}
