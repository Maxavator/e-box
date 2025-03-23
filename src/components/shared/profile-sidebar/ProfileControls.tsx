
import { useNavigate } from "react-router-dom";
import { LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function ProfileControls() {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate('/auth');
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to log out");
    }
  };
  
  const handleSettingsClick = () => {
    navigate('/profile');
  };
  
  return (
    <div className="flex justify-between mt-2 mb-3">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleSettingsClick}
        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
      >
        <Settings className="h-3.5 w-3.5" />
        <span>Settings</span>
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleLogout}
        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-destructive"
      >
        <LogOut className="h-3.5 w-3.5" />
        <span>Log Out</span>
      </Button>
    </div>
  );
}
