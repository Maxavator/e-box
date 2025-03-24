
import React from 'react';
import { cn } from '@/lib/utils';

interface SidebarMenuButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  badge?: React.ReactNode;
}

export function SidebarMenuButton({
  icon,
  label,
  isActive = false,
  onClick,
  badge,
}: SidebarMenuButtonProps) {
  return (
    <button
      className={cn(
        'flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-accent text-accent-foreground'
          : 'transparent hover:bg-muted hover:text-muted-foreground'
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground">{icon}</span>
        <span>{label}</span>
      </div>
      {badge}
    </button>
  );
}
