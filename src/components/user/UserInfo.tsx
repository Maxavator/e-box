
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

  const { data: profile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url, job_title, organization_id')
        .eq('id', session!.user.id)
        .single();
      return data;
    },
  });

  // Create the display name in the format "last_name, first_name"
  const displayName = profile ? 
    `${profile.last_name || ''}, ${profile.first_name || ''}`.trim() : 
    'User';
  const avatarUrl = profile?.avatar_url || '';
  const jobTitle = profile?.job_title || '';

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
          <span className="text-xs text-muted-foreground">{jobTitle}</span>
          <OnlineStatus>
            <span className="mx-1">•</span>
            <UserRoleBadge />
          </OnlineStatus>
        </div>
      </div>
    </div>
  );
}
