
import { AppHeader } from "@/components/shared/AppHeader";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect } from "react";
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";

// Create a client for components using MainLayout
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

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

  // Force sidebar to be visible on page load
  useEffect(() => {
    // We need to make sure the sidebar is visible when the page loads
    const sidebarCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('sidebar:state='));
    
    // If the sidebar is collapsed, set it to expanded
    if (sidebarCookie && sidebarCookie.split('=')[1] === 'collapsed') {
      document.cookie = 'sidebar:state=expanded; path=/; max-age=604800';
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider defaultOpen={true}>
        <div className="flex flex-col h-screen w-full bg-background">
          <AppHeader onLogout={handleLogout} onLogoClick={handleLogoClick} />
          <div className="flex flex-1 overflow-hidden">
            <AppSidebar />
            <main className="flex-1 overflow-auto">
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={100} className="px-4">
                  <div className="h-full w-full max-w-7xl mx-auto">
                    {children}
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </QueryClientProvider>
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
