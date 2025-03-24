
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
  Inbox,
  Building2,
  FileStack,
  ScrollText,
  Lightbulb,
  ClipboardList,
  Mail,
  Zap,
  HelpCircle,
} from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarMenuSub,
  SidebarMenuSubTrigger,
  SidebarMenuSubContent,
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
  const { organizationName, loading } = useUserProfile();
  const { isAdmin, userRole } = useUserRole();
  
  // Consider a user to have admin access if they are either global_admin or org_admin
  const hasAdminAccess = isAdmin || userRole === 'global_admin' || userRole === 'org_admin';
  
  // Check if current route is an admin route
  const isAdminPage = location.pathname.includes('/admin') || 
                      location.pathname.includes('/organization');
  
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
      {/* Root menu items section */}
      <SidebarMenuItem>
        <SidebarMenuButton 
          tooltip="Chats" 
          onClick={() => handleNavigation("/chat")}
          isActive={location.pathname === "/chat"}
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
          isActive={location.pathname === "/calendar"}
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
          isActive={location.pathname === "/contacts"}
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

      <SidebarMenuItem>
        <SidebarMenuButton 
          tooltip="Documents" 
          onClick={() => handleNavigation("/documents")}
          isActive={location.pathname === "/documents"}
        >
          <FileText className="h-4 w-4" />
          <span>Documents</span>
          {documentsCount > 0 && (
            <SidebarMenuBadge className="ml-auto bg-blue-500 text-white text-[10px] h-4 min-w-4 flex items-center justify-center rounded-full">
              {documentsCount}
            </SidebarMenuBadge>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton 
          tooltip="Notes" 
          onClick={() => handleNavigation("/notes")}
          isActive={location.pathname === "/notes"}
        >
          <ScrollText className="h-4 w-4" />
          <span>Notes</span>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton 
          tooltip="Surveys" 
          onClick={() => handleNavigation("/surveys")}
          isActive={location.pathname === "/surveys"}
        >
          <ClipboardList className="h-4 w-4" />
          <span>Surveys</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      {/* Admin Portal menu item - only show if user has admin access */}
      {hasAdminAccess && (
        <SidebarMenuItem>
          <SidebarMenuButton 
            tooltip="Admin Portal" 
            onClick={() => handleNavigation("/admin")}
            isActive={isAdminPage}
          >
            <Shield className="h-4 w-4" />
            <span>Admin Portal</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
      
      {/* Desk as a root item - moved just above Settings */}
      <SidebarMenuItem>
        <SidebarMenuButton 
          tooltip="Desk" 
          onClick={() => handleNavigation("/mydesk")}
          isActive={location.pathname === "/mydesk"}
        >
          <Briefcase className="h-4 w-4" />
          <span>Desk {!loading && organizationName ? `@${organizationName}` : ''}</span>
          {(documentsCount > 0 || leaveCount > 0) && (
            <SidebarMenuBadge className="ml-auto bg-blue-500 text-white text-[10px] h-4 min-w-4 flex items-center justify-center rounded-full">
              {documentsCount + leaveCount}
            </SidebarMenuBadge>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      {/* GovZA as a root item - moved just above Settings */}
      <SidebarMenuItem>
        <SidebarMenuButton 
          tooltip="GovZA" 
          onClick={() => handleNavigation("/govza")}
          isActive={location.pathname.includes('/govza')}
        >
          <Building2 className="h-4 w-4" />
          <span>GovZA</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton 
          tooltip="Settings" 
          onClick={() => handleNavigation("/profile")}
          isActive={location.pathname === "/profile"}
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
