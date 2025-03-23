
import { AppHeader } from "@/components/shared/AppHeader";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SidebarProvider } from "@/components/ui/sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Failed to logout");
    }
  };

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <AppHeader onLogout={handleLogout} onLogoClick={handleLogoClick} />
        <div className="flex flex-1 overflow-hidden">
          <AppSidebar />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
