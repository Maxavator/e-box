import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Mail, Info, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { OnlineStatus } from "@/components/user/OnlineStatus";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useUserRole } from "@/components/admin/hooks/useUserRole";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { APP_VERSION } from "@/utils/version";
import { getLatestChanges } from "@/utils/changelog";
import { Badge } from "@/components/ui/badge";

export function UserProfileSidebarFooter() {
  const navigate = useNavigate();
  const { userRole, isAdmin } = useUserRole();

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
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url, job_title, email, organization_id')
        .eq('id', session!.user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data;
    },
  });

  const { data: organization } = useQuery({
    queryKey: ['organization', profile?.organization_id],
    enabled: !!profile?.organization_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select('name')
        .eq('id', profile!.organization_id)
        .single();
      
      if (error) {
        console.error('Error fetching organization:', error);
        return null;
      }
      
      return data;
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

  if (!session?.user) {
    return (
      <div className="p-3 text-center text-sm text-muted-foreground">
        Not logged in
      </div>
    );
  }

  const initials = profile ? `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}` : 'U';
  const fullName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'User';
  const jobTitle = profile?.job_title || 'Employee';
  const orgName = organization?.name;

  const roleDisplayText = 
    userRole === 'global_admin' ? 'Global Admin' : 
    userRole === 'org_admin' ? 'Organization Admin' : 
    userRole === 'staff' ? 'Staff' : 'Regular User';

  const latestChanges = getLatestChanges();

  return (
    <div className="flex flex-col p-3 w-full">
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={profile?.avatar_url || ''} alt={fullName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{fullName}</span>
          <span className="text-xs text-muted-foreground">{jobTitle}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-3 border border-border/30 rounded-md p-2">
        <Badge 
          variant={userRole === 'global_admin' || userRole === 'org_admin' ? "default" : "outline"}
          className={`text-xs ${userRole === 'global_admin' || userRole === 'org_admin' ? 'bg-green-600 hover:bg-green-700' : ''}`}
        >
          {roleDisplayText}
        </Badge>
        
        <span className="text-muted-foreground">|</span>
        
        <OnlineStatus />
        
        <span className="text-muted-foreground">|</span>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout}
          className="h-7 px-2"
          title="Logout"
        >
          <LogOut className="h-3.5 w-3.5" />
        </Button>
      </div>
      
      {orgName && (
        <div className="flex items-center gap-1.5 px-1 py-1.5 mb-2">
          <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground truncate">{orgName}</span>
        </div>
      )}
      
      <div className="flex items-center gap-2 mt-1">
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
      
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-muted/20 text-xs text-muted-foreground">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-xs hover:underline">
                e-Box {APP_VERSION}
              </button>
            </TooltipTrigger>
            <TooltipContent className="w-72 p-3">
              <div className="space-y-2">
                <h4 className="font-medium">Latest Changes ({latestChanges?.version})</h4>
                <p className="text-xs text-muted-foreground">{latestChanges?.date}</p>
                <ul className="text-xs space-y-1 list-disc pl-4">
                  {latestChanges?.changes.map((change, i) => (
                    <li key={i}>{change}</li>
                  ))}
                </ul>
                <p className="text-xs pt-2">
                  <a 
                    className="text-primary hover:underline cursor-pointer"
                    onClick={() => navigate("/changelog")}
                  >
                    View full changelog
                  </a>
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="flex items-center gap-1">
          <ThemeToggle />
          
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
    </div>
  );
}
