
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface UserProfileProps {
  onLogout: () => void;
}

export const UserProfile = ({ onLogout }: UserProfileProps) => {
  const [userInfo, setUserInfo] = useState<{
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  } | null>(null);
  const navigate = useNavigate();

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
            firstName: profileData.first_name || '',
            lastName: profileData.last_name || '',
            avatarUrl: profileData.avatar_url,
          });
        } else {
          // Set default values if no profile data
          setUserInfo({
            firstName: 'User',
            lastName: '',
            avatarUrl: null,
          });
        }
      }
    };

    fetchUserInfo();
  }, []);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      onLogout();
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  if (!userInfo) return null;

  const initials = `${userInfo.firstName?.[0] || ''}${userInfo.lastName?.[0] || ''}`;
  const fullName = `${userInfo.firstName} ${userInfo.lastName}`.trim() || 'User';

  return (
    <div className="flex items-center gap-4">
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={handleLogout}
        className="flex items-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar>
              <AvatarImage src={userInfo.avatarUrl || ''} alt={initials} />
              <AvatarFallback>{initials || 'U'}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{fullName}</p>
              <p className="text-xs leading-none text-muted-foreground">User Profile</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleLogout}
            className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-100"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
