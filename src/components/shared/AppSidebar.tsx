
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/components/admin/hooks/useUserRole";
import {
  MessageSquare,
  FileText,
  Calendar,
  Users,
  Clock,
  Settings,
  Shield,
  Briefcase,
  LayoutDashboard,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
} from "@/components/ui/sidebar";
import { UserProfileSidebarFooter } from "./UserProfileSidebarFooter";
import { useSidebarBadges } from "@/hooks/useSidebarBadges";

export function AppSidebar() {
  const navigate = useNavigate();
  const { isAdmin, userRole } = useUserRole();
  const { 
    chatCount, 
    documentsCount, 
    calendarCount, 
    contactsCount, 
    leaveCount, 
    resetBadgeCount 
  } = useSidebarBadges();
  
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
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center p-4 border-none bg-sidebar">
        <button 
          onClick={() => handleNavigation("/dashboard")}
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
        <SidebarMenu>
          {/* Main navigation items */}
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
              tooltip="Chat" 
              onClick={() => handleNavigation("/chat")}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Chat</span>
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
          
          {(isAdmin || userRole === 'org_admin' || userRole === 'global_admin') && (
            <SidebarMenuItem>
              <SidebarMenuButton 
                tooltip="Admin Portal" 
                onClick={() => handleNavigation("/admin")}
              >
                <Shield className="h-4 w-4" />
                <span>Admin Portal</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-border/30 bg-sidebar">
        <UserProfileSidebarFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
