
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProfileControlsProps {
  isSpecialUser?: boolean;
}

export function ProfileControls({ isSpecialUser = false }: ProfileControlsProps) {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Failed to logout");
    }
  };

  const handleSettings = () => {
    navigate('/profile');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-between gap-2 my-2">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handleSettings}
        className={`h-9 w-9 ${isSpecialUser ? 'border-amber-300/30 hover:border-amber-300/60' : ''}`}
      >
        <Settings className={`h-4 w-4 ${isSpecialUser ? 'text-amber-300' : ''}`} />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handleRefresh}
        className={`h-9 w-9 ${isSpecialUser ? 'border-amber-300/30 hover:border-amber-300/60' : ''}`}
      >
        <RefreshCw className={`h-4 w-4 ${isSpecialUser ? 'text-amber-300' : ''}`} />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handleLogout}
        className={`h-9 w-9 ${isSpecialUser ? 'border-amber-300/30 hover:border-amber-300/60 hover:bg-red-50 hover:text-red-500' : 'hover:bg-red-50 hover:text-red-500'}`}
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
