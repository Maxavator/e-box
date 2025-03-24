
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SidebarMenu } from "@/components/ui/sidebar";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUserRole } from "@/components/admin/hooks/useUserRole";
import { MainNavigationGroup, DeskNavigationGroup } from "./menu-items/NavigationGroups";

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
  
  const hasAdminAccess = isAdmin || userRole === 'global_admin' || userRole === 'org_admin';
  
  const isAdminPage = location.pathname.includes('/admin') || 
                      location.pathname.includes('/organization');
  
  const handleNavigation = (path: string) => {
    if (path === "/chat") resetBadgeCount("chat");
    if (path === "/documents") resetBadgeCount("documents");
    if (path === "/calendar") resetBadgeCount("calendar");
    if (path === "/contacts") resetBadgeCount("contacts");
    if (path === "/leave") resetBadgeCount("leave");
    
    navigate(path);
  };
  
  return (
    <SidebarMenu>
      <MainNavigationGroup 
        chatCount={chatCount}
        documentsCount={documentsCount}
        calendarCount={calendarCount}
        contactsCount={contactsCount}
        leaveCount={leaveCount}
        organizationName={organizationName}
        loading={loading}
        hasAdminAccess={hasAdminAccess}
        isAdminPage={isAdminPage}
        handleNavigation={handleNavigation}
      />
      
      <DeskNavigationGroup 
        documentsCount={documentsCount}
        leaveCount={leaveCount}
        organizationName={organizationName}
        loading={loading}
        handleNavigation={handleNavigation}
      />
    </SidebarMenu>
  );
}
