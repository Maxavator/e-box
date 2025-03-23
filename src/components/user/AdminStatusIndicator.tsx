
import { useUserRole } from "@/components/admin/hooks/useUserRole";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export function AdminStatusIndicator() {
  const { isAdmin, userRole, isLoading, error } = useUserRole();
  
  // Consider a user to have admin access if they are either global_admin or org_admin
  const hasAdminAccess = isAdmin || userRole === 'global_admin' || userRole === 'org_admin';
  
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
        Admin {userRole === 'global_admin' ? '(Global)' : userRole === 'org_admin' ? '(Chief Information Officer)' : ''}
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline">
      Org_Admin
    </Badge>
  );
}
