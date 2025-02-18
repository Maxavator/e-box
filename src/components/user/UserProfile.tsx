
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, CircleDot } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserProfileProps {
  onLogout: () => void;
}

export const UserProfile = ({ onLogout }: UserProfileProps) => {
  const [userInfo, setUserInfo] = useState<{
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  } | null>(null);
  const [isOnline, setIsOnline] = useState(true);

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
          setUserInfo({
            firstName: profileData.first_name,
            lastName: profileData.last_name,
            avatarUrl: profileData.avatar_url,
          });
        }
      }
    };

    fetchUserInfo();
  }, []);

  if (!userInfo) return null;

  const initials = `${userInfo.firstName?.[0] || ''}${userInfo.lastName?.[0] || ''}`;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <CircleDot className="w-3 h-3 text-green-500" />
        <span className="text-sm text-muted-foreground">Online</span>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar>
              <AvatarImage src={userInfo.avatarUrl || ''} alt={initials} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="flex justify-between">
            <span>
              {userInfo.firstName} {userInfo.lastName}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
