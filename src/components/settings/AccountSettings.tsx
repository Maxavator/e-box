
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileSettings } from "@/components/user/ProfileSettings";
import { useUserProfile } from "@/hooks/useUserProfile";

export function AccountSettings() {
  const { userDisplayName, userJobTitle, organizationName } = useUserProfile();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Account Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
        {userDisplayName && (
          <p className="text-sm text-muted-foreground">
            Logged in as: <span className="font-medium">{userDisplayName}</span>
            {userJobTitle && <span className="ml-1">• {userJobTitle}</span>}
            {organizationName && <span className="ml-1">• {organizationName}</span>}
          </p>
        )}
      </div>
      
      <ProfileSettings />
    </div>
  );
}
