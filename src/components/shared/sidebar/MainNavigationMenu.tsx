
import { useNavigate, useLocation } from "react-router-dom";
import { useSidebarBadges } from "@/hooks/useSidebarBadges";
import { useUserRole } from "@/components/admin/hooks/useUserRole";
import { 
  SidebarMenu 
} from "@/components/ui/sidebar/menu/sidebar-menu";
import { 
  SidebarMenuButton 
} from "@/components/ui/sidebar/menu/sidebar-menu-button";
import { 
  SidebarMenuBadge 
} from "@/components/ui/sidebar/menu/sidebar-menu-badge";
import { Building2, CalendarDays, FileText, Grid3X3, LayoutDashboard, Mail, Users } from "lucide-react";

export default function MainNavigationMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { chatCount, documentsCount, calendarCount, contactsCount, leaveCount, flaggedItems } = useSidebarBadges();
  const { userRole } = useUserRole();
  
  const isActive = (path: string) => location.pathname.includes(path);
  const isAdmin = ['global_admin', 'org_admin'].includes(userRole || '');
  const isModerator = ['hr_moderator', 'comm_moderator', 'stakeholder_moderator'].includes(userRole || '');

  return (
    <SidebarMenu>
      <SidebarMenuButton 
        icon={<LayoutDashboard size={18} />}
        label="Dashboard"
        isActive={isActive('/dashboard')} 
        onClick={() => navigate('/dashboard')}
      />
      {(isAdmin || isModerator) && (
        <SidebarMenuButton 
          icon={<Building2 size={18} />}
          label="Organization"
          isActive={isActive('/organization')}
          onClick={() => navigate('/organization')}
          badge={flaggedItems > 0 ? <SidebarMenuBadge>{flaggedItems}</SidebarMenuBadge> : undefined}
        />
      )}
      <SidebarMenuButton 
        icon={<Grid3X3 size={18} />}
        label="My Desk"
        isActive={isActive('/desk')} 
        onClick={() => navigate('/desk')}
      />
      <SidebarMenuButton 
        icon={<Mail size={18} />}
        label="Chat"
        isActive={isActive('/chat')} 
        onClick={() => navigate('/chat')}
        badge={chatCount > 0 ? <SidebarMenuBadge>{chatCount}</SidebarMenuBadge> : undefined}
      />
      <SidebarMenuButton 
        icon={<FileText size={18} />}
        label="Documents"
        isActive={isActive('/documents')} 
        onClick={() => navigate('/documents')}
        badge={documentsCount > 0 ? <SidebarMenuBadge>{documentsCount}</SidebarMenuBadge> : undefined}
      />
      <SidebarMenuButton 
        icon={<CalendarDays size={18} />}
        label="Calendar"
        isActive={isActive('/calendar')} 
        onClick={() => navigate('/calendar')}
        badge={calendarCount > 0 ? <SidebarMenuBadge>{calendarCount}</SidebarMenuBadge> : undefined}
      />
      <SidebarMenuButton 
        icon={<Users size={18} />}
        label="Contacts"
        isActive={isActive('/contacts')} 
        onClick={() => navigate('/contacts')}
        badge={contactsCount > 0 ? <SidebarMenuBadge>{contactsCount}</SidebarMenuBadge> : undefined}
      />
    </SidebarMenu>
  );
}
