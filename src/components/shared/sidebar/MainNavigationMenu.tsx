
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  FileText,
  Calendar,
  Users,
  Clock,
  Settings,
  Briefcase,
  LayoutDashboard,
} from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
} from "@/components/ui/sidebar";

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
  resetBadgeCount
}: MainNavigationMenuProps) {
  const navigate = useNavigate();
  
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
          tooltip="Dashboard" 
          onClick={() => handleNavigation("/dashboard")}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Dashboard</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
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
          tooltip="Documents" 
          onClick={() => handleNavigation("/documents")}
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
      
      <SidebarMenuItem>
        <SidebarMenuButton 
          tooltip="Leave Manager" 
          onClick={() => handleNavigation("/leave")}
        >
          <Clock className="h-4 w-4" />
          <span>Leave Manager</span>
          {leaveCount > 0 && (
            <SidebarMenuBadge className="ml-auto bg-purple-500 text-white text-[10px] h-4 min-w-4 flex items-center justify-center rounded-full">
              {leaveCount}
            </SidebarMenuBadge>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton 
          tooltip="Policies" 
          onClick={() => handleNavigation("/policies")}
        >
          <Briefcase className="h-4 w-4" />
          <span>Policies</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton 
          tooltip="Settings" 
          onClick={() => handleNavigation("/profile")}
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
