
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/components/admin/hooks/useUserRole";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
} from "@/components/ui/sidebar";

import { UserProfileSidebarFooter } from "./UserProfileSidebarFooter";
import { useSidebarBadges } from "@/hooks/useSidebarBadges";
import { MainNavigationMenu } from "./sidebar/MainNavigationMenu";

export function AppSidebar() {
  const navigate = useNavigate();
  const { isAdmin, userRole, isLoading, error } = useUserRole();
  const { 
    chatCount, 
    documentsCount, 
    calendarCount, 
    contactsCount, 
    leaveCount, 
    resetBadgeCount 
  } = useSidebarBadges();
  
  // Consider a user to have admin access if they are either global_admin or org_admin
  const hasAdminAccess = isAdmin || userRole === 'global_admin' || userRole === 'org_admin';
  
  // Add more debug logs to help diagnose the issue
  console.log('Sidebar - User role:', userRole);
  console.log('Sidebar - Is admin:', isAdmin);
  console.log('Sidebar - Has admin access:', hasAdminAccess);
  console.log('Sidebar - Admin check details:', { isAdmin, userRole, hasAdminAccess });

  if (error) {
    console.error('Sidebar - Error fetching user role:', error);
  }

  const handleLogoClick = () => {
    navigate("/dashboard");
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center p-4 border-none bg-sidebar">
        <button 
          onClick={handleLogoClick}
          className="hover:opacity-90 transition-opacity cursor-pointer"
          aria-label="Go to Dashboard"
        >
          <img 
            src="/lovable-uploads/81af9ad8-b07d-41cb-b800-92cebc70e699.png" 
            alt="e-Box by Afrovation" 
            className="h-12" 
          />
        </button>
      </SidebarHeader>
      
      <SidebarContent className="border-t-0 flex-1 bg-sidebar">
        {/* Main navigation menu */}
        <SidebarGroup>
          <MainNavigationMenu 
            chatCount={chatCount}
            documentsCount={documentsCount}
            calendarCount={calendarCount}
            contactsCount={contactsCount}
            leaveCount={leaveCount}
            resetBadgeCount={resetBadgeCount}
            isAdmin={hasAdminAccess}
          />
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-border/30 bg-sidebar">
        <UserProfileSidebarFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
