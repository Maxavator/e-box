
import React from "react";
import { useLocation } from "react-router-dom";
import {
  MessageSquare,
  FileText,
  Calendar,
  Users,
  Settings,
  Shield,
  Briefcase,
  Building2,
  StickyNote,
  ClipboardList,
  Flag,
} from "lucide-react";
import { MenuItemWithBadge } from "./MenuItemWithBadge";

interface NavigationGroupsProps {
  chatCount: number;
  documentsCount: number;
  calendarCount: number;
  contactsCount: number;
  leaveCount: number;
  organizationName: string | null;
  loading: boolean;
  hasAdminAccess: boolean;
  isAdminPage: boolean;
  handleNavigation: (path: string) => void;
}

export const MainNavigationGroup = ({
  chatCount,
  documentsCount,
  calendarCount,
  contactsCount,
  leaveCount,
  organizationName,
  loading,
  hasAdminAccess,
  isAdminPage,
  handleNavigation,
}: NavigationGroupsProps) => {
  const location = useLocation();

  return (
    <>
      <MenuItemWithBadge
        icon={MessageSquare}
        label="Chats"
        path="/chat"
        isActive={location.pathname === "/chat"}
        badgeCount={chatCount}
        badgeColor="bg-red-500"
        onClick={() => handleNavigation("/chat")}
      />
      
      <MenuItemWithBadge
        icon={Calendar}
        label="Calendar"
        path="/calendar"
        isActive={location.pathname === "/calendar"}
        badgeCount={calendarCount}
        badgeColor="bg-green-500"
        onClick={() => handleNavigation("/calendar")}
      />
      
      <MenuItemWithBadge
        icon={Users}
        label="Contacts"
        path="/contacts"
        isActive={location.pathname === "/contacts"}
        badgeCount={contactsCount}
        badgeColor="bg-amber-500"
        onClick={() => handleNavigation("/contacts")}
      />
      
      <MenuItemWithBadge
        icon={FileText}
        label="Documents"
        path="/documents"
        isActive={location.pathname === "/documents"}
        badgeCount={documentsCount}
        badgeColor="bg-blue-500"
        onClick={() => handleNavigation("/documents")}
      />
      
      <MenuItemWithBadge
        icon={StickyNote}
        label="Notes"
        path="/notes"
        isActive={location.pathname === "/notes"}
        onClick={() => handleNavigation("/notes")}
      />
      
      <MenuItemWithBadge
        icon={ClipboardList}
        label="Surveys"
        path="/surveys"
        isActive={location.pathname === "/surveys"}
        onClick={() => handleNavigation("/surveys")}
      />
      
      {hasAdminAccess && (
        <MenuItemWithBadge
          icon={Shield}
          label="Admin Portal"
          path="/admin"
          isActive={isAdminPage}
          onClick={() => handleNavigation("/admin")}
        />
      )}
    </>
  );
};

export const DeskNavigationGroup = ({
  documentsCount,
  leaveCount,
  organizationName,
  loading,
  handleNavigation,
}: Pick<NavigationGroupsProps, 'documentsCount' | 'leaveCount' | 'organizationName' | 'loading' | 'handleNavigation'>) => {
  const location = useLocation();
  
  return (
    <>
      <MenuItemWithBadge
        icon={Briefcase}
        label={`Desk ${!loading && organizationName ? `@${organizationName}` : ''}`}
        path="/mydesk"
        isActive={location.pathname === "/mydesk" || location.pathname.startsWith("/desk/")}
        badgeCount={documentsCount + leaveCount > 0 ? documentsCount + leaveCount : undefined}
        badgeColor="bg-blue-500"
        onClick={() => handleNavigation("/mydesk")}
      />
      
      <MenuItemWithBadge
        icon={Flag}
        label="Government Services"
        path="/govza"
        isActive={location.pathname.includes('/govza')}
        badgeLabel="New"
        badgeColor="bg-green-500"
        onClick={() => handleNavigation("/govza")}
      />
      
      <MenuItemWithBadge
        icon={Settings}
        label="Settings"
        path="/profile"
        isActive={location.pathname === "/profile"}
        onClick={() => handleNavigation("/profile")}
      />
    </>
  );
};
