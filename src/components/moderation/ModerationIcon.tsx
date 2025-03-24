
import { ShieldCheck, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useUserRole } from "@/components/admin/hooks/useUserRole";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ModerationIcon() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole, isLoading } = useUserRole();
  
  // Check if user has moderation privileges
  const isModerator = 
    userRole === 'hr_moderator' || 
    userRole === 'comm_moderator' || 
    userRole === 'stakeholder_moderator' ||
    userRole === 'global_admin' ||
    userRole === 'org_admin';
  
  const isActive = location.pathname === "/moderation";
  
  if (isLoading || !isModerator) {
    return null;
  }
  
  // Get badge count representing flagged items that need attention
  // In a real implementation, this would come from your backend
  const flaggedCount = 5;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isActive ? "default" : "outline"}
            size="sm"
            className="relative"
            onClick={() => navigate("/moderation")}
          >
            {userRole?.includes('moderator') ? (
              <Flag className="h-4 w-4 mr-2" />
            ) : (
              <ShieldCheck className="h-4 w-4 mr-2" />
            )}
            Moderation
            {flaggedCount > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 text-[10px] h-4 min-w-4 flex items-center justify-center rounded-full">
                {flaggedCount}
              </Badge>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {flaggedCount > 0 ? 
              `${flaggedCount} items require your attention` : 
              "Moderation portal"
            }
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
