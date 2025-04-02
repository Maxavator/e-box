
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { useUserRole } from "@/components/admin/hooks/useUserRole";

export function AdminButton() {
  const navigate = useNavigate();
  const { isAdmin, userRole, session } = useUserRole();
  
  // Check if the user is an admin or has the target SA ID
  const isTargetUser = session?.user?.user_metadata?.sa_id === '7810205441087';
  const hasAdminAccess = isAdmin || userRole === 'global_admin' || userRole === 'org_admin' || isTargetUser;
  
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
