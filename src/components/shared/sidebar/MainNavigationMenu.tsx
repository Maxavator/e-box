
import { useUserRole } from "@/components/admin/hooks/useUserRole";
import { Link, useLocation } from "react-router-dom";
import {
  BookOpen,
  BookText,
  Building2,
  Calendar,
  ClipboardList,
  Cog,
  FileText,
  Flag,
  FolderClosed,
  Home,
  LifeBuoy,
  MessageSquare,
  ShieldCheck,
  Users
} from "lucide-react";
import { useSidebarBadges } from "@/hooks/useSidebarBadges";
import { SidebarMenu } from "@/components/ui/sidebar/menu/sidebar-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar/menu/sidebar-menu-button";
import { SidebarMenuBadge } from "@/components/ui/sidebar/menu/sidebar-menu-badge";

export default function MainNavigationMenu() {
  const location = useLocation();
  const pathname = location.pathname;
  const { isAdmin, userRole } = useUserRole();
  const { chatCount, documentsCount } = useSidebarBadges();
  
  // Mock flaggedItems if it doesn't exist in the hook
  const flaggedItems = 0;
  
  const isModerator = 
    userRole === 'hr_moderator' || 
    userRole === 'comm_moderator' || 
    userRole === 'stakeholder_moderator';
  
  const isOrgAdmin = userRole === 'org_admin';

  return (
    <SidebarMenu>
      <SidebarMenuButton asChild>
        <Link to="/dashboard" className={pathname === "/dashboard" ? "active" : ""}>
          <Home className="h-4 w-4 mr-2" />
          Dashboard
        </Link>
      </SidebarMenuButton>
      
      {/* Desk Group - Moved before Moderation */}
      <SidebarMenuButton asChild>
        <Link to="/mydesk" className={pathname === "/mydesk" ? "active" : ""}>
          <FolderClosed className="h-4 w-4 mr-2" />
          My Desk
        </Link>
      </SidebarMenuButton>
      
      <SidebarMenuButton asChild>
        <Link to="/documents" className={pathname === "/documents" ? "active" : ""}>
          <FileText className="h-4 w-4 mr-2" />
          Documents
        </Link>
      </SidebarMenuButton>
      
      <SidebarMenuButton asChild>
        <Link to="/calendar" className={pathname === "/calendar" ? "active" : ""}>
          <Calendar className="h-4 w-4 mr-2" />
          Calendar
        </Link>
      </SidebarMenuButton>
      
      <SidebarMenuButton asChild>
        <Link to="/contacts" className={pathname === "/contacts" ? "active" : ""}>
          <Users className="h-4 w-4 mr-2" />
          Contacts
        </Link>
      </SidebarMenuButton>
      
      <SidebarMenuButton asChild>
        <Link to="/notes" className={pathname === "/notes" ? "active" : ""}>
          <ClipboardList className="h-4 w-4 mr-2" />
          Notes
        </Link>
      </SidebarMenuButton>
      
      {/* Organization */}
      <SidebarMenuButton asChild>
        <Link to="/organization" className={pathname === "/organization" ? "active" : ""}>
          <Building2 className="h-4 w-4 mr-2" />
          Organization
        </Link>
      </SidebarMenuButton>
      
      <SidebarMenuButton asChild>
        <Link to="/members" className={pathname === "/members" ? "active" : ""}>
          <Users className="h-4 w-4 mr-2" />
          Organization Members
        </Link>
      </SidebarMenuButton>
      
      {/* Admin */}
      {(isAdmin || isOrgAdmin) && (
        <SidebarMenuButton asChild>
          <Link to="/admin" className={pathname === "/admin" ? "active" : ""}>
            <ShieldCheck className="h-4 w-4 mr-2" />
            Admin Portal
          </Link>
        </SidebarMenuButton>
      )}
      
      {/* Moderation - Moved after Desk */}
      {(isAdmin || isModerator) && (
        <SidebarMenuButton asChild>
          <Link to="/moderation" className={pathname === "/moderation" ? "active" : ""}>
            <Flag className="h-4 w-4 mr-2" />
            Moderation
            {flaggedItems > 0 && (
              <SidebarMenuBadge>
                {flaggedItems}
              </SidebarMenuBadge>
            )}
          </Link>
        </SidebarMenuButton>
      )}
      
      {/* Communication */}
      <SidebarMenuButton asChild>
        <Link to="/chat" className={pathname === "/chat" ? "active" : ""}>
          <MessageSquare className="h-4 w-4 mr-2" />
          Messages
          {chatCount > 0 && (
            <SidebarMenuBadge>
              {chatCount}
            </SidebarMenuBadge>
          )}
        </Link>
      </SidebarMenuButton>
      
      {/* Settings & Help */}
      <SidebarMenuButton asChild>
        <Link to="/policies" className={pathname === "/policies" ? "active" : ""}>
          <BookOpen className="h-4 w-4 mr-2" />
          Policies
        </Link>
      </SidebarMenuButton>
      
      <SidebarMenuButton asChild>
        <Link to="/profile" className={pathname === "/profile" ? "active" : ""}>
          <Cog className="h-4 w-4 mr-2" />
          Settings
        </Link>
      </SidebarMenuButton>
      
      <SidebarMenuButton asChild>
        <Link to="/changelog" className={pathname === "/changelog" ? "active" : ""}>
          <BookText className="h-4 w-4 mr-2" />
          Changelog
        </Link>
      </SidebarMenuButton>
      
      <SidebarMenuButton className="cursor-not-allowed">
        <LifeBuoy className="h-4 w-4 mr-2" />
        Help & Support
      </SidebarMenuButton>
    </SidebarMenu>
  );
}
