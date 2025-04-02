
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { useUserRole } from "@/components/admin/hooks/useUserRole";

// Global admin SA IDs
const GLOBAL_ADMIN_SA_IDS = ['4010203040512', '7810205441087', '8905115811087'];

export function AdminButton() {
  const navigate = useNavigate();
  const { isAdmin, userRole, session } = useUserRole();
  
  // Check if the user is a predefined global admin
  const isGlobalAdminUser = session?.user?.user_metadata?.sa_id && 
                           GLOBAL_ADMIN_SA_IDS.includes(session.user.user_metadata.sa_id);
  
  // Check if the user has admin access
  const hasAdminAccess = isAdmin || userRole === 'global_admin' || userRole === 'org_admin' || isGlobalAdminUser;
  
  if (!hasAdminAccess) {
    return null;
  }
  
  const handleAdminClick = () => {
    navigate('/admin');
  };
  
  return (
    <Button 
      onClick={handleAdminClick}
      variant="ghost" 
      size="sm" 
      className="text-xs h-7 px-2 mt-1 text-green-700 hover:text-green-800 hover:bg-green-100"
    >
      <ShieldCheck className="h-3 w-3 mr-1" />
      Admin Portal
    </Button>
  );
}
