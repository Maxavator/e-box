
import { LucideIcon } from "lucide-react";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuBadge } from "@/components/ui/sidebar";

interface MenuItemWithBadgeProps {
  icon: LucideIcon;
  label: string;
  path: string;
  isActive?: boolean;
  badgeCount?: number;
  badgeLabel?: string;
  badgeColor?: string;
  onClick: () => void;
}

export function MenuItemWithBadge({
  icon: Icon,
  label,
  path,
  isActive,
  badgeCount,
  badgeLabel,
  badgeColor = "bg-blue-500",
  onClick,
}: MenuItemWithBadgeProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton onClick={onClick} isActive={isActive}>
        <Icon className="h-4 w-4" />
        <span>{label}</span>
        {badgeCount !== undefined && badgeCount > 0 && (
          <SidebarMenuBadge className={badgeColor}>
            {badgeCount}
          </SidebarMenuBadge>
        )}
        {badgeLabel && (
          <SidebarMenuBadge className={badgeColor}>
            {badgeLabel}
          </SidebarMenuBadge>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
