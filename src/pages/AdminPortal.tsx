
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppHeader } from "@/components/shared/AppHeader";
import { NavigationCards } from "@/components/admin/dashboard/NavigationCards";
import { LookupTools } from "@/components/admin/dashboard/LookupTools";
import { StatsCards } from "@/components/admin/dashboard/StatsCards";
import { UserManagement } from "@/components/admin/UserManagement";
import { SystemSettings } from "@/components/admin/SystemSettings";
import OrganizationManagement from "@/components/admin/OrganizationManagement";
import { GlobalAdminDashboard } from "@/components/admin/GlobalAdminDashboard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link2 } from "lucide-react";
import { useUserRole } from "@/components/admin/hooks/useUserRole";

const AdminPortal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialView = location.state?.view || 'dashboard';
  const [activeView, setActiveView] = useState<'dashboard' | 'users' | 'organizations' | 'settings'>(initialView);
  const { isAdmin, userRole, isLoading } = useUserRole();

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please login to access this page");
        navigate("/auth");
        return;
      }

      // Wait for role check to complete
      if (!isLoading && !isAdmin && userRole !== 'org_admin') {
        toast.error("You don't have permission to access the admin portal");
        navigate("/");
      }
    };

    checkAccess();
  }, [navigate, isAdmin, userRole, isLoading]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  const handleLogoClick = () => {
    setActiveView('dashboard');
    navigate('/admin', { state: { view: 'dashboard' } });
  };

  const handleViewChange = (view: 'dashboard' | 'users' | 'organizations' | 'settings') => {
    setActiveView(view);
  };

  // Show loading state while checking permissions
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // If not admin or org_admin, this will redirect through the useEffect
  if (!isAdmin && userRole !== 'org_admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader onLogout={handleLogout} onLogoClick={handleLogoClick} />
      <main className="container mx-auto p-8 space-y-8">
        {userRole === 'global_admin' ? (
          // Show the enhanced Global Admin Dashboard for global_admin users
          <GlobalAdminDashboard />
        ) : (
          // Show regular Organization Admin interface for org_admin users
          <>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Admin Portal</h1>
                <p className="text-muted-foreground">
                  Manage your organization's settings and users
                </p>
              </div>
              {activeView !== 'dashboard' && (
                <button
                  onClick={() => {
                    setActiveView('dashboard');
                    navigate('/admin', { state: { view: 'dashboard' } });
                  }}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Link2 className="w-4 h-4" />
                  Back to Dashboard
                </button>
              )}
            </div>

            {activeView === 'dashboard' && (
              <>
                <NavigationCards 
                  activeView={activeView}
                  onViewChange={handleViewChange}
                />
                
                <div className="grid gap-8 md:grid-cols-2">
                  <StatsCards />
                  <LookupTools />
                </div>
              </>
            )}

            {activeView === 'users' && <UserManagement />}
            {activeView === 'organizations' && <OrganizationManagement />}
            {activeView === 'settings' && <SystemSettings />}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminPortal;
