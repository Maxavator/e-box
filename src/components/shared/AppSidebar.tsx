
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/components/admin/hooks/useUserRole";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
} from "@/components/ui/sidebar";

import { UserProfileSidebarFooter } from "./profile-sidebar/UserProfileSidebarFooter";
import { useSidebarBadges } from "@/hooks/useSidebarBadges";
import { MainNavigationMenu } from "./sidebar/MainNavigationMenu";

export function AppSidebar() {
  const navigate = useNavigate();
  const { 
    chatCount, 
    documentsCount, 
    calendarCount, 
    contactsCount, 
    leaveCount, 
    resetBadgeCount 
  } = useSidebarBadges();

  const handleLogoClick = () => {
    navigate("/dashboard");
  };

  return (
    <Sidebar className="border-r border-border/30">
      <SidebarHeader className="flex items-center justify-center p-4 border-none bg-sidebar">
        <button 
          onClick={handleLogoClick}
          className="hover:opacity-90 transition-opacity cursor-pointer"
          aria-label="Go to Dashboard"
        >
          <img 
            src="/lovable-uploads/dbb30299-d801-4939-9dd4-ef26c4cc55cd.png" 
            alt="e-Box" 
            className="h-14 w-auto max-w-[90%]" 
          />
        </button>
      </SidebarHeader>
      
      <SidebarContent className="border-t-0 flex-1 bg-sidebar">
        <SidebarGroup>
          <MainNavigationMenu 
            chatCount={chatCount}
            documentsCount={documentsCount}
            calendarCount={calendarCount}
            contactsCount={contactsCount}
            leaveCount={leaveCount}
            resetBadgeCount={resetBadgeCount}
          />
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-border/30 bg-sidebar">
        <UserProfileSidebarFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
