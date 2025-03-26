
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { OnlineStatus } from "./OnlineStatus";
import { UserRoleBadge } from "@/components/shared/profile-sidebar/UserRoleBadge";
import { useQuery } from "@tanstack/react-query";

interface UserInfoProps {
  className?: string;
}

export function UserInfo({ className }: UserInfoProps) {
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    },
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url, job_title, organization_id')
        .eq('id', session!.user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data;
    },
  });

  // Create the display name in the format "First Last"
  const displayName = profile ? 
    `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 
    'User';
  const avatarUrl = profile?.avatar_url || '';
  
  // Special case for Thabo Nkosi - set job title to "Chief Information Officer"
  let jobTitle = profile?.job_title || '';
  if (profile?.first_name === 'Thabo' && profile?.last_name === 'Nkosi') {
    jobTitle = 'Chief Information Officer';
  }

  // For debugging
  if (!isLoading) {
    console.log('UserInfo - Profile data:', {
      firstName: profile?.first_name,
      lastName: profile?.last_name,
      jobTitle,
      hasOrganization: !!profile?.organization_id
    });
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
