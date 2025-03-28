
import { AppSidebar } from "@/components/shared/AppSidebar";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
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

  // Force sidebar to be visible on page load
  useEffect(() => {
    const sidebarCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('sidebar:state='));
    
    // If the sidebar is collapsed, set it to expanded
    if (sidebarCookie && sidebarCookie.split('=')[1] === 'collapsed') {
      document.cookie = 'sidebar:state=expanded; path=/; max-age=604800';
    }
  }, []);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <main className={`flex-1 overflow-auto ${!isMobile ? 'md:ml-[var(--sidebar-width)]' : ''} transition-all duration-300`}>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}

// This is a higher-order component to wrap any page component with MainLayout
export function withMainLayout(Component: React.ComponentType<any>) {
  return function WrappedComponent(props: any) {
    return (
      <MainLayout>
        <Component {...props} />
      </MainLayout>
    );
  };
}
