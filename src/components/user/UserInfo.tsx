
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { OnlineStatus } from "./OnlineStatus";
import { UserRoleBadge } from "@/components/shared/profile-sidebar/UserRoleBadge";
import { useQuery } from "@tanstack/react-query";
import { useUserProfile } from "@/hooks/useUserProfile";

interface UserInfoProps {
  className?: string;
}

export function UserInfo({ className }: UserInfoProps) {
  const { 
    userDisplayName, 
    firstName, 
    lastName, 
    avatarUrl, 
    jobTitle, 
    loading 
  } = useUserProfile();
  
  // Create initials from first and last name
  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`;
  
  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
        <div className="flex flex-col gap-1">
          <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
          <div className="h-3 w-16 bg-muted rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatarUrl || ''} alt={userDisplayName || 'User'} />
        <AvatarFallback>{initials || 'U'}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium">
          {userDisplayName || 'User'}
        </span>
        <div className="flex items-center">
          <span className="text-xs text-muted-foreground mr-2">{jobTitle}</span>
          <OnlineStatus>
            <span className="mx-1">•</span>
            <UserRoleBadge />
          </OnlineStatus>
        </div>
      </div>
    </div>
  );
}
