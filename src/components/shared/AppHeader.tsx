
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, Bell, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AdminMenu } from "@/components/admin/AdminMenu";
import { useUserRole } from "@/components/admin/hooks/useUserRole";
import { ThemeToggle } from "./ThemeToggle";
import { ModerationIcon } from "@/components/moderation/ModerationIcon";

export function AppHeader() {
  const { firstName, lastName } = useUserProfile();
  const { isAdmin } = useUserRole();
  const navigate = useNavigate();
  const supabase = useSupabaseClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <SidebarTrigger />
        <div className="flex items-center space-x-4 ml-auto">
          <ModerationIcon />
          {isAdmin && <AdminMenu />}
          <ThemeToggle />
          <Button variant="outline" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] h-4 min-w-4 flex items-center justify-center rounded-full">
              5
            </Badge>
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout} className="flex gap-1.5">
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
