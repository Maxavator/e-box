
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/components/admin/hooks/useUserRole";
import {
  LayoutDashboard,
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
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const navigate = useNavigate();
  const { isAdmin, userRole } = useUserRole();
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="flex items-center justify-center p-4">
        <div className="font-bold text-xl flex items-center justify-center">
          <span className="text-primary">Work</span>
          <span>OS</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
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
              tooltip="Chat" 
              onClick={() => handleNavigation("/chat")}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              tooltip="Documents" 
              onClick={() => handleNavigation("/documents")}
            >
              <FileText className="h-4 w-4" />
              <span>Documents</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              tooltip="Calendar" 
              onClick={() => handleNavigation("/calendar")}
            >
              <Calendar className="h-4 w-4" />
              <span>Calendar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              tooltip="Contacts" 
              onClick={() => handleNavigation("/contacts")}
            >
              <Users className="h-4 w-4" />
              <span>Contacts</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              tooltip="Leave Manager" 
              onClick={() => handleNavigation("/leave")}
            >
              <Clock className="h-4 w-4" />
              <span>Leave Manager</span>
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
          
          {(isAdmin || userRole === 'org_admin' || userRole === 'global_admin') && (
            <SidebarMenuItem>
              <SidebarMenuButton 
                tooltip="Admin Tools" 
                onClick={() => handleNavigation("/admin")}
              >
                <Shield className="h-4 w-4" />
                <span>Admin Tools</span>
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
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="text-xs text-center text-muted-foreground">
          WorkOS v1.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
