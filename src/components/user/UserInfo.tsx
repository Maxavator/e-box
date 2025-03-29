
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { OnlineStatus } from "./OnlineStatus";
import { UserRoleBadge } from "@/components/shared/profile-sidebar/UserRoleBadge";
import { toast } from "sonner";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Building2 } from "lucide-react";

interface UserInfoProps {
  className?: string;
  compact?: boolean;
}

export function UserInfo({ className, compact = false }: UserInfoProps) {
  const { profile, userDisplayName, userJobTitle, organizationName, loading: profileLoading } = useUserProfile();
  
  // Debug logging
  console.log('UserInfo - Profile:', profile);
  console.log('UserInfo - DisplayName:', userDisplayName);
  console.log('UserInfo - JobTitle:', userJobTitle);
  console.log('UserInfo - OrgName:', organizationName);
  console.log('UserInfo - ProfileData:', profile?.first_name, profile?.last_name);

  // Create the display name in the format "First Last"
  const displayName = userDisplayName || 'User';
  const avatarUrl = profile?.avatar_url || '';
  const jobTitle = userJobTitle || '';
  const orgName = organizationName || '';
  const province = profile?.province || '';
  
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
      <Avatar className={compact ? "h-6 w-6" : "h-8 w-8"}>
        <AvatarImage src={avatarUrl} alt={displayName} />
        <AvatarFallback>
          {displayName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className={`${compact ? "text-xs" : "text-sm"} font-medium line-clamp-1`}>
          {displayName}
        </span>
        <div className="flex items-center flex-wrap">
          <span className={`${compact ? "text-[10px]" : "text-xs"} text-muted-foreground line-clamp-1 mr-2`}>
            {jobTitle}
          </span>
          
          {!compact && orgName && (
            <span className="text-xs text-muted-foreground flex items-center">
              <span className="mx-1">•</span>
              <Building2 className="h-3 w-3 mr-1" />{orgName}
            </span>
          )}
          
          {!compact && (
            <OnlineStatus>
              <span className="mx-1">•</span>
              <UserRoleBadge />
            </OnlineStatus>
          )}
          
          {compact && province && (
            <span className="text-[10px] text-muted-foreground">
              <span className="mx-1">•</span>
              {province}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
