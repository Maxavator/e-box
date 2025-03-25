
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
  FileStack,
  MailOpen,
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
        badgeCount={chatCount > 0 ? chatCount : undefined}
        badgeColor="bg-red-500"
        onClick={() => handleNavigation("/chat")}
      />
      
      <MenuItemWithBadge
        icon={Calendar}
        label="Calendar"
        path="/calendar"
        isActive={location.pathname === "/calendar"}
        badgeCount={calendarCount > 0 ? calendarCount : undefined}
        badgeColor="bg-green-500"
        onClick={() => handleNavigation("/calendar")}
      />
      
      <MenuItemWithBadge
        icon={Users}
        label="Contacts"
        path="/contacts"
        isActive={location.pathname === "/contacts"}
        badgeCount={contactsCount > 0 ? contactsCount : undefined}
        badgeColor="bg-amber-500"
        onClick={() => handleNavigation("/contacts")}
      />
      
      <MenuItemWithBadge
        icon={FileText}
        label="Documents"
        path="/documents"
        isActive={location.pathname === "/documents"}
        badgeCount={documentsCount > 0 ? documentsCount : undefined}
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
  
  // Calculate total desk notifications, but only show if greater than 0
  const totalDeskNotifications = documentsCount + leaveCount;
  
  // Improved active state detection for desk-related pages
  const isDeskActive = location.pathname === "/mydesk" || 
                       location.pathname.startsWith("/desk/");
                     
  // Check if we're on a specific desk subpage
  const isDocumentsActive = location.pathname === "/desk/documents";
  const isLeaveActive = location.pathname === "/desk/leave";
  const isInboxActive = location.pathname === "/desk/inbox";
  const isPayslipActive = location.pathname === "/desk/payslip";
                        
  // Check if we're on the GovZA page
  const isGovZAActive = location.pathname.includes('/govza');
  
  return (
    <>
      <MenuItemWithBadge
        icon={Briefcase}
        label={`Desk ${!loading && organizationName ? `@${organizationName}` : ''}`}
        path="/mydesk"
        isActive={isDeskActive}
        badgeCount={totalDeskNotifications > 0 ? totalDeskNotifications : undefined}
        badgeColor="bg-blue-500"
        onClick={() => handleNavigation("/mydesk")}
      />
      
      {/* Only show these items if we are in a desk-related page */}
      {isDeskActive && (
        <>
          <MenuItemWithBadge
            icon={FileText}
            label="Documents"
            path="/desk/documents"
            isActive={isDocumentsActive}
            badgeCount={documentsCount > 0 ? documentsCount : undefined}
            badgeColor="bg-blue-500"
            onClick={() => handleNavigation("/desk/documents")}
          />
          
          <MenuItemWithBadge
            icon={Calendar}
            label="Leave"
            path="/desk/leave"
            isActive={isLeaveActive}
            badgeCount={leaveCount > 0 ? leaveCount : undefined}
            badgeColor="bg-green-500"
            onClick={() => handleNavigation("/desk/leave")}
          />
          
          <MenuItemWithBadge
            icon={MailOpen}
            label="Inbox"
            path="/desk/inbox"
            isActive={isInboxActive}
            onClick={() => handleNavigation("/desk/inbox")}
          />
          
          <MenuItemWithBadge
            icon={FileStack}
            label="Payslip"
            path="/desk/payslip"
            isActive={isPayslipActive}
            badgeLabel="New"
            badgeColor="bg-green-500"
            onClick={() => handleNavigation("/desk/payslip")}
          />
        </>
      )}
      
      <MenuItemWithBadge
        icon={Flag}
        label="Government Services"
        path="/govza"
        isActive={isGovZAActive}
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
