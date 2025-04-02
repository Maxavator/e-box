
import { useEffect, useState } from "react";
import { AdminMenu } from "@/components/admin/AdminMenu";
import { AppHeader } from "@/components/shared/AppHeader";
import { UserManagement } from "@/components/admin/UserManagement";
import OrganizationManagement from "@/components/admin/OrganizationManagement";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { SystemInfo } from "@/components/admin/SystemInfo";
import { AfrovationUsers } from "@/components/admin/AfrovationUsers";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserRole } from "@/components/admin/hooks/useUserRole";
import { setUserAsGlobalAdmin } from "@/utils/admin/setUserAsGlobalAdmin";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Global admin SA IDs - users with these IDs will automatically have global admin access
const GLOBAL_ADMIN_SA_IDS = ['4010203040512', '7810205441087', '8905115811087'];

const AdminPortal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, userRole, session } = useUserRole();
  const [currentView, setCurrentView] = useState<string>("users");
  const [adminSetupComplete, setAdminSetupComplete] = useState(false);

  // Check if current user is one of the global admin users
  const isGlobalAdminUser = session?.user?.user_metadata?.sa_id && 
                           GLOBAL_ADMIN_SA_IDS.includes(session.user.user_metadata.sa_id);

  useEffect(() => {
    const ensureGlobalAdmins = async () => {
      try {
        // Setup all predefined global admin users
        for (const targetSaId of GLOBAL_ADMIN_SA_IDS) {
          console.log("Ensuring user with SA ID:", targetSaId, "is a global admin");
          
          try {
            const result = await setUserAsGlobalAdmin(targetSaId);
            if (result) {
              console.log("Successfully set user with SA ID:", targetSaId, "as global admin");
            }
          } catch (error) {
            console.error(`Error setting user with SA ID ${targetSaId} as global admin:`, error);
          }
        }
        
        // If current user is one of the global admins, refresh their session
        if (isGlobalAdminUser) {
          console.log("Current user is a global admin, refreshing session");
          const { error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError) {
            console.error("Error refreshing session:", refreshError);
          }
        }
      } catch (error) {
        console.error("Error in ensureGlobalAdmins:", error);
      } finally {
        setAdminSetupComplete(true);
      }
    };
    
    ensureGlobalAdmins();
  }, [session, isGlobalAdminUser]);
  
  useEffect(() => {
    const state = location.state as { view?: string } | null;
    const viewFromState = state?.view;
    
    if (viewFromState) {
      setCurrentView(viewFromState);
    }
  }, [location]);

  const handleLogout = async () => {
    navigate("/logout");
  };

  const handleLogoClick = () => {
    navigate("/dashboard");
  };

  const renderView = () => {
    switch (currentView) {
      case "users":
        return <UserManagement />;
      case "organizations":
        return <OrganizationManagement />;
      case "settings":
        return <SystemSettings />;
      case "system":
        return <SystemInfo />;
      case "afrovation":
        return <AfrovationUsers />;
      default:
        return <UserManagement />;
    }
  };

  // Include the global admin user in the access check
  if (!adminSetupComplete || (!isAdmin && userRole !== 'global_admin' && userRole !== 'org_admin' && !isGlobalAdminUser)) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader onLogout={handleLogout} onLogoClick={handleLogoClick} />
        <main className="container mx-auto p-6">
          <div className="bg-red-50 text-red-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold">Access Denied</h2>
            <p>Only administrators can access this area.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader onLogout={handleLogout} onLogoClick={handleLogoClick} />
      <div className="container mx-auto p-6">
        <AdminMenu activeView={currentView} setActiveView={setCurrentView} />
        <main className="mt-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default AdminPortal;
