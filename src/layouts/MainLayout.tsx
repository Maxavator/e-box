
import { AppSidebar } from "@/components/shared/AppSidebar";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    if (!isMobile) {
      const sidebarCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('sidebar:state='));
      
      // If the sidebar is collapsed, set it to expanded
      if (sidebarCookie && sidebarCookie.split('=')[1] === 'collapsed') {
        document.cookie = 'sidebar:state=expanded; path=/; max-age=604800';
      }
    }
  }, [isMobile]);

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <main className={`flex-1 overflow-auto ${!isMobile ? 'md:ml-[var(--sidebar-width)]' : ''} transition-all duration-300`}>
          {isMobile && (
            <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm p-2 border-b">
              <div className="flex items-center justify-between">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="sidebar-trigger md:hidden" 
                  onClick={() => {
                    // Find and trigger the sidebar toggle
                    const sidebarTrigger = document.querySelector('[data-sidebar="trigger"]');
                    if (sidebarTrigger) {
                      (sidebarTrigger as HTMLButtonElement).click();
                    }
                  }}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="flex-1 flex justify-center">
                  <img 
                    src="/lovable-uploads/dbb30299-d801-4939-9dd4-ef26c4cc55cd.png" 
                    alt="e-Box" 
                    className="h-8 w-auto" 
                  />
                </div>
                <div className="w-8"></div> {/* Spacer to balance the menu button */}
              </div>
            </div>
          )}
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
