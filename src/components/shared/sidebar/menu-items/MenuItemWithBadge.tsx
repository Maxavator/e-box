
import React from "react";
import { SidebarMenuItem, SidebarMenuButton, SidebarMenuBadge } from "@/components/ui/sidebar";
import { LucideIcon } from "lucide-react";

interface MenuItemWithBadgeProps {
  icon: LucideIcon;
  label: string;
  path: string;
  isActive: boolean;
  badgeCount?: number;
  badgeColor?: string;
  badgeLabel?: string;
  onClick: () => void;
}

export const MenuItemWithBadge = ({
  icon: Icon,
  label,
  path,
  isActive,
  badgeCount,
  badgeColor = "bg-red-500",
  badgeLabel,
  onClick,
}: MenuItemWithBadgeProps) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={label}
        onClick={onClick}
        isActive={isActive}
      >
        <Icon className="h-4 w-4" />
        <span>{label}</span>
        
        {/* Only show badge count if it's greater than 0 and defined */}
        {badgeCount !== undefined && badgeCount > 0 && (
          <SidebarMenuBadge className={`ml-auto ${badgeColor} text-white text-[10px] h-4 min-w-4 flex items-center justify-center rounded-full`}>
            {badgeCount}
          </SidebarMenuBadge>
        )}
        
        {/* For label badges like "New" */}
        {badgeLabel && (
          <SidebarMenuBadge className={`ml-auto ${badgeColor} text-white text-[10px] h-4 min-w-4 flex items-center justify-center rounded-full`}>
            {badgeLabel}
          </SidebarMenuBadge>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
