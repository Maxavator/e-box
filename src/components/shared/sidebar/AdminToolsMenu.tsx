
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Database,
  UserCog,
} from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function AdminToolsMenu() {
  const navigate = useNavigate();
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton 
          tooltip="Admin Portal" 
          onClick={() => handleNavigation("/admin")}
        >
          <Shield className="h-4 w-4" />
          <span>Admin Portal</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton 
          tooltip="Organization" 
          onClick={() => handleNavigation("/organization")}
        >
          <Database className="h-4 w-4" />
          <span>Organization</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton 
          tooltip="User Management" 
          onClick={() => handleNavigation("/admin?tab=users")}
        >
          <UserCog className="h-4 w-4" />
          <span>User Management</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
