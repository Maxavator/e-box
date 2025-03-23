
import { Badge } from "@/components/ui/badge";
import { useUserRole } from "@/components/admin/hooks/useUserRole";

export function UserRoleBadge() {
  const { userRole } = useUserRole();
  
  const roleDisplayText = 
    userRole === 'global_admin' ? 'Global Admin' : 
    userRole === 'org_admin' ? 'Organization Admin' : 
    userRole === 'staff' ? 'Staff' : 'User';

  return (
    <Badge 
      variant={userRole === 'global_admin' || userRole === 'org_admin' ? "default" : "outline"}
      className={`text-xs ${userRole === 'global_admin' || userRole === 'org_admin' ? 'bg-green-600 hover:bg-green-700' : ''}`}
    >
      {roleDisplayText}
    </Badge>
  );
}
