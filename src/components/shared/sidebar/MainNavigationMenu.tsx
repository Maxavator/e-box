
import { useNavigate, useLocation } from "react-router-dom";
import {
  MessageSquare,
  FileText,
  Calendar,
  Users,
  Clock,
  Settings,
  Shield,
  Briefcase,
} from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
} from "@/components/ui/sidebar";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUserRole } from "@/components/admin/hooks/useUserRole";

interface MainNavigationMenuProps {
  chatCount: number;
  documentsCount: number;
  calendarCount: number;
  contactsCount: number;
  leaveCount: number;
  resetBadgeCount: (type: 'chat' | 'documents' | 'calendar' | 'contacts' | 'leave') => void;
}

export function MainNavigationMenu({
  chatCount,
  documentsCount,
  calendarCount,
  contactsCount,
  leaveCount,
  resetBadgeCount,
}: MainNavigationMenuProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { organizationName } = useUserProfile();
  const { isAdmin, userRole } = useUserRole();
  
  // Consider a user to have admin access if they are either global_admin or org_admin
  const hasAdminAccess = isAdmin || userRole === 'global_admin' || userRole === 'org_admin';
  
  const handleNavigation = (path: string) => {
    // Reset the respective badge count when navigating to a section
    if (path === "/chat") resetBadgeCount("chat");
    if (path === "/documents") resetBadgeCount("documents");
    if (path === "/calendar") resetBadgeCount("calendar");
    if (path === "/contacts") resetBadgeCount("contacts");
    if (path === "/leave") resetBadgeCount("leave");
    
    navigate(path);
  };
  
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton 
          tooltip="Chats" 
          onClick={() => handleNavigation("/chat")}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Chats</span>
          {chatCount > 0 && (
            <SidebarMenuBadge className="ml-auto bg-red-500 text-white text-[10px] h-4 min-w-4 flex items-center justify-center rounded-full">
              {chatCount}
            </SidebarMenuBadge>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton 
          tooltip="Calendar" 
          onClick={() => handleNavigation("/calendar")}
        >
          <Calendar className="h-4 w-4" />
          <span>Calendar</span>
          {calendarCount > 0 && (
            <SidebarMenuBadge className="ml-auto bg-green-500 text-white text-[10px] h-4 min-w-4 flex items-center justify-center rounded-full">
              {calendarCount}
            </SidebarMenuBadge>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton 
          tooltip="Contacts" 
          onClick={() => handleNavigation("/contacts")}
        >
          <Users className="h-4 w-4" />
          <span>Contacts</span>
          {contactsCount > 0 && (
            <SidebarMenuBadge className="ml-auto bg-amber-500 text-white text-[10px] h-4 min-w-4 flex items-center justify-center rounded-full">
              {contactsCount}
            </SidebarMenuBadge>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      {/* Admin Portal menu item - displayed prominently for admin users */}
      {hasAdminAccess && (
        <SidebarMenuItem>
          <SidebarMenuButton 
            tooltip="Admin Portal" 
            onClick={() => handleNavigation("/admin")}
            isActive={location.pathname.startsWith('/admin')}
          >
            <Shield className="h-4 w-4" />
            <span>Admin Portal</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
      
      <SidebarMenuItem>
        <SidebarMenuButton 
          tooltip="Settings" 
          onClick={() => handleNavigation("/profile")}
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      {/* My Desk as a direct button */}
      <SidebarMenuItem>
        <SidebarMenuButton 
          tooltip="My Desk"
          onClick={() => handleNavigation("/mydesk")}
        >
          <Briefcase className="h-4 w-4" />
          <span>My Desk {organizationName ? `@${organizationName}` : ''}</span>
          {(documentsCount > 0 || leaveCount > 0) && (
            <SidebarMenuBadge className="ml-auto bg-blue-500 text-white text-[10px] h-4 min-w-4 flex items-center justify-center rounded-full">
              {documentsCount + leaveCount}
            </SidebarMenuBadge>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
