
import React from 'react';
import { cn } from '@/lib/utils';

interface SidebarMenuBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function SidebarMenuBadge({ children, className }: SidebarMenuBadgeProps) {
  return (
    <div
      className={cn(
        'flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground',
        className
      )}
    >
      {children}
    </div>
  );
}
