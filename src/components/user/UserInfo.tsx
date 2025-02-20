
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { OnlineStatus } from "./OnlineStatus";

interface UserInfoProps {
  className?: string;
}

export function UserInfo({ className }: UserInfoProps) {
  const [displayName, setDisplayName] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url')
          .eq('id', user.id)
          .single();

        if (profileData) {
          setDisplayName(`${profileData.first_name} ${profileData.last_name}`);
          setAvatarUrl(profileData.avatar_url || '');
        }
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>
          {displayName?.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium">
          {displayName}
        </span>
        <OnlineStatus />
      </div>
    </div>
  );
}
