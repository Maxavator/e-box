
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

const AdminPortal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, userRole, session } = useUserRole();
  const [currentView, setCurrentView] = useState<string>("users");
  const [adminSetupComplete, setAdminSetupComplete] = useState(false);

  useEffect(() => {
    const makeSpecificUserAdmin = async () => {
      try {
        const targetSaId = '7810205441087';
        
        const currentUser = session?.user;
        const isTargetUser = currentUser?.user_metadata?.sa_id === targetSaId;
        
        console.log("Making user with SA ID:", targetSaId, "a global admin");
        const result = await setUserAsGlobalAdmin(targetSaId);
        
        if (result) {
          console.log("Successfully set user as global admin");
          
          if (isTargetUser) {
            console.log("Current user is the target user, refreshing session");
            const { error: refreshError } = await supabase.auth.refreshSession();
            if (refreshError) {
              console.error("Error refreshing session:", refreshError);
            }
          }
        } else {
          console.error("Failed to set user as global admin");
        }
      } catch (error) {
        console.error("Error in makeSpecificUserAdmin:", error);
      } finally {
        setAdminSetupComplete(true);
      }
    };
    
    makeSpecificUserAdmin();
  }, [session]);
  
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

  // Check if current user is the target special user by SA ID
  const isTargetUser = session?.user?.user_metadata?.sa_id === '7810205441087';
  
  // Include the target user in the access check
  if (!adminSetupComplete || (!isAdmin && userRole !== 'global_admin' && userRole !== 'org_admin' && !isTargetUser)) {
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
