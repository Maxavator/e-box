
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/components/user/UserProfile";
import { supabase } from "@/integrations/supabase/client";
import { Settings, Users, Building2, Circle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AppHeaderProps {
  onLogout: () => void;
  onLogoClick: () => void;
}

type OnlineStatus = 'online' | 'away' | 'offline' | 'busy';

export function AppHeader({ onLogout, onLogoClick }: AppHeaderProps) {
  const [displayName, setDisplayName] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [onlineStatus, setOnlineStatus] = useState<OnlineStatus>('online');
  const [lastActivity, setLastActivity] = useState<Date>(new Date());
  const navigate = useNavigate();

  // Track user activity
  useEffect(() => {
    const updateLastActivity = () => {
      setLastActivity(new Date());
      if (onlineStatus === 'away') {
        setOnlineStatus('online');
        toast.success("Welcome back! You're now online");
      }
    };

    // Events to track user activity
    const events = ['mousedown', 'keydown', 'mousemove', 'wheel', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, updateLastActivity);
    });

    // Check activity status every 30 minutes
    const intervalId = setInterval(() => {
      const now = new Date();
      const timeDiff = now.getTime() - lastActivity.getTime();
      const minutesDiff = Math.floor(timeDiff / 1000 / 60);

      if (minutesDiff >= 30 && onlineStatus === 'online') {
        setOnlineStatus('away');
        toast.info("You're now away due to inactivity");
      }
    }, 1800000); // 30 minutes in milliseconds

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateLastActivity);
      });
      clearInterval(intervalId);
    };
  }, [lastActivity, onlineStatus]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url')
          .eq('id', user.id)
          .single();

        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          setDisplayName(`${profileData.first_name} ${profileData.last_name}`);
          setAvatarUrl(profileData.avatar_url || '');
        }

        setIsAdmin(roleData?.role === 'org_admin' || roleData?.role === 'global_admin');
      }
    };

    fetchUserInfo();
  }, []);

  const getStatusColor = (status: OnlineStatus) => {
    switch (status) {
      case 'online':
        return 'text-green-500';
      case 'away':
        return 'text-yellow-500';
      case 'busy':
        return 'text-red-500';
      case 'offline':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  const handleStatusChange = async (newStatus: OnlineStatus) => {
    setOnlineStatus(newStatus);
    if (newStatus === 'online') {
      setLastActivity(new Date());
    }
    toast.success(`Status updated to ${newStatus}`);
  };

  const handleAdminNav = (path: string) => {
    navigate(path);
  };

  return (
    <header className="border-b bg-white p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={onLogoClick}
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <img 
            src="/lovable-uploads/81af9ad8-b07d-41cb-b800-92cebc70e699.png" 
            alt="Afrovation" 
            className="h-8"
          />
        </button>
        <div className="flex items-center gap-2">
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
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                <Circle className={`h-2 w-2 ${getStatusColor(onlineStatus)}`} />
                <span className="capitalize">{onlineStatus}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px]">
                <DropdownMenuItem onClick={() => handleStatusChange('online')}>
                  <Circle className="h-2 w-2 text-green-500 mr-2" />
                  Online
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('away')}>
                  <Circle className="h-2 w-2 text-yellow-500 mr-2" />
                  Away
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('busy')}>
                  <Circle className="h-2 w-2 text-red-500 mr-2" />
                  Busy
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('offline')}>
                  <Circle className="h-2 w-2 text-gray-500 mr-2" />
                  Appear Offline
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {isAdmin && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Admin Tools
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleAdminNav('/admin')}>
                <Settings className="h-4 w-4 mr-2" />
                Admin Portal
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAdminNav('/organization')}>
                <Building2 className="h-4 w-4 mr-2" />
                Organization Management
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAdminNav('/admin/users')}>
                <Users className="h-4 w-4 mr-2" />
                User Management
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <UserProfile onLogout={onLogout} />
      </div>
    </header>
  );
}
