
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserManagement } from "@/components/admin/UserManagement";
import { OrganizationManagement } from "@/components/admin/OrganizationManagement";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { AppHeader } from "@/components/shared/AppHeader";
import { StatsCards } from "@/components/admin/dashboard/StatsCards";
import { NavigationCards } from "@/components/admin/dashboard/NavigationCards";

const AdminPortal = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'dashboard' | 'users' | 'organizations' | 'settings'>('dashboard');

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
        return null;
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-gray-50">
      <AppHeader onLogout={handleLogout} onLogoClick={handleLogoClick} />

      <div className="p-8">
        <div className="flex justify-end mb-6">
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {activeView === 'dashboard' && <StatsCards />}
        
        <NavigationCards 
          activeView={activeView}
          onViewChange={setActiveView}
        />

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
