
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { OnlineStatus } from "./OnlineStatus";
import { UserRoleBadge } from "@/components/shared/profile-sidebar/UserRoleBadge";
import { toast } from "sonner";
import { useUserProfile } from "@/hooks/useUserProfile";

interface UserInfoProps {
  className?: string;
}

export function UserInfo({ className }: UserInfoProps) {
  const { profile, userDisplayName, userJobTitle, organizationName, loading: profileLoading } = useUserProfile();
  
  // Debug logging
  console.log('UserInfo - Profile:', profile);
  console.log('UserInfo - DisplayName:', userDisplayName);
  console.log('UserInfo - JobTitle:', userJobTitle);
  console.log('UserInfo - OrgName:', organizationName);

  // Create the display name in the format "First Last"
  const displayName = userDisplayName || 'User';
  const avatarUrl = profile?.avatar_url || '';
  const jobTitle = userJobTitle || '';
  const orgName = organizationName || '';
  
  if (profileLoading) {
    return (
      <div className={`flex items-center gap-2 animate-pulse ${className}`}>
        <div className="h-8 w-8 rounded-full bg-muted"></div>
        <div className="flex flex-col gap-1">
          <div className="h-4 w-24 bg-muted rounded"></div>
          <div className="h-3 w-16 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>
          {displayName?.split(' ').map(n => n[0]).join('') || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium">
          {displayName}
        </span>
        <div className="flex items-center flex-wrap">
          <span className="text-xs text-muted-foreground mr-2">{jobTitle}</span>
          {orgName && <span className="text-xs text-muted-foreground mr-2">• {orgName}</span>}
          <OnlineStatus>
            <span className="mx-1">•</span>
            <UserRoleBadge />
          </OnlineStatus>
        </div>
      </div>
    </div>
  );
}
