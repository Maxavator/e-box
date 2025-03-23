import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, Mail, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { UserInfo } from "@/components/user/UserInfo";
import { OnlineStatus } from "@/components/user/OnlineStatus";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function UserProfileSidebarFooter() {
  const navigate = useNavigate();

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
        .select('first_name, last_name, avatar_url, job_title, email')
        .eq('id', session!.user.id)
        .single();
      return data;
    },
  });

  const { data: userRole } = useQuery({
    queryKey: ['userRole', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session!.user.id)
        .single();
      return roleData?.role;
    },
  });

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  if (!profile) return null;

  const initials = `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`;
  const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`;
  const jobTitle = profile.job_title || 'Employee';
  const isAdmin = userRole === 'org_admin' || userRole === 'global_admin';
  const eBoxVersion = 'v1.0.4';

  return (
    <div className="flex flex-col p-3 border-t border-muted/20 bg-sidebar w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile.avatar_url || ''} alt={fullName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{fullName}</span>
            <span className="text-xs text-muted-foreground">{jobTitle}</span>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleLogout}
          className="h-8 w-8"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center gap-2 mt-1">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleProfileClick}
          className="flex items-center gap-1 text-xs flex-1 h-8"
        >
          <Settings className="h-3 w-3" />
          <span>Settings</span>
        </Button>
        
        {isAdmin && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/admin")}
            className="flex items-center gap-1 text-xs flex-1 h-8"
          >
            <Mail className="h-3 w-3" />
            <span>Admin</span>
          </Button>
        )}
      </div>
      
      <div className="mt-2 border-t border-muted/20 pt-2">
        <OnlineStatus />
      </div>
      
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-muted/20 text-xs text-muted-foreground">
        <span>e-Box {eBoxVersion}</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Info className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>© 2024 Afrovation</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
