
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { OnlineStatus } from "@/components/user/OnlineStatus";
import { UserRoleBadge } from "./UserRoleBadge";

export function ProfileControls() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="flex items-center gap-2">      
      <OnlineStatus>
        <span className="mx-1">•</span>
        <UserRoleBadge />
      </OnlineStatus>
      
      <span className="text-muted-foreground ml-auto">|</span>
      
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
  );
}
