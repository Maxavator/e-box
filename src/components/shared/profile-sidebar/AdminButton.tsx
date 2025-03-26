
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserRole } from "@/components/admin/hooks/useUserRole";

export function AdminButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, userRole } = useUserRole();
  
  // Check if we're already on the admin page
  const isAdminPage = location.pathname.includes('/admin');
  
  // Consider a user to have admin access if they are either global_admin or org_admin
  const hasAdminAccess = isAdmin || userRole === 'global_admin' || userRole === 'org_admin';
  
  // Don't render the button if user has no admin access or is already on admin page
  if (!hasAdminAccess || isAdminPage) return null;
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={() => navigate("/admin")}
      className="flex items-center gap-1 text-xs flex-1 h-8 bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800"
    >
      <Shield className="h-3 w-3" />
      <span>Admin Portal</span>
    </Button>
  );
}
