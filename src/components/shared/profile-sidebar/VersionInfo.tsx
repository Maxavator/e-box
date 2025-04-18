
import { Info, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { APP_VERSION } from "@/utils/version";
import { getLatestChanges } from "@/utils/changelog";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function VersionInfo() {
  const navigate = useNavigate();
  const latestChanges = getLatestChanges();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate('/logout');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="flex items-center justify-between mt-auto pt-2 border-t border-muted/20 text-xs text-muted-foreground">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="text-xs hover:underline">
              e-Box {APP_VERSION}
            </button>
          </TooltipTrigger>
          <TooltipContent className="w-72 p-3">
            <div className="space-y-2">
              <h4 className="font-medium">Latest Changes ({latestChanges?.version})</h4>
              <p className="text-xs text-muted-foreground">{latestChanges?.date}</p>
              <ul className="text-xs space-y-1 list-disc pl-4">
                {latestChanges?.changes.map((change, i) => (
                  <li key={i}>{change}</li>
                ))}
              </ul>
              <p className="text-xs pt-2">
                <a 
                  className="text-primary hover:underline cursor-pointer"
                  onClick={() => navigate("/changelog")}
                >
                  View full changelog
                </a>
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <div className="flex items-center gap-1">
        <ThemeToggle />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Info className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>© 2025 Afrovation. All rights reserved.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Changed logout button to include text */}
        <Button 
          variant="ghost"
          size="sm"
          className="h-6 text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
          onClick={handleLogout}
        >
          <LogOut className="h-3 w-3" />
          Logout
        </Button>
      </div>
    </div>
  );
}
