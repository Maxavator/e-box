
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/shared/AppHeader";
import { NavigationCards } from "@/components/admin/dashboard/NavigationCards";
import { LookupTools } from "@/components/admin/dashboard/LookupTools";
import { StatsCards } from "@/components/admin/dashboard/StatsCards";
import { UserManagement } from "@/components/admin/UserManagement";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link2 } from "lucide-react";

const AdminPortal = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'dashboard' | 'users' | 'organizations' | 'settings'>('dashboard');

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
  };

  const handleOrganizationManagement = () => {
    navigate("/admin/organization");
  };

  const handleViewChange = (view: 'dashboard' | 'users' | 'organizations' | 'settings') => {
    setActiveView(view);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader onLogout={handleLogout} onLogoClick={handleLogoClick} />
      <main className="container mx-auto p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Portal</h1>
            <p className="text-muted-foreground">
              Manage your organization's settings and users
            </p>
          </div>
          {activeView !== 'dashboard' && (
            <button
              onClick={() => setActiveView('dashboard')}
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
              onOrganizationManagement={handleOrganizationManagement}
            />
            
            <div className="grid gap-8 md:grid-cols-2">
              <StatsCards />
              <LookupTools />
            </div>
          </>
        )}

        {activeView === 'users' && <UserManagement />}
        {activeView === 'settings' && <SystemSettings />}
      </main>
    </div>
  );
};

export default AdminPortal;
