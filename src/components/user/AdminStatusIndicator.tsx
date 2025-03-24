
import { useUserRole } from "@/components/admin/hooks/useUserRole";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { UserRoleType } from "@/types/supabase-types";

export function AdminStatusIndicator() {
  const { isAdmin, userRole, isLoading, error } = useUserRole();
  
  // Consider a user to have admin access if they are either global_admin or org_admin
  const hasAdminAccess = isAdmin || userRole === 'global_admin' || userRole === 'org_admin';
  
  // Check if the user has a moderator role using string literals instead of using the UserRoleType
  // to avoid TypeScript errors with role types that may not be in the UserRoleType
  const isModerator = 
    userRole === 'hr_moderator' || 
    userRole === 'comm_moderator' || 
    userRole === 'stakeholder_moderator';
  
  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Checking admin status...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <Badge variant="outline" className="text-red-500 border-red-500">
        Error checking admin status
      </Badge>
    );
  }
  
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
        {userRole === 'hr_moderator' ? 'HR Moderator' : 
         userRole === 'comm_moderator' ? 'Comm Moderator' : 
         'Stakeholder Moderator'}
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline">
      User
    </Badge>
  );
}
