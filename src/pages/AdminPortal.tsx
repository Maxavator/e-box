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
import { Link2, ShieldAlert, ArrowLeft } from "lucide-react";
import { useUserRole } from "@/components/admin/hooks/useUserRole";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MainLayout } from "@/components/shared/MainLayout";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

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
      <div className="p-4 md:p-6 space-y-6 md:space-y-8">
        <Card className="p-6 border-l-4 border-l-primary">
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
              <Button
                variant="outline"
                onClick={() => {
                  setActiveView('dashboard');
                  navigate('/admin', { state: { view: 'dashboard' } });
                }}
                className="flex items-center gap-2 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            )}
          </div>
        </Card>

        <Separator className="my-6" />

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

        {activeView === 'users' && (
          <Card className="p-6">
            <UserManagement />
          </Card>
        )}
        
        {activeView === 'organizations' && (
          <Card className="p-6">
            <OrganizationManagement />
          </Card>
        )}
        
        {activeView === 'settings' && (
          <Card className="p-6">
            <SystemSettings />
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default AdminPortal;
