
import { useUserRole } from "@/components/admin/hooks/useUserRole";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { UserRoleType } from "@/types/supabase-types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function AdminStatusIndicator() {
  const { isAdmin, userRole, isLoading, error } = useUserRole();
  
  // Get the user's job title
  const { data: profile } = useQuery({
    queryKey: ['adminIndicatorProfile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('job_title')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile job title:', error);
        return null;
      }
      
      return data;
    },
  });
  
  // Consider a user to have admin access if they are either global_admin or org_admin
  const hasAdminAccess = isAdmin || userRole === 'global_admin' || userRole === 'org_admin';
  
  // Check if the user has a moderator role
  const isModerator = 
    userRole === 'hr_moderator' as UserRoleType || 
    userRole === 'comm_moderator' as UserRoleType || 
    userRole === 'stakeholder_moderator' as UserRoleType ||
    userRole === 'survey_moderator' as UserRoleType;
  
  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Checking status...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <Badge variant="outline" className="text-red-500 border-red-500">
        Error checking status
      </Badge>
    );
  }
  
  // If we have a job title, display it instead of role
  if (profile?.job_title) {
    return (
      <Badge variant={hasAdminAccess ? "default" : "outline"} className={hasAdminAccess ? "bg-green-600 hover:bg-green-700" : ""}>
        {profile.job_title}
      </Badge>
    );
  }
  
  // Fallback to displaying role-based badges if no job title is set
  if (hasAdminAccess) {
    return (
      <Badge variant="default" className="bg-green-600 hover:bg-green-700">
        {userRole === 'global_admin' ? 'Global Admin' : userRole === 'org_admin' ? 'Organization Admin' : 'Admin'}
      </Badge>
    );
  }
  
  if (isModerator) {
    return (
      <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">
        {userRole === 'hr_moderator' as UserRoleType ? 'HR Moderator' : 
         userRole === 'comm_moderator' as UserRoleType ? 'Comm Moderator' : 
         userRole === 'survey_moderator' as UserRoleType ? 'Survey Moderator' :
         'Stakeholder Moderator'}
      </Badge>
    );
  }
  
  // Default case - just a regular user
  return (
    <Badge variant="outline">
      User
    </Badge>
  );
}
