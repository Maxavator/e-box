
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/components/user/UserProfile";
import { supabase } from "@/integrations/supabase/client";
import { Settings, Users, Building2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface AppHeaderProps {
  onLogout: () => void;
  onLogoClick: () => void;
}

export function AppHeader({ onLogout, onLogoClick }: AppHeaderProps) {
  const [displayName, setDisplayName] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single();

        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          setDisplayName(`${profileData.first_name} ${profileData.last_name}`);
        }

        setIsAdmin(roleData?.role === 'org_admin' || roleData?.role === 'global_admin');
      }
    };

    fetchUserInfo();
  }, []);

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
        {displayName && (
          <span className="text-sm font-medium text-muted-foreground">
            Welcome, {displayName}
          </span>
        )}
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
              <DropdownMenuItem onClick={() => handleAdminNav('/organization/manage')}>
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
