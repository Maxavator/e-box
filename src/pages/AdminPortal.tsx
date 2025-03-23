
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NavigationCards } from "@/components/admin/dashboard/NavigationCards";
import { LookupTools } from "@/components/admin/dashboard/LookupTools";
import { StatsCards } from "@/components/admin/dashboard/StatsCards";
import { UserManagement } from "@/components/admin/UserManagement";
import { SystemSettings } from "@/components/admin/SystemSettings";
import OrganizationManagement from "@/components/admin/OrganizationManagement";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link2, ShieldAlert } from "lucide-react";
import { useUserRole } from "@/components/admin/hooks/useUserRole";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MainLayout } from "@/components/shared/MainLayout";

const AdminPortal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialView = location.state?.view || 'dashboard';
  const [activeView, setActiveView] = useState<'dashboard' | 'users' | 'organizations' | 'settings'>(initialView);
  const { isAdmin, userRole, isLoading } = useUserRole();
  
  const hasAdminAccess = isAdmin || userRole === 'global_admin' || userRole === 'org_admin';

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please login to access this page");
        navigate("/auth");
        return;
      }

      // Wait for role check to complete
      if (!isLoading && !hasAdminAccess) {
        toast.error("You don't have permission to access the admin portal");
        navigate("/");
      }
    };

    checkAccess();
  }, [navigate, isAdmin, userRole, isLoading, hasAdminAccess]);

  const handleViewChange = (view: 'dashboard' | 'users' | 'organizations' | 'settings') => {
    setActiveView(view);
  };

  // Show loading state while checking permissions
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-muted rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-muted rounded mb-2"></div>
          <div className="h-3 w-24 bg-muted-foreground/50 rounded"></div>
        </div>
      </div>
    );
  }

  // If not admin or org_admin, this will redirect through the useEffect
  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You don't have permission to access the admin portal. This page requires admin privileges.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-4 md:p-8 space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Admin Portal</h1>
            <p className="text-muted-foreground">
              {userRole === 'global_admin' 
                ? 'Manage all organizations, users, and system settings' 
                : 'Manage your organization settings and users'}
            </p>
          </div>
          {activeView !== 'dashboard' && (
            <button
              onClick={() => {
                setActiveView('dashboard');
                navigate('/admin', { state: { view: 'dashboard' } });
              }}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
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
            
            <div className="grid gap-8 lg:grid-cols-2">
              <StatsCards />
              <LookupTools />
            </div>
          </>
        )}

        {activeView === 'users' && <UserManagement />}
        {activeView === 'organizations' && <OrganizationManagement />}
        {activeView === 'settings' && <SystemSettings />}
      </div>
    </MainLayout>
  );
};

export default AdminPortal;
