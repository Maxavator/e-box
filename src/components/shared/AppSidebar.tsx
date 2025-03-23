
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/components/admin/hooks/useUserRole";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

import { UserProfileSidebarFooter } from "./UserProfileSidebarFooter";
import { useSidebarBadges } from "@/hooks/useSidebarBadges";
import { MainNavigationMenu } from "./sidebar/MainNavigationMenu";
import { AdminToolsMenu } from "./sidebar/AdminToolsMenu";

export function AppSidebar() {
  const navigate = useNavigate();
  const { isAdmin, userRole, isLoading } = useUserRole();
  const { 
    chatCount, 
    documentsCount, 
    calendarCount, 
    contactsCount, 
    leaveCount, 
    resetBadgeCount 
  } = useSidebarBadges();
  
  console.log('Sidebar - User role:', userRole);
  console.log('Sidebar - Is admin:', isAdmin);
  
  // Improved admin roles check - fix the issue by ensuring all admin roles are properly detected
  const hasAdminAccess = isAdmin || userRole === 'org_admin' || userRole === 'global_admin';
  
  // Add more debug logs to help diagnose the issue
  console.log('Sidebar - Has admin access:', hasAdminAccess);
  console.log('Sidebar - Admin check details:', { isAdmin, userRole, hasAdminAccess });

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center p-4 border-none bg-sidebar">
        <button 
          onClick={() => navigate("/dashboard")}
          className="hover:opacity-90 transition-opacity"
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
          />
        </SidebarGroup>
          
        {/* Admin tools section - Only visible to admin users */}
        {/* Force display the admin section for debugging */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-xs font-medium px-3 py-2">
            Admin Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <AdminToolsMenu />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-border/30 bg-sidebar">
        <UserProfileSidebarFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
