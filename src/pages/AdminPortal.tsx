
import { useEffect, useState } from "react";
import { AdminMenu } from "@/components/admin/AdminMenu";
import { AppHeader } from "@/components/shared/AppHeader";
import { UserManagement } from "@/components/admin/UserManagement";
import OrganizationManagement from "@/components/admin/OrganizationManagement";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { SystemInfo } from "@/components/admin/SystemInfo";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserRole } from "@/components/admin/hooks/useUserRole";
import { setUserAsGlobalAdmin } from "@/utils/admin/setUserAsGlobalAdmin";

const AdminPortal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, userRole } = useUserRole();
  const [currentView, setCurrentView] = useState<string>("users");

  // On mount, process specific SA ID to make global admin (for onboarding)
  useEffect(() => {
    const makeSpecificUserAdmin = async () => {
      await setUserAsGlobalAdmin('7810205441087');
    };
    
    // Run this once when the component mounts
    makeSpecificUserAdmin();
  }, []);
  
  // Determine current view from location state or URL query
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
      default:
        return <UserManagement />;
    }
  };

  if (!isAdmin && userRole !== 'global_admin' && userRole !== 'org_admin') {
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
