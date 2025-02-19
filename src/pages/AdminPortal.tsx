
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { UserManagement } from "@/components/admin/UserManagement";
import { OrganizationManagement } from "@/components/admin/OrganizationManagement";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { AppHeader } from "@/components/shared/AppHeader";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DashboardView } from "@/components/admin/dashboard/DashboardView";
import { NavigationCards } from "@/components/admin/dashboard/NavigationCards";

const AdminPortal = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'dashboard' | 'users' | 'organizations' | 'settings'>('dashboard');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: isGlobalAdmin, error } = await supabase.rpc('is_global_admin');
      
      if (error) {
        console.error('Error checking admin status:', error);
        toast.error("Failed to verify admin status");
        navigate("/");
        return;
      }

      if (!isGlobalAdmin) {
        toast.error("Access denied: Admin privileges required");
        navigate("/");
        return;
      }

      setIsAdmin(true);
    };

    checkAdminStatus();
  }, [navigate]);

  const handleLogout = () => {
    navigate("/");
  };

  const handleLogoClick = () => {
    navigate("/organization");
  };

  const renderView = () => {
    switch (activeView) {
      case 'users':
        return <UserManagement />;
      case 'organizations':
        return <OrganizationManagement />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <DashboardView />;
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex-1 min-h-screen bg-gray-50">
      <AppHeader onLogout={handleLogout} onLogoClick={handleLogoClick} />

      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500">Manage your system and monitor key metrics</p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {activeView === 'dashboard' && <DashboardView />}
        
        <NavigationCards activeView={activeView} onViewChange={setActiveView} />

        {activeView !== 'dashboard' && (
          <div className="mt-8">
            <Button 
              variant="ghost" 
              onClick={() => setActiveView('dashboard')}
              className="mb-4"
            >
              ← Back to Dashboard
            </Button>
            {renderView()}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPortal;
