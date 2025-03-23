
import * as React from "react"
import { cn } from "@/lib/utils"

export const SidebarMenuSubContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="menu-sub-content"
    className={cn(
      "w-full",
      className
    )}
    {...props}
  />
))
SidebarMenuSubContent.displayName = "SidebarMenuSubContent"
